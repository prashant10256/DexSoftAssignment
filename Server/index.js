const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userDetailsRoute");
const cookieParser = require("cookie-parser");
const path = require('path')

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.set("view engine", "ejs");
app.use(express.json());
app.use(cors());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'build')))

// Handle all other routes by serving the 'index.html' file


app.use("/api", userRoute);
const port = process.env.PORT || 5000;

//const uri = process.env.ATLAS_URI;

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("registration"); 
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get("/allUsers", (req, res) => {
  res.render("displayAllUsers"); 
});

app.listen(port, (req, res) => {
  console.log(`Server running on port: ${port}`);
});



mongoose
  .connect(
     "mongodb+srv://prashant:By1Nxe5Qhm5IDgwx@cluster0.hdswbop.mongodb.net/BooksTable?retryWrites=true&w=majority",
      // "mongodb+srv://prashantsugave125:PrashantSugave@101@cluster0.cpi2n2q.mongodb.net/?retryWrites=true&w=majority",
     {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected....."))
  .catch((error) => console.log("MongoDb Connection fail: ", error.message));


