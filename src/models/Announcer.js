const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const anocSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    age:{
        type:Number,
        default:25,
        validate(value){
            if(value<0 || value>50 ){
                throw new Error('Age must be positive number')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minLength:6
    },
    phone:[{
        type:Number,
        trim:true,
        length:11,
        validate(value){
            Validator.isMobilePhone(value , 'ar-EG')
        }
    }],
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})
//////////////relation anoc vs report /////////// be in get all only
anocSchema.virtual('reports',{
    ref:'Rep',
    localField:'_id',
    foreignField:'owner'
})

//////////////to hash password ///////////////////////
anocSchema.pre('save',async function(next){
    const anoc = this
    if(anoc.isModified('password')){  ////if pass has change
        anoc.password = await bcrypt.hash(anoc.password,8)
    }
    next()
})
//////////////////////to chek email for login 
anocSchema.statics.findByCredentials= async (email,password) =>{
    const anoc = await Anoc.findOne({email:email})
    if(!anoc){
        throw new Error('plz sign up')
    }
    const isMatch = await bcrypt.compare(password,anoc.password)
    if(!isMatch){
        throw new Error('unable to login')
    }
    return anoc
}

/////////////////////////for token 
anocSchema.methods.generateToken = async function (){
    const anoc = this
    const token = jwt.sign({_id:anoc._id.toString()},'node-course')
    anoc.tokens = anoc.tokens.concat({token})  
    await anoc.save()  
    return token
}
///////////////////////////
anocSchema.methods.toJSON = function (){
    const anoc = this
    const anocObject = anoc.toObject()
    delete anocObject.password
    delete anocObject.tokens
    return anocObject
}


const Anoc = mongoose.model('Anoc',anocSchema)
module.exports = Anoc
