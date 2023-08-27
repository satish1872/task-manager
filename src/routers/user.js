import express from "express";
import User from "../models/user.js";

const userRouter= new express.Router();

userRouter.get('/test',(req,res)=>{
   res.send('from a new file')
})

// method 1
/* userRouter.post("/users",(req,res)=>{
  console.log(req.body);
  const user= new  User(req.body);
  user.save()
  .then((response)=>res.send(response))
  .catch((err)=>res.status(400).send(err.message));
}); */

// method 2
userRouter.post('/users',async (req,res)=>{
  const user=  new User(req.body);
  try{
    await user.save();
    res.status(201).send(user);
  }catch(err){
    res.status(400).send(err)
  }
})


// method 1
/* userRouter.get("/users/:id",(req,res)=>{
  const userId=req.params.id;
  // console.log("userID",userId);
  User.findById(userId)
  .then(user=>{
    if(!user) return res.status(404).send("User not found")
    res.send(user)
  })
  .catch(err=>res.status(500).send(err.message))
}) */

// method 2
userRouter.get(`/users/:id`,async(req,res)=>{
  const userId=req.params.id;
  try{
    const user= await User.findById(userId);
    res.status(200).send(user);
  }catch(err){
    res.status(500).send(err.message);
  }
})

userRouter.patch('/users/:id',async (req,res)=>{
  const update= Object.keys(req.body);  
  const allowedUpdate=['name','email','password','age'];
  let isValidOpeartion=true;
  /* update.forEach((propery)=>{
    if(!allowedUpdate.includes(propery)){
      isValidOpeartion=false;
    }
  }); */
  isValidOpeartion=update.every(property=>allowedUpdate.includes(property));

  if(!isValidOpeartion)
  return res.status(400).send('Not valid operationn');

    try{
      const userId=req.params.id;
      const user= await 
      User.findByIdAndUpdate(
          userId,
          req.body,
        { new: true,
          runValidators: true 
        });
        if(!user)
        return res.status(404).send();
        res.status(201).send(user);
    }catch(err){
      res.status(400).send(err);
    }
})



// method 1
/* userRouter.get('/users',async (req,res)=>{
  await User.find({})
  .then(users=>res.send(users))
  .catch(err=>res.status(500).send(err.message));
}) */

//method 2
userRouter.get('/users',async (req,res)=>{
  try{
    const users=  await User.find({})
    res.status(200).send(users);
  }catch(err){
    res.status(500).send(err.message);
  }
})


userRouter.delete('/users/:id',async (req,res)=>{
  try{
    const user= await User.findOneAndDelete({_id:req.params.id});
    if(!user)
    return res.status(404).send('User not found');
    res.status(201).send(user);
  }catch(err){
    res.status(500).send(err.message);
  }
})
 

export default userRouter;