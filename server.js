const API = "/resize";

// ======================
// 📂 Drag & Drop Upload
// ======================
const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("file");

// highlight
dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.classList.add("active");
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("active");
});

// drop file
dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropArea.classList.remove("active");

  const files = e.dataTransfer.files;
  if (files.length > 0) {
    fileInput.files = files;
    document.getElementById("preview").src =
      URL.createObjectURL(files[0]);
  }
});

// ======================
// ⚡ Fast Upload + Resize
// ======================
async function upload() {

  const file = fileInput.files[0];
  if (!file) {
    alert("Image select karo");
    return;
  }

  document.getElementById("loader").style.display = "block";

  // 🔥 CLIENT SIDE COMPRESSION
  const img = new Image();
  img.src = URL.createObjectURL(file);
  await new Promise(r => img.onload = r);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const maxWidth = 1000;
  const scale = maxWidth / img.width;

  canvas.width = maxWidth;
  canvas.height = img.height * scale;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // compress
  const compressedBlob = await new Promise(resolve =>
    canvas.toBlob(resolve, "image/jpeg", 0.7)
  );

  // instant preview
  document.getElementById("preview").src =
    URL.createObjectURL(compressedBlob);

  // send to server
  const formData = new FormData();
  formData.append("image", compressedBlob, "image.jpg");

  try {
    const res = await fetch(API, {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error();

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    document.getElementById("preview").src = url;

    const d = document.getElementById("download");
    d.href = url;
    d.download = "snapscale.jpg";
    d.style.display = "block";

  } catch (err) {
    alert("Upload fail ho gaya");
    console.error(err);
  }

  document.getElementById("loader").style.display = "none";
}


// ======================
// 🤖 AI Background Remove
// ======================
async function removeBG() {

  const file = fileInput.files[0];
  if (!file) {
    alert("Image select karo");
    return;
  }

  document.getElementById("loader").style.display = "block";

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

    document.getElementById("preview").src = url;

    const d = document.getElementById("download");
    d.href = url;
    d.download = "bg-removed.png";
    d.style.display = "block";

  } catch (err) {
    alert("BG remove fail ho gaya");
    console.error(err);
  }

  document.getElementById("loader").style.display = "none";
}
