const { Login } = require("@mui/icons-material");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/studentpage", {
  useNewUrlParser: true,
}).then(()=>{
    console.log("connection successfull");
}).catch((e)=>{
console.log("No connection");
})
