async function upload(){
    const file = document.getElementById("file").files[0];
    const width = document.getElementById("width").value;
    const height = document.getElementById("height").value;
    const format = document.getElementById("format").value;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("width", width);
    formData.append("height", height);
    formData.append("format", format);

    const res = await fetch("http://localhost:5000/resize", {
        method: "POST",
        body: formData
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = function(){
        const canvas = document.getElementById("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img,0,0);

        const download = document.getElementById("download");
        download.href = url;
        download.download = "snapscale."+format;
        download.style.display = "block";
    }
    img.src = url;
}
