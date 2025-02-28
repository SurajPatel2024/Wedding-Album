require("dotenv").config(); 
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const Photo = require("./models/Photo");
const path = require("path");

const app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Load environment variables
const PORT = process.env.PORT ;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(process.env.MONGO_URI, {
   
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB Connection Error:", err));

// Multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
app.get("/", async (req, res) => {
  const photos = await Photo.find();
  res.render("index", { photos });
});

app.get("/upload", (req, res) => res.render("upload"));

app.post("/upload", upload.array("photos", 10), async (req, res) => {
  const files = req.files.map((file) => ({
    name: file.originalname,
    data: file.buffer,
    contentType: file.mimetype,
  }));

  await Photo.insertMany(files);
  res.redirect("/");
});

app.get("/album", async (req, res) => {
  const photos = await Photo.find();
  res.render("album", { photos });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
