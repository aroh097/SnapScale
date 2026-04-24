async function upload() {

  const fileInput = document.getElementById("file");
  const file = fileInput.files[0];

  if (!file) {
    alert("Image select karo");
    return;
  }

  console.log("File selected:", file); // debug

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

    console.log("Response:", res);

    if (!res.ok) {
      alert("Server error");
      return;
    }

    const blob = await res.blob();
    const imageUrl = URL.createObjectURL(blob);

    // ✅ IMAGE SHOW
    const preview = document.getElementById("preview");
    preview.src = imageUrl;
    preview.style.display = "block";

    // ✅ DOWNLOAD BUTTON
    const download = document.getElementById("download");
    download.href = imageUrl;
    download.download = "snapscale." + format;
    download.style.display = "inline-block";

  } catch (err) {
    console.error(err);
    alert("Upload fail");
  }
}
