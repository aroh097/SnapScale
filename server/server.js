const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// serve frontend
app.use(express.static(path.join(__dirname, "..")));

const upload = multer({ storage: multer.memoryStorage() });

app.post("/resize", upload.single("image"), async (req, res) => {
  try {
    const { width, height, format, quality, bgMode, bgColor } = req.body;

    let img = sharp(req.file.buffer);

    if (width && height) {
      img = img.resize(parseInt(width), parseInt(height));
    }

    if (bgMode === "color") {
      img = img.flatten({ background: bgColor });
    }

    if (bgMode === "blur") {
      img = img.blur(10);
    }

    const q = quality ? parseFloat(quality) * 100 : 80;

    if (format === "png") img = img.png();
    else if (format === "webp") img = img.webp({ quality: q });
    else img = img.jpeg({ quality: q });

    const buffer = await img.toBuffer();

    res.set("Content-Type", "image/" + format);
    res.send(buffer);

  } catch (err) {
    res.status(500).send("Error");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("SnapScale running"));
