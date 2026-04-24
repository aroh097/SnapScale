// ======================
// Resize Upload
// ======================
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

  const res = await fetch("/resize", {
    method: "POST",
    body: formData
  });

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  document.getElementById("preview").src = url;

  const d = document.getElementById("download");
  d.href = url;
  d.download = "snapscale." + format;
  d.style.display = "block";
}

// ======================
// FREE AI BG REMOVE
// ======================
async function aiRemoveBG() {

  const file = document.getElementById("file").files[0];
  if (!file) return alert("Image select karo");

  const img = new Image();
  img.src = URL.createObjectURL(file);

  await new Promise(r => img.onload = r);

  const net = await bodyPix.load();

  const segmentation = await net.segmentPerson(img);

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < segmentation.data.length; i++) {
    if (segmentation.data[i] === 0) {
      imageData.data[i * 4 + 3] = 0;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  const url = canvas.toDataURL("image/png");

  document.getElementById("preview").src = url;

  const d = document.getElementById("download");
  d.href = url;
  d.download = "ai-bg-remove.png";
  d.style.display = "block";
}
