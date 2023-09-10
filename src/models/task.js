import mongoose, { mongo } from "mongoose";
import validator from "validator";


const taskSchema=new mongoose.Schema({
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
},
{
  timestamps:true,
}
);

const Task=mongoose.model('Task', taskSchema);


export default Task;