const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend (index.html)
app.use(express.static(path.join(__dirname, "..")));

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Home route (open website)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
});

// Resize API
app.post("/resize", upload.single("image"), async (req, res) => {
    try {
        const { width, height, format } = req.body;

        if (!req.file) {
            return res.status(400).send("No image uploaded");
        }

        let img = sharp(req.file.buffer);

        // Resize
        if (width && height) {
            img = img.resize(parseInt(width), parseInt(height));
        }

        // Format convert
        if (format === "png") img = img.png();
        else if (format === "webp") img = img.webp();
        else img = img.jpeg();

        const buffer = await img.toBuffer();

        res.set("Content-Type", "image/" + format);
        res.send(buffer);

    } catch (err) {
        console.error(err);
        res.status(500).send("Error processing image");
    }
});

// Port (Render compatible)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("🚀 SnapScale Server running on port " + PORT);
});
