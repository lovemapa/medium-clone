const escape = require('escape-regexp');
const userSchema = require('../models/user')
const helpers = require('../helpers/helperFunctions')
const helperClass = new helpers()


class User {
    async createUser(req, res) {

        try {
            const body = req.body

            if (body.password) {
                body.password = helperClass.hashPassword(body.password)
            }
            if (body.email)
                body.email = body.email.toLowerCase()

            const newUser = new userSchema(body);

            //Generate token
            newUser.token = helperClass.authTokenGenerate(newUser.email, newUser._id)

            const user = await newUser.save()
            return res.status(201).send({ sucess: true, message: "User created Successfully", data: user })
        } catch (err) {


            if (err.name == "ValidationError") {
                return res.status(500).send({ sucess: false, message: err.message })
            }

            if (err.code == 11000) {
                return res.status(500).send({ sucess: false, message: "Email already exists", data: null })
            }

            return res.status(500).send({ sucess: false, message: err, data: null })
        }
    }

    async login(req, res) {
        try {
            const { email, password, deviceToken } = req.body


            if (!email.toLowerCase() || !password) {
                return res.status(400).send({ sucess: false, message: "Email or Password missing", data: null })
            }

            if (!deviceToken) {
                return res.status(400).send({ sucess: false, message: "Device token is required", data: null })
            }
            const doesUserExists = await userSchema.findOne({ email: email.toLowerCase() })

            if (doesUserExists) {


                if (helperClass.comparePassword(password, doesUserExists.password)) {


                    const token = helperClass.authTokenGenerate(doesUserExists.email, doesUserExists._id)

                    const updatedUser = await userSchema.findByIdAndUpdate(doesUserExists._id, { token: token, deviceToken: deviceToken }, { new: true })

                    return res.status(200).send({ sucess: true, message: "Login Successfull", data: updatedUser })
                }
                else
                    return res.status(401).send({ sucess: false, message: "Wrong password", data: null })

            }
            else {

                return res.status(404).send({ sucess: false, message: "User doesn't exist", data: null })
            }

        } catch (err) {


            return res.status(500).send({ sucess: false, message: err, data: null })
        }

    }
    async getUsers(req, res) {

        try {

            const { contact, name } = req.query

            let searchQuery = {}

            if (contact || name) {

                searchQuery['$or'] = []
                if (name)
                    searchQuery.$or.push({ name: { $regex: escape(name), $options: 'i' } })
                if (contact)
                    searchQuery.$or.push({ contact: { $regex: escape(contact), $options: 'i' } })
            }
            const users = await userSchema.find(searchQuery, { password: 0, token: 0 }).sort({ _id: -1 })

            if (users.length)
                return res.status(200).send({ sucess: true, message: "Users found", data: users })
            else
                return res.status(200).send({ sucess: true, message: "No users found", data: users })




        } catch (err) {
            console.log(err)
            return res.status(500).send({ sucess: false, message: err, data: null })
        }
    }

    async logout(req, res) {

        if (req.userId) {

            const updatedUser = await userSchema.findByIdAndUpdate(req.userId, { token: "" })

            if (updatedUser)
                return res.status(200).send({ sucess: true, message: "User logged out successfully", data: null })
        }


        try {

        } catch (error) {
            return res.status(500).send({ sucess: false, message: err, data: null })
        }
    }


    async uploadFile() {

        try {

            await helperClass.uploadFile()
        } catch (err) {
            throw err
        }
    }


}

module.exports = User
