const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const cors = require("cors");

const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

app.post("/resize", upload.single("image"), async (req, res) => {
    const { width, height, format } = req.body;

    let img = sharp(req.file.buffer)
        .resize(parseInt(width), parseInt(height));

    if (format === "png") img = img.png();
    else if (format === "webp") img = img.webp();
    else img = img.jpeg();

    const buffer = await img.toBuffer();

    res.set("Content-Type", "image/" + format);
    res.send(buffer);
});

app.listen(5000, () => {
    console.log("🚀 SnapScale Server running on port 5000");
});
