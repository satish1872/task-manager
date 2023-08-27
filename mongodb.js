import { MongoClient , ObjectId} from "mongodb";
import mongoose from "mongoose"; 
/* Note callback are not working with this driver , but promise .then and .catch are working by 
immediatly attaching then and .catch when call is made */
const connectionURL = "mongodb://localhost:27017";
const databaseName = "task-manager";

const id = new ObjectId();
console.log(id.toHexString());

const timestamp = id.getTimestamp();

console.log('Timestamp:', timestamp);

const main = async () => {
  try {
    // Connect to the MongoDB server
    const client = await MongoClient.connect(connectionURL, {
      useNewUrlParser: true,
    });

    // Select the database you want to use
    const db = client.db(databaseName);

    // Insert a document into the 'users' collection
    
/*      await db.collection("users").insertOne(
      {
        _id:id.toHexString(),
        name: "Satish9",
        age: 22,
      },
      (err, res) => {
        if (err) return console.error(err);
        else return console.log(res);
      }
    );  */
   

    /* await db.collection("users").insertMany([
      { name: "Satish6", age: 22 },
      { name: "Satish6", age: 22 },
    ]);
    */

/*     await db.collection("tasks").insertMany([
      {
        description:'task1',
        completed:true,
      },
      {
        description:'task2',
        completed:false,
      },
      {
        description:'task3',
        completed:true,
      }
    ],
    (err, res) => {
      if (err) return console.error(err);
      else return console.log(res);
    });
 */

   /*  const result=await db.collection("users").findOne({name:"Satish2"},
    (err, res) => {
      if (err) return console.error(err);
      else return console.log(res);
    }) 
    console.log(result);
    */



    /* const result2=await db.collection("users").findOne({_id:"64e35d47986fcad7a070a318"},
    (err, res) => {
      if (err) return console.error(err);
      else return console.log(res);
    })
        console.log(result2);
 */

/*     const result3=await db.collection("users").findOne({_id:new ObjectId("64e35d47986fcad7a070a318")},
    (err, res) => {
      if (err) return console.error(err);
      else return console.log(res);
    })


    console.log(result3); */


/*     const result4=await db.collection("users").find({age:22}).toArray((err, res) => {
      if (err) return console.error(err);
      else return console.log(res);
    });
    console.log(result4);
 */

    /* const result5=await db.collection("tasks").findOne({_id:new ObjectId("64e36c203b108f13d76e6f7e")});
    if (result5) {
      console.log('Found task:');
      console.log(result5);
    } else {
      console.log('Task not found.');
    }
     */

    /* const result6=await db.collection("tasks").find({completed:false}).toArray();
    if (result6) {
      console.log('Found task:');
      console.log(result6);
    } else {
      console.log('Task not found.');
    } */


 /*     const updatePromise=await db.collection('users').updateOne(
      {_id:new ObjectId("64e35c2795a94bd86d3509ed")},
      {$set:{name:'Shiva2'}},
    )


   if(updatePromise.matchedCount==1)
    console.log(`User name updated successfully`)
    else if(updatePromise.matchedCount==0)
    console.log("user id not found");
    else
    console.log("error updating user");  */

   /*  await db.collection('users').updateOne(
      {_id:new ObjectId("64e35c2795a94bd86d3509ed")},
      {$set:{name:'Shiva2'}},
    ).then(res=>{
      if(res.matchedCount==1)
      console.log(`User name updated successfully`)
      else if(res.matchedCount==0)
      console.log("user id not found");
    })
    .catch(err=>console.log("error updating user",err))
 */

/*     await db.collection('users').updateOne(
      {_id:new ObjectId("64e35c2795a94bd86d3509ed")},
      {$set:{name:'Shiva2'}},
      (err,res)=>{
        if(err)
        return console.log("error updating user",err)
        else
        return console.log("res=",res);
      } 
    ) */


/*     await db.collection('tasks').updateMany(
      {completed:false},
      {$set:{completed:true}}, 
    )
    .then(res=>console.log("number of task completed now is",res.modifiedCount))
    .catch(err=>console.log(err)) */

/*     await db.collection('users').deleteMany({
      age:{$gte:27, $lte:200}
    })
    .then(res=>console.log("number of users deleted are ",res.deletedCount))
    .catch(err=>console.log(err))

 */

    await db.collection('users').deleteMany({
      name:"Satish2"
    })
    .then(res=>console.log("Satish2 is deleted ",res))
    .catch(err=>console.log(err))


    console.log("Document inserted successfully");

    // Close the connection when you're done
    client.close();
  } catch (error) {
    console.error("Error:", error);
  }
};

main();
