const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// serve frontend
app.use(express.static(path.join(__dirname, "../public")));

// resize API
app.post("/resize", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file");

    let img = sharp(req.file.buffer);

    const width = parseInt(req.body.width) || null;
    const height = parseInt(req.body.height) || null;
    const format = req.body.format || "jpeg";
    const quality = parseInt(req.body.quality) || 80;

    if (width || height) {
      img = img.resize(width || null, height || null);
    }

    if (format === "png") img = img.png();
    else if (format === "webp") img = img.webp({ quality });
    else img = img.jpeg({ quality });

    const buffer = await img.toBuffer();

    res.set("Content-Type", "image/" + format);
    res.send(buffer);

  } catch (err) {
    res.status(500).send("Error");
  }
});

app.listen(process.env.PORT || 10000, () => {
  console.log("Server running 🚀");
});
