import { User } from "../src/db/mongoose.js";
import mongoose from "mongoose";

const connectionURL = 'mongodb://localhost:27017';
const databaseName = 'task-manager-api';

mongoose.connect(`${connectionURL}/${databaseName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB!');

    (async () => {
        // await updateUserAge("64e9def6ce395db03067f359",24);
        /* await User.findByIdAndUpdate("64e9def6ce395db03067f359", { age: 24 }, { new: true })
        .then(user=>User.countDocuments({age:24}))
        .then(result=>console.log(result))
        .catch(err => console.log(err)); */
        const user=await User.findByIdAndUpdate("64e9def6ce395db03067f359", { age: 24 }, { new: true })
        const count= await User.countDocuments({age:24});
        console.log(`number of user of age: ${24} is`,count);
        mongoose.disconnect(); 
    })();
}); 

mongoose.connection.on('error', (err) => {
    console.error('Failed to connect to MongoDB:', err);
});

const updateUserAge = async (userId, newAge) => {
    try {
        const user = await User.findByIdAndUpdate(userId, { age: newAge }, { new: true });
        if (!user) {
            console.log('User not found.');
            return;
        }
        console.log(`Updated user:`, user);
    } catch (error) {
        console.error('Error updating user:', error);
    }
}


const fetchUsersByAge = async (age)=>{
  try{
    const users=await User.find({age:age});
    if(!users|| users.length==0){
      console.log(`no users found with age ${age}`);
    return ;
    }
    console.log(`Users with age:{age}`,users)
  }catch(err){
    console.log(err)
  }
}