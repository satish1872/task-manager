import express from 'express';
import User from './models/user.js';
import mongoose, { mongo } from "mongoose";
import validator from "validator";
import Task from './models/task.js';
import userRouter from './routers/user.js';
import taskRouter from './routers/task.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import multer from 'multer';
import mailjet from 'node-mailjet';
// import { connect } from 'node-mailjet';
const { connect } = mailjet;


const connectionURL = 'mongodb://localhost:27017'; // Replace with your MongoDB connection URL
const databaseName = 'task-manager-api'; 



mongoose.connect(`${connectionURL}/${databaseName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const errorMiddleware =(req,res,next)=>{
  throw new Error('from my middleware');
}

/* 
when ever we use async keyword infront of some function ,
it return a promise instead of returning a value , so now we can attach 
.then() .catch() callback over that function
*/
const app=express();  

const port =process.env.PORT || 3000;
/* 
without middleware: new request-> run route handler
with middleware: new request-> do something-> run route handler
*/

// middleware example 1

/*
 app.use((req,res,next)=>{
  if(req.method=='GET'){
    res.send('get request are disabled');
  }
  else
  next();
});
 */

/* app.set('maintenance',true);

app.use((req,res,next)=>{
  if(app.get('maintenance'))
  return res.status(503).send('service temporarility unavailabe due to maintainence')
  else
  next();
})
 */ 


/* 
app.use((req,res,next)=>{
  if(req.method=='GET'){
    res.send('get request are disabled');
  }
  else
  next();
}); */

const upload =multer({
  dest:'images',
  limits:{
    fileSize:1000000
  },
  fileFilter(req,file,cb){
    /* if(!file.originalname.endsWith('.pdf')){
      return cb(new Error('please upload a PDF file'));
    } */
    if(!file.originalname.match(/^.+\.docx$/i)){
      return cb(new Error('please upload a word document'));
    }

    // cb(new Error('file must be a image'))
    cb(undefined,true); // silently accept the upload
    // cb(undefined,false);// silently reject the upload
  }
});

/* app.post("/upload",upload.single('upload'),(req,res)=>{
  res.send()
}) */

app.post("/upload",errorMiddleware,(req,res)=>{
  res.send()
},(err,req,res,next)=>{
  res.status(400).send({message:err.message});
})


// Initializing the Mailjet connection
// https://app.mailjet.com/auth/get_started/developer
const connectedMailjet = await connect('****************************1234', '****************************abcd');

// Making the request
const request = connectedMailjet
  .post("/send", {'version': 'v3.1'})
  .request({
    "Messages": [
      {
        "From": {
          "Email": "satish18072000@gmail.com",
          "Name": "satish1"
        },
        "To": [
          {
            "Email": "satish18072000@gmail.com",
            "Name": "satish2"
          }
        ],
        "Subject": "Greetings from Mailjet.",
        "TextPart": "My first Mailjet email",
        "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
        "CustomID": "AppGettingStartedTest"
      }
    ]
  });

// Handling the response and potential errors
request
  .then(result => {
    console.log(result.body);
  })
  .catch(err => {
    console.log(err.statusCode);
  });


app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


const myFunction= async ()=>{
  const password='Redhat123';
  const hashedPassword= await bcrypt.hash(password,8);
  console.log(hashedPassword); 
  const isMatch=await bcrypt.compare(password,hashedPassword);
  if(isMatch)
  console.log("Password matched");
}

myFunction();



 app.get('/', (req, res) =>{
  res.send('express get called from root file');
}); 


app.listen(port,()=>{
  console.log(`server running on port ${port}`)
});



// lecture: 112
/*  
what toJSON method is doing ?
*/

/* const pet={
  name:'Panda'
}
pet.toJSON =function (){
  console.log("this is",this);
  return {};
}

console.log(JSON.stringify(pet));

 */
 /* whenever we are calling res.send({user:user}) , express is 
calling  JSON.stringify() over {user:user}

 */

/*  const main1= async ()=>{
  const task= await Task.findById("64f4362bf8843cc9227bcf97").populate('owner');
  //issue : The .populate() method on a Mongoose document doesn't immediately populate the fields. Instead, it sets up the necessary requirements for population. To actually perform the population, you'd use .execPopulate(). However, this pattern might not be as common or may not always behave as expected depending on the Mongoose version and context. 
  // await task.populate('owner').execPopulate();   
  console.log("task==",task);
}
main1();  */

/* const main2= async ()=>{
  const user=await User.findById("64f434ab11ac54bd5cda4b17").populate('tasks');
  console.log("user==",user.tasks);
}
main2();   */