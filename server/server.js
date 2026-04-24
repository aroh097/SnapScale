const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

const app = express();

// memory storage (fast)
const upload = multer({ storage: multer.memoryStorage() });

// 📂 serve frontend
app.use(express.static(path.join(__dirname, "../public")));

// 🔥 resize API
app.post("/resize", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const resizedImage = await sharp(req.file.buffer)
      .resize({ width: 800 }) // change size here
      .jpeg({ quality: 80 })
      .toBuffer();

    res.set("Content-Type", "image/jpeg");
    res.send(resizedImage);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// 🏠 homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// 🚀 start server
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
