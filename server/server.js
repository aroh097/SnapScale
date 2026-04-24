const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const cors = require("cors");

const app = express();

app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

// test route
app.get("/", (req, res) => {
  res.send("SnapScale backend running ✅");
});

app.post("/resize", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No image");
    }

    let width = parseInt(req.body.width);
    let height = parseInt(req.body.height);

    if (!width) width = null;
    if (!height) height = null;

    const format = req.body.format || "jpeg";
    const quality = parseFloat(req.body.quality || 0.8) * 100;

    let img = sharp(req.file.buffer);

    if (width || height) {
      img = img.resize(width, height);
    }

    if (format === "png") img = img.png();
    else if (format === "webp") img = img.webp({ quality });
    else img = img.jpeg({ quality });

    const buffer = await img.toBuffer();

    res.set("Content-Type", "image/" + format);
    res.send(buffer);

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).send("Server error");
  }
});

// ✅ IMPORTANT FIX (Render requires this)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
