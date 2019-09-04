const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const trackerApp=require('./exerciseTracker')

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


//Create new user
app.post('/api/exercise/new-user',(req,res)=>{
  trackerApp.newUser(req.body.username,(err,data)=>{
    if(err)
      {
        res.json(err)
      }
    else
      {
        res.json(data)
      }
  })
})

//Array of all users
app.get('/api/exercise/users',(req,res)=>{
  trackerApp.getUsers((err,data)=>{
    if(err)
      {
        res.json(err)
      }
    else
      {
        res.json(data)
      }
  })
})

//Add exercise
app.post('/api/exercise/add',(req,res)=>{
  trackerApp.newExcercice(req.body,(err,data)=>{
    if(err)
      {
        res.json(err)
      }
    else
      {
        res.json(data)
      }
  })
})

//Array of exercises by userid
app.get('/api/exercise/log',(req,res)=>{
  //Can filter by optional parameters from,to and limit
  trackerApp.getExercises(req.query,(err,data)=>{
    if(err)
      {
        res.json(err)
      }
    else
      {
        res.json(data)
      }
  })
})


// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
