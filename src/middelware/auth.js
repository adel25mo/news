const jwt = require('jsonwebtoken')
const Anoc = require('../models/Announcer')

const auth = async(req,res,next)=>{
    try {
        const token = req.header('Authorization').replace('Bearer ','')
        const decode = jwt.verify(token,'node-course')
        const anoc = await Anoc.findOne({_id:decode._id,'tokens.token':token})
        if(!anoc){
            throw new Error()
        }
       req.anoc = anoc
       req.token = token
       next()
    } 
    catch (e) {
        res.status(401).send({error:'Please authencticate'})
    }
    
}


module.exports = auth