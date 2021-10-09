const postSchema = require('../models/post');
const postBookmakSchema = require('../models/bookMarkPost')
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
                searchQuery.category = category
            const posts = await postSchema.find(searchQuery)
                .populate({ path: "user", select: 'name' })
                .populate({ path: "category", select: 'name url' })
                .sort({ likes: -1 })

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
                .populate({ path: "post", select: 'body title category', populate: { path: "category", select: 'name url' } })

            if (bookmarkedPost.length)
                return res.status(200).send({ sucess: true, message: "Post found", data: bookmarkedPost })
            else
                return res.status(200).send({ sucess: true, message: "Not bookmarked Yet" })

        } catch (error) {
            throw error
        }
    }
}


module.exports = Post;