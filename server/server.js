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

    const { width, height, format = "jpeg", quality = 80 } = req.body;

    let img = sharp(req.file.buffer);

    // optional resize
    if (width || height) {
      img = img.resize({
        width: width ? parseInt(width) : undefined,
        height: height ? parseInt(height) : undefined,
      });
    }

    // format
    if (format === "png") img = img.png();
    else if (format === "webp") img = img.webp({ quality: parseInt(quality) });
    else img = img.jpeg({ quality: parseInt(quality) });

    const buffer = await img.toBuffer();

    res.set("Content-Type", `image/${format}`);
    res.send(buffer);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.listen(process.env.PORT || 10000, () => {
  console.log("Server running 🚀");
});
