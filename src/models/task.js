import mongoose, { mongo } from "mongoose";
import validator from "validator";



const Task=mongoose.model('Task', {
  description:{
    type:String,
  },
  completed:{
    type:Boolean,
    required:true,
  },
    owner:{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      ref:'User',
    }
});


export default Task;