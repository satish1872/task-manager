import express from "express";
import Task from "../models/task.js";

const taskRouter= new express.Router();


//method 1: adding new task
taskRouter.post('/tasks',(req,res)=>{
  const task=new Task(req.body);
  console.log(task);
  task.save()
  .then((response)=>res.send(response))
  .catch(err=>res.status(400).send(err.message))
});

// method 2
taskRouter.get('/tasks',async (req,res)=>{
  await  Task.find({})
  .then(tasks=>res.send(tasks))
  .catch(err=>res.status(500).send(err.message))
})

taskRouter.get("/tasks/:id",(req,res)=>{
  const taskId=req.params.id;
  Task.findById(taskId)
  .then(task=>{
    if(!task)
    return res.status(404).send('task not found');
    res.send(task);
  })
  .catch(err=>res.status(500).send(err.message));
});


taskRouter.patch("/tasks/:id",async(req,res)=>{
  const update= Object.keys(req.body);  
  const allowedUpdate=['description','completed'];
  const isValidOpeartion=update.every(property=>allowedUpdate.includes(property));
  if(!isValidOpeartion)
  return res.status(400).send('Not valid operationn');
  try{
    const taskId=req.params.id;
    const task= await Task.findByIdAndUpdate(taskId,req.body,{
      new:true,
      runValidators:true
    });
    if(!task)
    return res.status(404).send();
    res.status(201).send(task);
  }catch(err){
    res.send(400).send(err);
  }
})


taskRouter.delete('/tasks/:id',async (req,res)=>{
  try{
    const task= await Task.findOneAndDelete({_id:req.params.id});
    if(!task)
    return res.status(404).send('task not found');
    res.status(201).send(task);
  }catch(err){
    res.status(500).send(err.message);
  }
})


export default taskRouter;