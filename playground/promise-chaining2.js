import { Task } from "../src/db/mongoose.js";
import mongoose from "mongoose";

const connectionURL = 'mongodb://localhost:27017';
const databaseName = 'task-manager-api';

mongoose.connect(`${connectionURL}/${databaseName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

await Task.findByIdAndDelete("64e6101f6954ccc11dc6f77a")
        .then(task=>{
          if(!task){
            console.log("task not found");
            return null;
          }
          console.log(task)
          return Task.countDocuments({completed: false})
        })
        .then(count=>{
          if(count!=null)
          console.log(`Total number of task incompleted : ${count}`)
        })
        .catch(err => console.log(err))
        ;