const express = require('express')
const router = new express.Router()
const Anoc = require('../models/Announcer')
const auth = require('../middelware/auth')
const multer = require('multer')


router.post('/Announcer',async(req,res)=>{
    try{
        const anoc = new Anoc(req.body)
        const token = await anoc.generateToken()
        await anoc.save()
        res.status(200).send({anoc,token})
    }
    catch(e){
        res.status(400).send("e"+e)
    }
})

router.post('/Announcer/login',async(req,res)=>{
    try {
        const anoc = await Anoc.findByCredentials(req.body.email,req.body.password)
        const token = await anoc.generateToken()
        res.status(200).send({anoc,token})
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/Announcer',auth,(req,res)=>{
    Anoc.find({}).then((anocs)=>{
        res.status(200).send(anocs)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})

router.get('/profile',auth,async(req,res)=>{
    res.send(req.anoc)
})


router.get('/Announcer/:id',auth,(req,res)=>{
    const _id = req.params.id
    Anoc.findById({_id}).then((anoc)=>{
        if(!anoc){
            return  res.status(404).send('unable to find anoc !!')
        }
       res.status(200).send(anoc)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})

router.patch('/Announcer/:id',auth,async(req,res)=>{
    try{
    const updates = Object.keys(req.body) 
    const allowedUpdates = ["name","password","phone","avatar"]
    var isValid = updates.every((update)=> allowedUpdates.includes(update))
    if(!isValid){
        return res.status(400).send('Cannot update')
    }   
    const _id = req.params.id
        const anoc = await Anoc.findById(_id)
        if(!anoc){
            return res.status(404).send('No anoc is found')
        }
        updates.forEach((update)=> anoc[update] = req.body[update])
        await anoc.save() 
        res.status(200).send(anoc)
    }
catch(e){
    res.status(400).send('error'+e)
}
})


router.delete('/Announcer/:id',auth,async(req,res)=>{
    try {
        const _id = req.params.id
        const anoc = await Anoc.findByIdAndDelete(_id)
       if(!anoc){
        return res.status(404).send('unable to find anoc')
    }
        res.status(200).send(anoc)
    } catch (error) {
        return res.status(500).send(error)
    }
})

router.delete('/logout',auth,async(req,res)=>{
    try{
        req.anoc.tokens = req.anoc.tokens.filter((el)=>{
            return el.token !== req.token
        })
        await req.anoc.save()
        res.send('Logout Success')
    }
    catch(e){
        res.status(500).send(e)
    }
})
router.delete('/logoutAll',auth,async(req,res)=>{
    try{
        req.anoc.tokens=[]
        await req.anoc.save()
        res.send('logout all was done successfully')
    }
    catch(e){
        res.status(500).send(e)
    }
})


const uploads = multer({
    limits:{
        fileSize:1000000 
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
            cb(new Error('Sorry you must upload image'))
        }
        cb(null,true)
    }
})
router.post('/profile/avatar',auth,uploads.single('avatar'),async(req,res)=>{
   try{
       req.anoc.avatar = req.file.buffer
       await req.anoc.save()
       res.send('done image')
   }
   catch(e){
       res.status(500).send(e)
   }
})

module.exports= router