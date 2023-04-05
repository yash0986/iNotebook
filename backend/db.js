const mongoose= require('mongoose');

const mongoURI="mongodb://127.0.0.1:27017/iNotebook"

// const connectToMongo =() =>{
//     mongoose.connect(mongoURI,()=>{
//         console.log("connected to Mongo Successfully");
//     })
// }
const connectToMongo =() =>{
mongoose.connect('mongodb://127.0.0.1:27017/iNotebook')
    .then(() => {
        console.log("CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO ERROR!!!!")
        console.log(err)
    })
}
module.exports= connectToMongo;