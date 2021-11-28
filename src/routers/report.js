const express = require('express')
const Rep = require('../models/report')
const router = new express.Router()
const auth = require('../middelware/auth')

const multer = require('multer')
const Report = require('../models/report')

router.post('/reports',auth,async(req,res)=>{
    try{
        const report = new Report({...req.body,owner:req.anoc._id})
        await report.save()
        res.status(200).send(report)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.get('/reports',auth,async(req,res)=>{
    try{
        const sort = {}
        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] ==='desc' ? -1 : 1

        }
        await req.anoc.populate({
            path:'reports',
            options:{
                sort:sort
            }
        })
        res.status(200).send(req.anoc.reports)
    }
    catch(e){
        res.status(400).send('e'+e)
    }
})

router.get('/reports/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const report = await Rep.findOne({_id,owner:req.anoc._id})
        if(!report){
            return res.status(404).send('No report is found')
        }
        res.status(200).send(report)
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.patch('/reports/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const updates = Object.keys(req.body)
        const report = await Rep.findOne({_id,owner:req.anoc._id})
        if(!task){
            return res.status(404).send('No report is found')
        }
        updates.forEach((el)=>report[el]=req.body[el])
        await report.save()
        res.send(report)
    }
    catch(e){
        res.status(400).send('e'+ e)
    }
})


router.delete('/reports/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const report = await Rep.findOneAndDelete({_id,owner:req.anoc._id})
        if(!report){
        return  res.status(404).send('No report is found')
        }
        res.status(200).send(report)
    }
    catch(e){
        res.status(500).send('e'+e)
    }
})

router.get('/anocReporter/:id',auth,async(req,res)=>{
    try {
        const _id = req.params.id
        const report = await Rep.findOne({_id,owner:req.anoc._id})
        if(!report){
            return  res.status(404).send('No report is found')
        }
        await report.populate('owner')
        res.status(200).send(report.owner)
    } catch (e) {
        res.status(500).send(e)
    }
})

const uploads2 = multer({
    limits:{
        fileSize:1000000 
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|jfif|JPG|JPEG|PNG|JFIF)$/)){
            cb(new Error('Sorry you must upload image'))
        }
        cb(null,true)
    }
})
router.post('/report/avatar',auth,uploads2.single('avatar2'),async(req,res)=>{
   try{
       req.report.avatarnew = req.file.buffer
       await req.report.save()
       res.send('done image')
   }
   catch(e){
       res.status(500).send(e)
   }
})






module.exports= router