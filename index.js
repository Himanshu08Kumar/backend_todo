const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
"mongodb+srv://himanshukumar802123:Urtaf17tCqZiFOCc@cluster0.uknc5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
const taskSchema = {
  name: {
    type: String,
    required: true
  }
};
//himanshukumar802123:Urtaf17tCqZiFOCc
const Task = mongoose.model("Task", taskSchema);

app.set("view engine", "ejs");

app.get("/", async function (req, res) {
    let today = new Date();
    let options = { weekday: "long", day: "numeric", month: "long" };
    let day = today.toLocaleDateString("en-US", options);
  
    try {
      const foundTasks = await Task.find({});
      res.render("index", { today: day, tasks: foundTasks });
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  });
  

app.post("/", function (req, res) {
  const taskName = req.body.newTask;
  if(taskName){
    const task = new Task({
      name: taskName,
    });
    task.save().then(()=>{
      res.redirect("/");
    });
  } else{
    res.redirect("/");
    
  }
});

app.post("/delete", function (req, res) {
    console.log(req.body); 
    const checkedItemId = req.body.checkbox;
    if (checkedItemId) {
      Task.findByIdAndRemove(checkedItemId, function (err) {
        if (!err) {
          console.log("Successfully deleted checked item.");
          res.redirect("/");
        } else {
          console.log(err);
        }
      });
    } else {
      console.log("No task ID provided");
      res.redirect("/");
    }
  });
  

app.listen(process.env.PORT || 3000, function () {
  console.log("Server running at port 3000");
});