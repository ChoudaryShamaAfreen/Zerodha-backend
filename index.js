// require('dotenv').config();


// const express=require("express");
// const app=express();
// const mongoose=require("mongoose");
// const bodyparser=require("body-parser");
// const cors=require("cors");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const {Holdingsmodel}=require("./model/Holdingsmodel");
// const {Positionmodel}=require("./model/Positionmodel");
// const {Ordermodel}=require("./model/Ordermodel");
// const { Usermodel } = require("./model/Usermodel");

// const PORT=process.env.PORT || 3002;
// const uri=process.env.MONGO_URL;
// const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// // app.use(cors());
// // import cors from "cors";
// app.use(cors({
//   origin: ["http://localhost:3000", "https://your-frontend-domain.com"], // allow frontend
//   credentials: true,
// }));

// app.use(bodyparser.json());




// app.get("/allholdings",async(req,res)=>{
//     let allholdings=await Holdingsmodel.find({});
//     res.json(allholdings);
// });

// app.get("/allpositions",async(req,res)=>{
//     let allpositions=await Positionmodel.find({});
//     res.json(allpositions);
// });

// app.post("/newOrder",(req,res)=>{
//     let neworder=new Ordermodel({
//         name: req.body.name,
//     qty:req.body.qty,
//     price:req.body.price,
//     mode:req.body.mode,
//     });
//     neworder.save();
//     res.send("data saved");
// });

// app.listen(3002,()=>{
//     console.log("app is listening");
//     mongoose.connect(uri);
//     console.log("db connected");
// });




require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { Holdingsmodel } = require("./model/Holdingsmodel");
const { Positionmodel } = require("./model/Positionmodel");
const { Ordermodel } = require("./model/Ordermodel");
const { Usermodel } = require("./model/Usermodel"); // ✅ already imported

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

app.use(
  cors({
    origin: ["http://localhost:3000", "https://eloquent-bubblegum-5de7a3.netlify.app"], // ✅ allow frontend
    credentials: true,
  })
);

app.use(bodyparser.json());

/* ---------------------- EXISTING ROUTES ----------------------- */

app.get("/allholdings", async (req, res) => {
  let allholdings = await Holdingsmodel.find({});
  res.json(allholdings);
});

app.get("/allpositions", async (req, res) => {
  let allpositions = await Positionmodel.find({});
  res.json(allpositions);
});

// app.post("/newOrder", (req, res) => {
//   let neworder = new Ordermodel({
//     name: req.body.name,
//     qty: req.body.qty,
//     price: req.body.price,
//     mode: req.body.mode,
//   });
//   neworder.save();
//   res.send("data saved");
// });

app.post("/newOrder", async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;

    const newOrder = new Ordermodel({ name, qty, price, mode });
    await newOrder.save();

    res.json({ message: "Order saved successfully" });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ error: "Failed to save order" });
  }
});


app.get("/newOrder", async (req, res) => {
  const orders = await Ordermodel.find({});
  res.json(orders);
});

/* ---------------------- AUTH ROUTES ----------------------- */

// ✅ Signup
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check if user exists
    const existingUser = await Usermodel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Usermodel({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// ✅ Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Usermodel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // generate JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

/* ---------------------- SERVER + DB ----------------------- */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  mongoose.connect(uri).then(() => console.log("DB connected"));
});


