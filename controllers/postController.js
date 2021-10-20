const postSchema = require('../models/post');
const postBookmakSchema = require('../models/bookMarkPost')
const Mongoose = require('mongoose');
const likePostSchema = require('../models/likePost')
class Post {


    async createPost(req, res) {

        try {
            const body = req.body

            if (req.userId)
                body.user = req.userId


            const newPost = new postSchema(body);

            const post = await newPost.save()
            return res.status(201).send({ sucess: true, message: "Post created Successfully", data: post })

        } catch (error) {
            throw error
        }
    }


    async getPosts(req, res) {

        try {


            const { category } = req.query
            let searchQuery = {}

            if (category)
                searchQuery.category = Mongoose.Types.ObjectId(category)

            const posts = await postSchema.aggregate([
                {
                    "$match": searchQuery
                },
                {
                    $lookup: {
                        from: "likeposts",
                        localField: "_id",
                        foreignField: "post",
                        as: "likes"
                    }
                },
                {

                    $lookup: {
                        from: "categories",
                        localField: "category",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                {

                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $unwind: "$category"
                },
                {
                    $unwind: "$user"
                },
                {
                    $group: {
                        _id: "$_id",
                        totalLikes: {
                            $sum: {
                                $size: "$likes"
                            }
                        },
                        title: { $first: "$title" },
                        category: { $first: "$category" },
                        body: { $first: "$body" },
                        user: { $first: "$user" },
                        likesArray: { $first: "$likes" },
                        createdAt: { $first: "$createdAt" },
                        updatedAt: { $first: "$updatedAt" },

                    }
                },
                {
                    $project: {
                        totalLikes: 1,
                        title: 1,
                        category: 1,
                        body: 1,
                        "user.name": 1,
                        // Check if post is liked by login user
                        isLiked: {
                            "$cond": {
                                "if": {
                                    "$eq": [{
                                        $size: {
                                            $filter: {
                                                input: "$likesArray",
                                                as: "item",
                                                cond: { $eq: ["$$item.user", Mongoose.Types.ObjectId(req.userId)] }
                                            }
                                        }
                                    }, 1]
                                },
                                "then": true,
                                "else": false
                            }
                        },
                        createdAt: 1,
                        updatedAt: 1
                    }
                },
                {
                    $sort: {
                        totalLikes: -1
                    }
                }
            ]);



            if (posts.length)
                return res.status(200).send({ sucess: true, message: "Posts found", data: posts })
            else
                return res.status(200).send({ sucess: true, message: "No Posts found" })

        } catch (error) {
            throw error
        }
    }

    async getPost(req, res) {

        try {

            const { postId } = req.params


            const post = await postSchema.findById(postId)
                .populate('totalLikes')
                .populate({ path: 'isLiked', match: { user: req.userId } })
                .populate({ path: "user", select: 'name' })
                .populate({ path: "category", select: 'name url' })
                .sort({ likes: -1 })

            if (post)
                return res.status(200).send({ sucess: true, message: "Post found", data: post })
            else
                return res.status(200).send({ sucess: true, message: "No Posts found" })

        } catch (error) {
            throw error
        }
    }


    async updatePost(req, res) {

        try {


            const { name, title, category, likes } = req.body
            const postId = req.params.postId
            let updateQuery = {}

            const post = await postSchema.findById(postId)

            if (likes) {
                if (req.userId.toString() !== post.user.toString())
                    updateQuery['$inc'] = { likes: 1 }
                else
                    return res.status(400).send({ sucess: false, message: "You cannot like your own post" })
            }

            if (name || title || category) {
                if (req.userId.toString() !== post.user.toString())
                    return res.status(400).send({ sucess: false, message: "You cannot update this post" })
                else {
                    if (name)
                        updateQuery.name = name;

                    if (title)
                        updateQuery.title = title;

                    if (body)
                        updateQuery.body = body;

                    if (category)
                        updateQuery.category = category;

                }


            }

            console.log(updateQuery);
            const updatedPost = await postSchema.findByIdAndUpdate(postId, updateQuery, { new: true })

            if (updatedPost)

                return res.status(200).send({ sucess: true, message: "Updated Successfully", data: updatedPost })


        } catch (error) {
            throw error
        }
    }


    async bookMarkPost(req, res) {
        try {

            const postId = req.params.postId

            if (postId && req.userId) {

                const isAlreadyBookmarked = await postBookmakSchema.findOne({
                    user: req.userId,
                    post: postId
                })
                if (isAlreadyBookmarked) {
                    return res.status(500).send({ sucess: false, message: "Post already bookmarked" })
                }
                else {
                    const bookMarkPost = new postBookmakSchema({
                        user: req.userId,
                        post: postId
                    })

                    await bookMarkPost.save()
                    if (bookMarkPost)
                        return res.status(201).send({ sucess: true, message: "Post Bookmarked" })
                    else {
                        return res.status(500).send({ sucess: false, message: "Post couldn't be bookmarked" })
                    }

                }
            }
            else {
                return res.status(400).send({ sucess: false, message: "PostId is required" })
            }
        } catch (error) {
            throw error
        }
    }

    async removeBookMarkPost(req, res) {
        try {

            const postId = req.params.postId

            if (postId) {

                const removedBookmarked = await postBookmakSchema.findByIdAndDelete(postId)
                if (removedBookmarked)
                    return res.status(200).send({ sucess: true, message: "Removed Bookmarked" })
                else {
                    return res.status(500).send({ sucess: false, message: "Post couldn't be un-bookmarked" })
                }
            }
            else {
                return res.status(400).send({ sucess: false, message: "PostId is required" })
            }
        } catch (error) {
            throw error
        }
    }

    async getBookmarkedPosts(req, res) {

        try {

            const bookmarkedPost = await postBookmakSchema.find({ user: req.userId }, { user: 0, createdAt: 0, updatedAt: 0 })
                .populate({ path: "post", select: 'body title category', populate: 'isLiked', populate: { path: "category", select: 'name url' } })

            if (bookmarkedPost)
                return res.status(200).send({ sucess: true, message: "Post found", data: bookmarkedPost })
            else
                return res.status(200).send({ sucess: true, message: "Not bookmarked Yet" })

        } catch (error) {
            throw error
        }
    }


    async likePost(req, res) {
        try {

            const postId = req.params.postId

            if (postId && req.userId) {

                const isAlreadyLiked = await likePostSchema.findOne({
                    user: req.userId,
                    post: postId
                })

                if (isAlreadyLiked) {
                    return res.status(400).send({ sucess: false, message: "Post already liked" })
                }
                else {

                    const likePost = new likePostSchema({
                        user: req.userId,
                        post: postId
                    })

                    await likePost.save()
                    if (likePost)
                        return res.status(200).send({ sucess: true, message: "Post liked" })
                    else {
                        return res.status(500).send({ sucess: false, message: "Post couldn't be liked" })
                    }
                }

            }
            else {
                return res.status(400).send({ sucess: false, message: "PostId is required" })
            }
        } catch (error) {
            throw error
        }
    }
    async unlikePost(req, res) {

        const postId = req.params.postId
        if (postId) {

            const deletedPost = await likePostSchema.findOneAndDelete({ post: postId, user: req.userId })

            if (deletedPost) {
                return res.status(200).send({ sucess: true, message: "Post unliked" })
            }
            else {
                return res.status(200).send({ sucess: true, message: "Post doesn't exist" })
            }

        }

    }
}


module.exports = Post;