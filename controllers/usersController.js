const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Note = require('../models/note')

//@desc Get all users
//@route GET /users
//@access private
const getAllUsers = asyncHandler(async(req, res) => {
    const users = await User.find().select('-password').lean()
    if(!users) {
        return res.status(400).json({message: 'No users found'})
    }

    res.status(200).json(users)
})

//@desc Create new user
//@route POST /users
//@access private
const createNewUser = asyncHandler(async(req, res) => {
    // get data
    const {username, password, roles} = req.body

    // confirm data
    if(!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({message: 'All field required'})
    }

    // check duplicate
    const duplicate = await User.findOne({username}).lean().exec()
    if(duplicate) {
        return res.status(409).json({message: 'Duplicate username'})
    }

    // create and store user
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds
    const userObject = {
        username,
        "password" : hashedPwd,
        roles
    }

    const user = await User.create(userObject)
    if(!user) {
        res.status(400).json({message: 'Invalid user data received'})
    } else {
        res.status(200).json({message: `User ${user.username} created`})
    }
})

//@desc Update a user
//@route PATCH /users
//@access private
const updateUser = asyncHandler(async(req, res) => {
    // get data
    const {id, username, password, roles, active} = req.body

    // confirm data
    if(!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({message: 'All fields are required'})
    }

    // if exists
    const user = await User.findById(id).exec()
    if(!user) {
        return res.status(400).json({message: 'User not found'})
    }

    // check duplicate
    const duplicate = await User.findOne({username}).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id) { // there is a duplicate
        return res.status(409).json({message: 'Duplicate username'})
    }

    // update user
    user.username = username
    user.roles = roles
    user.active = active

    // special traitment for Pwd
    if(password) {
        user.password = await bcrypt.hash(password, 10) // salt rouns
    }

    const updatedUser = await user.save()

    res.status(200).json(`User ${updatedUser.username} updated`)
})

//@desc Delete a user
//@route DELETE /users
//@access private
const deleteUser = asyncHandler(async(req, res) => {
    // get id
    const {id} = req.body

    // confirm data
    if(!id) {
        return res.status(400).json({message: 'User ID required'})
    }

    // check assigned note
    const note = await Note.findOne({user: id }).lean().exec()
    if(note) {
        return res.status(400).json({message: `User ${id} has assigned notes`})
    }

    // find user
    const user = await User.findById(id).exec()
    if(!user) {
        return res.status(400).json({message: 'User not found'})
    }

    // delete
    const result = await user.deleteOne()

    const reply = `User ${result.username} with ID ${result._id} deleted`

    res.status(200).json(reply)
})

module.exports = {getAllUsers, createNewUser, updateUser, deleteUser}