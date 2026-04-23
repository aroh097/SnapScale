async function upload() {
    const file = document.getElementById("file").files[0];
    const width = document.getElementById("width").value;
    const height = document.getElementById("height").value;
    const format = document.getElementById("format").value;

    if (!file) {
        alert("Image select karo");
        return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("width", width);
    formData.append("height", height);
    formData.append("format", format);

    const res = await fetch("https://snapscale-jvat.onrender.com/resize", {
        method: "POST",
        body: formData
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    // preview
    document.getElementById("preview").src = url;

    // download
    const download = document.getElementById("download");
    download.href = url;
    download.style.display = "block";
}
