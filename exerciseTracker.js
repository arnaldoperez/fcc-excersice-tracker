const dotenv=require('dotenv').config()
 
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI)

var Schema=mongoose.Schema

var userSchema=new Schema({username:String})

var exerciseSchema=new Schema({
  userId:{type:String, required:true},
  description:{type:String, required:true},
  duration:{type:Number, required:true},//Minutes
  date:{type:Date, required:false},
})

var User= mongoose.model('User',userSchema)
var Exercise= mongoose.model('Exercise',exerciseSchema)

//Create user and return user doc
exports.newUser=(username,callback)=>{
  var newUser=new User({username:username})
  newUser.save((err,data)=>{
    if(err)
      {
        callback(err)
      }
    else
      {
        callback(null,data)
      }
  })
}

//Returns an array of all user docs
exports.getUsers=(callback)=>{
  User.find((err,data)=>{
    if(err)
      {
        callback(err)
      }
    else
      {
        callback(null,data)
      }
  })
}

//Creates a new exercise and returns the exercise doc
exports.newExcercice=(exercise,callback)=>{
  var newExercise=new Exercise(exercise)
  newExercise.save((err,data)=>{
    if(err)
      {
        callback(err)
      }
    else
      {
        callback(null,data)
      }
  })
  
}

//Returns an array of exercises for a given user. It can be filtered with the query params
exports.getExercises=(query,callback)=>{
  var userId=query.userId
 
  User.findOne({_id:userId},(err,user)=>{
    if(err)
      {
        callback(err)
      }
    else
      {
        var dbQuery=Exercise.where({userId:userId}).select({description:1, duration:1, date:1, _id:0})
     
        dbQuery.exec((err,dataExercise)=>{
          //5d6ed9472db0833c1597cbdd          
          if(err)
            {
              callback(err)
            }
          else
            {
              var data={}
              data._id=user._id
              data.username=user.username
              data.count=dataExercise.length 
              data.log=dataExercise
              callback(null,data)
            }
        })
      }
    
  })
  
}