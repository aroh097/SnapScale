app.post("/resize", upload.single("image"), async (req, res) => {
    try {
        const { width, height, format, quality } = req.body;

        let img = sharp(req.file.buffer);

        if (width && height) {
            img = img.resize(parseInt(width), parseInt(height));
        }

        if (format === "png") {
            img = img.png();
        } else if (format === "webp") {
            img = img.webp({ quality: parseFloat(quality) * 100 });
        } else {
            img = img.jpeg({ quality: parseFloat(quality) * 100 });
        }

        const buffer = await img.toBuffer();

        res.set("Content-Type", "image/" + format);
        res.send(buffer);

    } catch (err) {
        res.status(500).send("Error");
    }
});
