import mongoose, { mongo } from "mongoose";
import validator from "validator";



const Task=mongoose.model('Task', {
  description:{
    type:String,
  },
  completed:{
    type:Boolean,
    required:true,
  }
});


export default Task;