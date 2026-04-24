const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const cors = require("cors");
const axios = require("axios");
const FormData = require("form-data");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.static(__dirname));

const upload = multer({ storage: multer.memoryStorage() });

// homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ Resize API
app.post("/resize", upload.single("image"), async (req, res) => {
  try {
    const width = parseInt(req.body.width) || null;
    const height = parseInt(req.body.height) || null;
    const format = req.body.format || "jpeg";
    const quality = Math.round((req.body.quality || 0.8) * 100);

    let img = sharp(req.file.buffer);

    if (width || height) img = img.resize(width, height);

    if (format === "png") img = img.png();
    else if (format === "webp") img = img.webp({ quality });
    else img = img.jpeg({ quality });

    const buffer = await img.toBuffer();

    res.set("Content-Type", "image/" + format);
    res.send(buffer);

  } catch (err) {
    res.status(500).send("Resize error");
  }
});

// ✅ AI Background Remove
app.post("/remove-bg", upload.single("image"), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append("image_file", req.file.buffer, "image.png");

    const response = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "X-Api-Key": "YOUR_API_KEY" // 👈 yaha apni key daalo
        },
        responseType: "arraybuffer"
      }
    );

    res.set("Content-Type", "image/png");
    res.send(response.data);

  } catch (err) {
    res.status(500).send("BG remove error");
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running " + PORT);
});
