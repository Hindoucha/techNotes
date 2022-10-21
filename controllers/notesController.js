const asyncHandler = require('express-async-handler')
const Note = require('../models/note')
const User = require('../models/user')

//@desc Get all notes
//@route GET /notes
//@access private
const getAllNotes = asyncHandler( async (req, res) => {
    const notes = await Note.find().lean()

    if(!notes?.length) { // if notes exist then if it has length
        return res.status(400).json({message: 'No notes found'})
    }

    // return users names within
    const notesWithUsers = await Promise.all( notes.map(async (note) => {
        const noteuUser = await User.findById(note.user).lean().exec()
        return {...note, username : noteuUser.username}
    }))

    res.json(notesWithUsers)
})

//@desc Create new Note
//@route POST /notes
//@access private
const createNewNote = asyncHandler( async (req, res) => {
    const {user, title, text} = req.body

    // confirm data
    if(!user || !title || !text) {
        return res.status(400).json({message: 'All fields are required'})
    }

    // my feature see later if I need it
    // check user exist
    //const noteUser = await User.findById(user).lean().exec()
    //if(!noteUser) {
    //    return res.status(400).json({message: 'User not found'})
    //}

    // check duplicate title
    const duplicate = await Note.findOne({title}).lean().exec()
    if(duplicate) {
        return res.status(409).json({message: 'Duplicate title'})
    }

    // create & store the new note
    const note = await Note.create({user, title, text})
    if(!note) {
        res.status(400).json({message: 'Invalid note data received'})
    } else {
        res.status(201).json({message: 'New note created'})
    }
})

//@desc Update a note
//@route PATCH /notes
//@access private
const updateNote = asyncHandler( async (req, res) => {
    const {id, user, title, text, completed} = req.body

    // confirm data
    if(!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({message : 'All fields are required'})
    }

    // check note exixts
    const note = await Note.findById(id).exec()
    if(!note) {
        return res.status(400).json({message: 'Note not found'})
    }

    // my feature see later if I need it
    // check new user exists
    //const newUser = await User.findById(user).lean().exec()
    //if(!newUser) {
    //    return res.status(400).json({message: 'User not found'})
    //}

    // check duplicate title
    const duplicate = await Note.findOne({title}).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id) { // there is a duplicate
        return res.status(409).json({message: 'Duplicate title'})
    }

    // update note

    note.user =user
    note.title = title
    note.text = text
    note.completed = completed

    const updatedNote = await note.save()
    
    res.json({message: `note '${updatedNote.title}'updated`})
})

//@desc Delete a note
//@route DELETE /notes
//@access private
const deleteNote = asyncHandler( async (req, res) => {
    const {id} = req.body

    // confirm data
    if(!id) {
        return res.status(400).json({message: 'Note ID required'})
    }

    // find & delete
    const note = await Note.findById(id).exec()
    if(!note) {
        return res.status(400).json({message: 'Note not found'})
    }

    const result = await note.deleteOne(note)

    const reply = `Note '${result.title}'  with id ${result.id} deleted`

    res.json(reply)
})

module.exports = {getAllNotes, createNewNote, updateNote, deleteNote}