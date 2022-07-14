const router = require("express").Router();
const Conversation = require("../models/Conversation");

// new conv

router.post("/", async(req, res) => {

    const newConversation = new Conversation({
        members : [req.body.senderId , req.body.receiverId],
    });

    try{
        const saveConversation = await newConversation.save();
        res.status(200).json(saveConversation)

    }catch(error){
        console.log(error)
        res.status(500).json(error)
    }


})

//get conv of a user

module.exports = router;
