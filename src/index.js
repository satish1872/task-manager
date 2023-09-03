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

const connectionURL = 'mongodb://localhost:27017'; // Replace with your MongoDB connection URL
const databaseName = 'task-manager-api'; 



mongoose.connect(`${connectionURL}/${databaseName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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