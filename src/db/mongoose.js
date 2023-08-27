import mongoose, { mongo } from "mongoose";
import validator from "validator";
const connectionURL = 'mongodb://localhost:27017'; // Replace with your MongoDB connection URL
const databaseName = 'task-manager-api'; 


mongoose.connect(`${connectionURL}/${databaseName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



const User= mongoose.model('User', {
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
  }
})

/* const me=new User({
  name:'mike jonny     ',
  age:24,
  email:'MIKE@google.com  ',
  password:'12345667'
});

me.save()
.then(user=>console.log(user))
.catch(err => console.log(err));
 */

const Task=mongoose.model('Task', {
  description:{
    type:String,
  },
  completed:{
    type:Boolean
  }
});


/* const myFirstTask= new Task({
  description:'first task description',
  completed:true
})


myFirstTask
.save()
.then(task=>console.log(task))
.catch(err=>console.log(err))  */

export  {User,Task}; // Exporting models