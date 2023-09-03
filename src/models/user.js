import mongoose, { mongo } from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Task from "./task.js";
const SECRET_KEY='9a8b7c6d5e4f3g2h1iJkLmN0oPqRstUv';


const userSchema= new mongoose.Schema({
  name:{
    type:String,
    trim:true
  },
  age:{
    type:Number,
    trim:true,
    validate(value){
      if(value<=0)
      throw new Error("age is invalid, age must be positive value")
    }
  },
  email:{
    type:String,
    required:false,
    trim:true,
    lowercase:true,
    unique:true,
    validate(value){
      if(!validator.isEmail(value))
      throw new Error("Invalid email")
    },
    defaultValue:'mike@google.com'
  },
  password:{
    type:String,
    required:false,
    trim:true,
    validate:function(value){
      if(value.length<=6|| value=='password')
      throw new Error('password length should be >6 and password!=password')
    }
  },
  /* toke is array of objects */
  tokens:[{
    token:{
      type:String,
      required:true,
    }
  }],
});

/* 
चलिए इस विर्चुअल मेथड में दिए गए पैरामीटर को टूटकर समझते हैं:

वर्चुअल फील्ड का नाम:

'tasks': यह वर्चुअल फील्ड का नाम है। इसका मतलब है कि जब आप एक user document को प्राप्त करते हैं और tasks वर्चुअल को populate करते हैं, तो इसमें उस उपयोगकर्ता से संबंधित सभी tasks होते हैं।
विकल्प:

ref: यह उस मॉडल को सूचित करता है जिससे वर्चुअल फील्ड populate होगा। इस मामले में, यह Task मॉडल है।
localField: यह वह फील्ड है जिसे Mongoose ref मॉडल (Task) से मेल खाने वाले डॉक्यूमेंट्स खोजने के लिए उपयोग करेगा। यहाँ, यह User की _id फील्ड है।
foreignField: यह ref मॉडल (Task) का वह फील्ड है जिसे Mongoose मेल खाने वाले डॉक्यूमेंट्स खोजने के लिए उपयोग करेगा। यहाँ, यह Task मॉडल की owner फील्ड है।
इस तरह से, जब आप User document पर tasks वर्चुअल को populate करते हैं, तो Mongoose:

User की _id पर नजर डालेगा।
सभी ऐसे Task मॉडल के डॉक्यूमेंट्स को खोजेगा जहां owner फील्ड User की _id से मेल खाता है।
इन tasks को प्राप्त करेगा और इन्हें User के tasks वर्चुअल फील्ड में आवंटित करेगा।
इस प्रकार, इस तरह की virtual populate का उपयोग करने से आप डॉक्यूमेंट्स को प्राप्त करने की प्रक्रिया को साधारण बना सकते हैं, बिना schemas में सीधे references जोड़े।
*/
userSchema.virtual('tasks',{
  ref:'Task',
  localField:'_id',
  foreignField:'owner'
})

/* methods are available on instance , also called instance method */
userSchema.methods.generateToken= async function (){
  const user=this;
  // console.log("typeof _id ",typeof user.id); output= String
  // payload just uniquely identify user
  const payload={_id:user._id,name:user.name};
  const token= jwt.sign(payload,SECRET_KEY,{expiresIn:'3600 hours'});
  user.tokens = user.tokens.concat({token});
  await user.save();
  return token;
}

/* 
// method 1
userSchema.methods.getPublicProfile= async function(){
  const user=this;
  const userObject=user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
} */

// method 2
userSchema.methods.toJSON=  function(){
  const user=this;
  const userObject=user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
}

/*  statics method are availabel on models , called models/schema methods */
userSchema.statics.findByCredential= async function(email, password){
  // console.log(`Searching for user with email: ${email}`);
  const user= await User.findOne({email:email});

  if(!user)
    throw new Error('unable to login');
  // console.log('from findByCredential , user is',user)
  // console.log('password is ',password);
  const isMatched=await bcrypt.compare(password,user.password);
  // console.log("isMatched",isMatched);
   if(!isMatched)throw new Error('unbale to login');
  return user;
}


/* Hash the plain text before saving */
userSchema.pre("save",async function(next){
  // this.password
  const user=this;
  console.log('Just before saving ');
  console.log(user);
  // if user has modified password property
  
  if(user.isModified("password")){
    const hashedPassword= await bcrypt.hash(user.password,8);
    user.password=hashedPassword;
  }


   /* const hashedPassword= await bcrypt.hash(password,8);
  console.log(hashedPassword); 
  const isMatch=await bcrypt.compare(password,hashedPassword);
  */
  next();
})

userSchema.pre('remove', async function(next){
  const user=this;
  await  Task.deleteMany({owner:user._id})
  next();
})
 
const User= mongoose.model('User', userSchema);



export default User;


/* const me=new User({
  name:'mike jonny     ',
  age:24,
  email:'MIKE@google.com  ',
  password:'12345667'
});

me.save()
.then(user=>console.log(user))
.catch(err => console.log(err));


const Task=mongoose.model('Task', {
  description:{
    type:String,
  },
  completed:{
    type:Boolean
  }
});
 */