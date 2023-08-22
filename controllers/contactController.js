
const asyncHandler = require("express-async-handler");
const Contact = require('../models/contactModel');
//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getContacts =asyncHandler(async (req,res)=>{
    const contacts =await Contact.find({user_id:req.user.id});
    console.log(contacts);
    res.status(200).json(contacts);
});

//@desc Create new contact
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async(req,res)=>{
    console.log("the request body is:",req.body);
    const {name,email,phone,
   }=req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error("all fields are mandatory");
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id:req.user.id,
    });
    res.status(201).json(contact);
});

//@desc Get a contact
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async(req,res)=>{
    const {id}=req.params;
    console.log("request Id: ",id);
    const contact = await Contact.findById({_id:id});
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }
    res.status(200).json(contact);
});
//@desc Update a contact
//@route PUT /api/contacts/:id
//@access private
const updateContact =asyncHandler(async (req,res)=>{
    const {id}=req.params;
    const contact = await Contact.findById({_id:id});
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }

    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User don't have permission to update other user contacts");
    }

    const updateContact = await Contact.findByIdAndUpdate(
        id,
        req.body,
        {new:true}
    );
    res.status(200).json(updateContact);
})

//@desc Delete a contact
//@route DELETE /api/contacts/:id
//@access private
const deleteContact =asyncHandler(async (req,res)=>{
    const {id}=req.params;
    const contact = await Contact.findById({_id:id});
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }
    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User don't have permission to update other user contacts");
    }

    const deleteContact = await Contact.findByIdAndDelete({_id:id});
    res.status(200).json(deleteContact);

})


module.exports = {getContact,updateContact,getContacts,deleteContact,createContact};