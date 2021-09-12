const postSchema = require('../models/post');
const categoryRouter = require('../routes/categoryRoutes');
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
}


module.exports = Post;