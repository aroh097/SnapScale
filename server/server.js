const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

const upload = multer({ storage: multer.memoryStorage() });

app.post("/resize", upload.single("image"), async (req, res) => {
  try {
    let width = parseInt(req.body.width) || 500;
    let height = parseInt(req.body.height) || 500;
    const format = req.body.format || "jpeg";
    const quality = parseFloat(req.body.quality || 0.8) * 100;

    let img = sharp(req.file.buffer).resize(width, height);

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("SnapScale running"));
