async function upload() {
    const fileInput = document.getElementById("file");
    const width = document.getElementById("width").value;
    const height = document.getElementById("height").value;
    const format = document.getElementById("format").value;

    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image");
        return;
    }

    // Loader (optional)
    document.getElementById("status").innerText = "Processing...";

    const formData = new FormData();
    formData.append("image", file);
    formData.append("width", width);
    formData.append("height", height);
    formData.append("format", format);

    try {
        const res = await fetch("https://your-app.onrender.com/resize", {
            method: "POST",
            body: formData
        });

        if (!res.ok) {
            throw new Error("Server error");
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        // Show preview
        const img = document.getElementById("preview");
        img.src = url;
        img.style.display = "block";

        // Enable download
        const download = document.getElementById("download");
        download.href = url;
        download.download = "snapscale." + format;
        download.style.display = "inline-block";

        document.getElementById("status").innerText = "Done ✅";

    } catch (error) {
        console.error(error);
        document.getElementById("status").innerText = "Error ❌";
    }
}
