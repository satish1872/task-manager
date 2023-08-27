import express from 'express';
import User from './models/user.js';
import mongoose, { mongo } from "mongoose";
import validator from "validator";
import Task from './models/task.js';
import userRouter from './routers/user.js';
import taskRouter from './routers/task.js';

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

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


 app.get('/', (req, res) =>{
  res.send('express get called from root file');
}); 


app.listen(port,()=>{
  console.log(`server running on port ${port}`)
});