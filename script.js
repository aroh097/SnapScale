// ======================
// 📂 Elements
// ======================
const fileInput = document.getElementById("file");
const preview = document.getElementById("preview");
const downloadBtn = document.getElementById("download");
const loader = document.getElementById("loader");
const dropArea = document.getElementById("drop-area");

// ======================
// 📂 Drag & Drop
// ======================
if (dropArea) {
  dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.style.border = "2px dashed #00ffcc";
  });

  dropArea.addEventListener("dragleave", () => {
    dropArea.style.border = "2px dashed #ccc";
  });

  dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.style.border = "2px dashed #ccc";

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      fileInput.files = files;
      preview.src = URL.createObjectURL(files[0]);
    }
  });
}

// ======================
// ⚡ Resize + Upload
// ======================
async function upload() {

  const file = fileInput.files[0];
  if (!file) {
    alert("Image select karo");
    return;
  }

  loader.style.display = "block";

  // 🔥 compress before upload
  const img = new Image();
  img.src = URL.createObjectURL(file);

  await new Promise(resolve => img.onload = resolve);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const maxWidth = 1000;
  const scale = maxWidth / img.width;

  canvas.width = maxWidth;
  canvas.height = img.height * scale;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise(resolve =>
    canvas.toBlob(resolve, "image/jpeg", 0.7)
  );

  // preview instantly
  preview.src = URL.createObjectURL(blob);

  // send to server
  const formData = new FormData();
  formData.append("image", blob, "image.jpg");

  try {
    const res = await fetch("/resize", {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error();

    const resultBlob = await res.blob();
    const url = URL.createObjectURL(resultBlob);

    preview.src = url;

    downloadBtn.href = url;
    downloadBtn.download = "snapscale.jpg";
    downloadBtn.style.display = "inline-block";

  } catch (err) {
    alert("Server error aa gaya");
    console.error(err);
  }

  loader.style.display = "none";
}

// ======================
// 🤖 Background Remove (Optional)
// ======================
async function removeBG() {

  const file = fileInput.files[0];
  if (!file) {
    alert("Image select karo");
    return;
  }

  loader.style.display = "block";

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await fetch("/remove-bg", {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error();

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    preview.src = url;

    downloadBtn.href = url;
    downloadBtn.download = "bg-removed.png";
    downloadBtn.style.display = "inline-block";

  } catch (err) {
    alert("BG remove fail");
  }

  loader.style.display = "none";
}
