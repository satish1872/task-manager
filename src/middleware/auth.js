import jwt from 'jsonwebtoken';
import User from '../models/user.js';
const SECRET_KEY='9a8b7c6d5e4f3g2h1iJkLmN0oPqRstUv';
/* 
authenticate( verfiy) the jwt token and
, find the user in database
*/
const auth= async (req,res,next)=>{
  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGVmMmM2NTFkMTc3ZmEzYTMzNmI0MTYiLCJuYW1lIjoiYW5kcmV3IG1lYWQxNiIsImlhdCI6MTY5MzQ4NzExMiwiZXhwIjoxNjkzNTIzMTEyfQ.BtUuqg5i9xVBLAu-fO9H2k101pNnNsinPTkZTFrkJrc"
  try{
      
    // const token=req?.rawHeaders?.[1]?.slice(7);
    const token=req?.header('Authorization')?.replace('Bearer ','');
    console.log("req token=",token);
    var decoded = await jwt.verify(token,SECRET_KEY);
    console.log("decoded=",decoded);
    // return decoded;
    const user=await User.findOne({_id:decoded?._id,'tokens.token':token});
    if(!user)
    throw new Error('error from auth');
    req.user=user;
    req.token=token;
    // console.log("typeof req.user",typeof req.user)
    // console.log("req.user",user);
    // console.log("req.token",token);
    next();
  }catch(err){
    console.log(err);
    res.status(401).send({error:'please authenticate'})
  }
  // console.log('auth middleware');
  // next();
}

export default auth;