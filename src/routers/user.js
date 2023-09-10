import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import auth from "../middleware/auth.js";
import mongoose from "mongoose";
import multer from 'multer';
import sharp from 'sharp';

const SECRET_KEY = "9a8b7c6d5e4f3g2h1iJkLmN0oPqRstUv";
const userRouter = new express.Router();

const generateToken = async (payload) => {
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "0 second" });
  return token;
};

const verifyToken = async (token) => {
  const decoded = await jwt.verify(token, SECRET_KEY);
  return decoded;
};

const userPayload = {
  _id: "64ef085c5f23dbb8b96ef5a7" ,
  name: "andrew mead15",
};

// console.log(" jwt token is",token);
/* setTimeout(async () => {
  const isTokenVerified=await verifyToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGVmMDg1YzVmMjNkYmI4Yjk2ZWY1YTciLCJuYW1lIjoiYW5kcmV3IG1lYWQxNSIsImlhdCI6MTY5MzM5MDYxMiwiZXhwIjoxNjkzMzkwNjEyfQ.bM7D64wqZeJ9mdo14emALcz8ynLAkDvQg-Bgu8WIvp0");

  console.log("isTokenVerified",isTokenVerified)
}, 2000); */

userRouter.get("/test", (req, res) => {
  res.send("from a new file");
});

// method 1
/* userRouter.post("/users",(req,res)=>{
  console.log(req.body);
  const user= new  User(req.body);
  user.save()
  .then((response)=>res.send(response))
  .catch((err)=>res.status(400).send(err.message));
}); */

