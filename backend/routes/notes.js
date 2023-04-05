const express= require('express');
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require('../models/Note');
const { body, validationResult } = require("express-validator");
const { findByIdAndUpdate } = require('../models/Note');

// Routes 1: GET LOGGEDIN USER DETAILS USING get: "/api/auth/getuser". login required

router.get('/fetchallnotes',fetchuser,async (req,res)=>{
    try{
    const notes = await Note.find({user : req.user.id})
    res.json(notes)
} catch (err) {
    console.log(err.message);
    res.status(500).send("Internal server error!!");
  
}   
})
// Routes 2: add a new note "/api/auth/getuser". login required

router.post('/addnote',fetchuser,[

    body('title', 'Enter a valid title').isLength({min:3}),
    body('description','Description must be atleast 5 characters').isLength({min:5})
],async (req,res)=>{
    try {
        
    
    const {title, description,tag}= req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const note = new Note({
        title, description, tag, user : req.user.id
    })
    const savedNode= await note.save()
      
    res.json(savedNode);
} catch (err) {
    console.log(err.message);
    res.status(500).send("Internal server error!!");
  
}
})
// RoUes 3: upadating an existing note

router.put('/updatenote/:id',fetchuser,async(req,res)=>{
    const {title,description,tag}= req.body;
    try{
    const newNote={};
    if(title){newNote.title=title};
    if(description){newNote.description=description};
    if(tag){newNote.tag=tag};

    
    let note = await Note.findById(req.params.id)
    if(!note){ return res.status(404).send("not found")};
    if(note.user.toString()!== req.user.id){
        return re.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(req.params.id,{$set : newNote},{new : true})
    res.json({note});
}catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error!!");
      
    }
})

// route 4 : delete an existing note

router.delete('/deletenote/:id',fetchuser,async(req,res)=>{
    const {title,description,tag}= req.body;
    
    try{
    
    let note = await Note.findById(req.params.id)
    if(!note){ return res.status(404).send("not found")};
    // allow deletion only if user owns this note
    if(note.user.toString()!== req.user.id){
        return re.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id)
    res.json({"Success" : "note has been deleted", note: note});
}catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error!!");
      
    }
})

module.exports= router
