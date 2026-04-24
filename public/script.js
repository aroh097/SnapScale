async function upload() {

  const file = document.getElementById("file").files[0];
  if (!file) return alert("Image select karo");

  const width = document.getElementById("width").value;
  const height = document.getElementById("height").value;
  const format = document.getElementById("format").value;
  const quality = document.getElementById("quality").value;

  const formData = new FormData();
  formData.append("image", file);
  formData.append("width", width);
  formData.append("height", height);
  formData.append("format", format);
  formData.append("quality", quality);

  try {
    const res = await fetch("/resize", {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error();

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    document.getElementById("preview").src = url;

    const d = document.getElementById("download");
    d.href = url;
    d.download = "snapscale." + format;
    d.style.display = "block";

  } catch (err) {
    alert("Upload error");
    console.error(err);
  }
}
