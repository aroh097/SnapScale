const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ static files serve
app.use(express.static(__dirname));

const upload = multer({ storage: multer.memoryStorage() });

// ✅ test route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ resize API
app.post("/resize", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No image");
    }

    const width = parseInt(req.body.width) || null;
    const height = parseInt(req.body.height) || null;
    const format = req.body.format || "jpeg";
    const quality = Math.round((req.body.quality || 0.8) * 100);

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

// ✅ MUST for Render
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server running on port " + PORT);
});
