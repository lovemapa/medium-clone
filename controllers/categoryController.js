const categorySchema = require('../models/category')


class Category {

    async addCategory(req, res) {


        try {
            const newCategory = new categorySchema(req.body);

            const category = await newCategory.save()

            return res.status(201).send({ sucess: true, message: "Category created Successfully", data: category })

        } catch (err) {
            console.log(err)
            return res.status(500).send({ sucess: false, message: err, data: null })
        }
    }

    async getCategories(req, res) {

        try {


            const categories = await categorySchema.find({}).sort({ _id: -1 })

            if (categories.length)
                return res.status(200).send({ sucess: true, message: "Categories found", data: categories })
            else
                return res.status(200).send({ sucess: true, message: "No categories found", data: categories })




        } catch (err) {
            console.log(err)
            return res.status(500).send({ sucess: false, message: err, data: null })
        }
    }
}

module.exports = Category