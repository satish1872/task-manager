import express from "express";
import Task from "../models/task.js";
import auth from '../middleware/auth.js'

const taskRouter= new express.Router();


//method 1: adding new task
taskRouter.post('/tasks',auth,async (req,res)=>{
  // const task=new Task(req.body);
  const task= new Task({
    ...req.body,
    owner: req.user._id,
  });
  console.log(task);
  task.save()
  .then((response)=>res.send(response))
  .catch(err=>res.status(400).send(err.message))
});

// method 2
taskRouter.get('/tasks',auth,async (req,res)=>{
  const isCompleted=req?.query?.completed==='true';
  const skip=parseInt(req.query.skip)|| 0;
  const limit=parseInt(req.query.limit)||10;
  let taskQuery={owner:req.user._id};
  let sort={createdAt:-1};
  
  if(req.query?.completed!=null){
  taskQuery={owner:req.user._id,completed:isCompleted};
  }

  if(req.query?.sortBy!=null){
      const arr=req.query?.sortBy.split(":");
      sort[arr[0]]=(arr[1]=='desc')?-1:1;  
  }
  await  Task.find(taskQuery)
  .sort(sort) 
  .skip(skip)
  .limit(limit)
  .then(tasks=>res.send(tasks))
  .catch(err=>res.status(500).send(err.message))
})

taskRouter.get("/tasks/:id",auth,(req,res)=>{
  const taskId=req.params.id;
  Task.findOne({_id:taskId,owner:req.user._id})
  .then(task=>{
    if(!task)
    return res.status(404).send('task not found');
    res.send(task);
  })
  .catch(err=>res.status(500).send(err.message));

/*   Task.findById(taskId)
  .then(task=>{
    if(!task)
    return res.status(404).send('task not found');
    res.send(task);
  })
  .catch(err=>res.status(500).send(err.message)); */
});


taskRouter.patch("/tasks/:id",auth,async(req,res)=>{
  const updates= Object.keys(req.body);  
  const allowedUpdate=['description','completed'];
  const isValidOpeartion=updates.every(property=>allowedUpdate.includes(property));
  if(!isValidOpeartion)
  return res.status(400).send('Not valid operationn');
  try{
    const taskId=req.params.id;
    /* const task= await Task.findByIdAndUpdate(taskId,req.body,{
      new:true,
      runValidators:true
    }); */
    
    /* const task= await Task.findById(taskId);
    updates.forEach(update=>{
      task[update]=req.body[update];
    })
    await task.save();  
    if(!task)
    return res.status(404).send();
    res.status(201).send(task);
  }catch(err){
    res.send(400).send(err);
  } */

  const task= await Task.findOne({_id:taskId,owner:req.user._id});
    if(!task)
    return res.status(404).send();
    updates.forEach(update=>{
        task[update]=req.body[update];
      })
      await task.save();  
      res.status(201).send(task);
    }catch(err){
      res.send(400).send(err);
    }
})


taskRouter.delete('/tasks/:id',auth,async (req,res)=>{
  try{
    // const task= await Task.findOneAndDelete({_id:req.params.id});
    const task= await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id});
    if(!task)
    return res.status(404).send('task not found');
    res.status(201).send(task);
  }catch(err){
    res.status(500).send(err.message);
  }
})


export default taskRouter;