// method 2
userRouter.post("/users", async (req, res) => {
  const user = new User(req.body);
  const token = await user.generateToken();

  try {
    await user.save();
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

// method 1
/* userRouter.get('/users',async (req,res)=>{
  await User.find({})
  .then(users=>res.send(users))
  .catch(err=>res.status(500).send(err.message));
}) */

/* 
error in postman: 
 Cast to ObjectId failed for value "me" 
 (type string) at path "_id" for model "User"

 Fix:
In your user.js router, you have two routes that
 handle requests with similar patterns:
/users/:id
/users/me
Since :id is a route parameter, 
it can match any string, including "me". 
Therefore, when you make a request to /users/me,
 Express interprets "me" as a value for the :id parameter 
 in the /users/:id route, leading to the error
you're encountering.

To fix this issue, you should make sure that the 
/users/me route is defined before the
 /users/:id route in your user.js router.
  This way, Express will match the /users/me 
  route before interpreting "me" as a parameter
  for the /users/:id route.
*/
//method 2
// adding auhentication not makes sense
// for signup or login , but make sense for getting users
userRouter.get("/users/me", auth, async (req, res) => {
  try {
    // const users=  await User.find({})
    res.status(200).send(req.user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// method 1: local upload
/* const upload= multer({
  dest:'avatars',
  limits:{
    fileSize:1000000
  },
  fileFilter(req,file,cb){
    // if(!file.originalname.endsWith('.pdf')){
    //   return cb(new Error('please upload a PDF file'));
    // }
    if(!file.originalname.match(/.*\.(jpeg|jpg|png)$/i)){
      return cb(new Error('please upload a image jpeg or jpg or png'));
    }

    // cb(new Error('file must be a image'))
    cb(undefined,true); // silently accept the upload
    // cb(undefined,false);// silently reject the upload
  }
})  */

// method 2: upload and save in db
const upload= multer({
  limits:{
    fileSize:1000000
  },
  fileFilter(req,file,cb){
    // if(!file.originalname.endsWith('.pdf')){
    //   return cb(new Error('please upload a PDF file'));
    // }
    if(!file.originalname.match(/.*\.(jpeg|jpg|png)$/i)){
      return cb(new Error('please upload a image jpeg or jpg or png'));
    }

    // cb(new Error('file must be a image'))
    cb(undefined,true); // silently accept the upload
    // cb(undefined,false);// silently reject the upload
  }
}) 


userRouter.post("/users/me/avatar",auth,upload.single('avatar'),async(req,res)=>{
  const buffer= await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer();
  req.user.avatar=buffer;
  // req.user.avatar=req.file.buffer;
  await req.user.save();
  res.send();
})


// for logout functionality , remove the token from token array 
userRouter.post("/users/logout", auth , async (req,res)=>{
  try{
    req.user.tokens= req.user.tokens.filter(token=>{
      return token.token!=req.token;
    })
    await req.user.save();
    res.send();
  }catch(err){
    res.status(500).send(err.message);
  }
})

/* create a way to logout of all sessions */
/*  usecase : i am having netflix account and i have lented by 
account to my friend, now i i want to kick them off from
my account i can simply logout and everyone else will be logout
 */
/*  common issue: Ensure you're authenticated: Before accessing req.user in userRouter.post("/users/logoutAll",async(req,res)=>{...} ensure that the auth middleware is applied to that route. The auth middleware is what sets the req.user property, so without it, req.user will be undefined. */
userRouter.post("/users/logoutAll",auth,async(req,res)=>{
  try{
    req.user.tokens=[];
    // req.token=null;
    await req.user.save();
    res.status(200).send();
  }catch(err){
    res.status(500).send(err.message);
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
/* userRouter.get(`/users/:id`, async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
 */
// expecting email and password as body
/* 4 security  i want to hide private info when this api get called so we comeup with a method which will getPublicProfile for given user */
/*  issue fixed: not putting await keyword before  user.getPublicProfile() , we were getting user={} */
userRouter.post("/users/login", async (req, res) => {
  try {
    // console.log('req param is ', req)
    const user = await User.findByCredential(req.body.email, req.body.password);
    const token = await user.generateToken();
    res.status(200).send({
      // user: await user.getPublicProfile(),
      user:user,
      token: token,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

userRouter.patch("/users/:id", async (req, res) => {
  const update = Object.keys(req.body);
  const allowedUpdate = ["name", "email", "password", "age"];
  let isValidOpeartion = true;
  /* update.forEach((propery)=>{
    if(!allowedUpdate.includes(propery)){
      isValidOpeartion=false;
    }
  }); */
  isValidOpeartion = update.every((property) =>
    allowedUpdate.includes(property)
  );

  if (!isValidOpeartion) return res.status(400).send("Not valid operationn");

  try {
    const userId = req.params.id;
    /* on save event , presave hook middleware
      doesn't get triggered  
    */
    /* const user= await 
       User.findByIdAndUpdate(
          userId,
          req.body,
        { new: true,
          runValidators: true 
        }); */
    const user = await User.findById(userId);
    update.forEach((key) => {
      user[key] = req.body[key];
    });
    await user.save();
    if (!user) return res.status(404).send();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

/* userRouter.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id });
    if (!user) return res.status(404).send("User not found");
    res.status(201).send(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
}); */


/* 
 issue: await req.user.remove(); is not a function?
it seems req.user is an object that mimics the structure of 
a Mongoose document but may not be an actual instance of a Mongoose document. The fact that it contains properties like _id structured with new ObjectId("...") indicates it's been manually constructed or parsed from a serialized form, rather than being an instance fetched directly from Mongoose.
*/
userRouter.delete("/users/me",auth, async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req. user._id });
    if (!user) return res.status(404).send("User not found");
    console.log("req user=",req.user);
    res.status(201).send(req.user);
     /* user.remove() is an instance method,
      meaning it's called on a particular instance (or document) of a model. */
    /*  await req.user.remove();
    if (req.user instanceof mongoose.Model) {
      await req.user.remove();
      res.send(req.user);
    } else {
        res.status(400).send("Invalid user instance.");
    } */
  } catch (err) {
    res.status(500).send(err.message);
  }
});

userRouter.delete("/users/me/avatar",auth,async (req,res)=>{
  try{
    if(!req.user.avatar){
      return res.status(400).send({message:'avatar already deleted'})
    }
    req.user.avatar=undefined;
    await req.user.save();
    res.send({message:'avatar deleted successfully'});
  }catch(err){
    res.status(500).send({message:'error deleting avatar'});
  }
})

userRouter.get("/users/:id/avatar",auth, async (req,res)=>{
  try{
    const user=await user.findById(req.params.id);
    if(!user|| !user.avatar){
      throw new Error();
    }
    res.set({'Content-Type': 'image/png'});
    res.send(user.avatar);
  }catch(err){   
    res.status(404).send({message:'error getting avatar'});
  }
})

export default userRouter;
