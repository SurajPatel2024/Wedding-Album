require("dotenv").config(); 
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const Photo = require("./models/Photo");
const path = require("path");

const app = express();

// Set up EJS
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Load environment variables
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 30000, // Increase timeout
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Exit process if connection fails
  });

// Multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
app.get("/", async (req, res) => {
  try {
    const photos = await Photo.find();
    res.render("index", { photos });
  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/upload", (req, res) => res.render("upload"));

app.post("/upload", upload.array("photos", 10), async (req, res) => {
  try {
    const files = req.files.map((file) => ({
      name: file.originalname,
      data: file.buffer,
      contentType: file.mimetype,
    }));

    await Photo.insertMany(files);
    res.redirect("/");
  } catch (error) {
    console.error("Error uploading photos:", error);
    res.status(500).send("Upload failed");
  }
});

app.get("/album", async (req, res) => {
  try {
    const photos = await Photo.find();
    res.render("album", { photos });
  } catch (error) {
    console.error("Error fetching album:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
