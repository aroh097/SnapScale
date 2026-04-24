const API = "/resize";

const dropArea = document.getElementById("drop-area");
const file = document.getElementById("file");

// drag drop
dropArea.addEventListener("dragover", e => {
  e.preventDefault();
});

dropArea.addEventListener("drop", e => {
  e.preventDefault();
  file.files = e.dataTransfer.files;
  document.getElementById("preview").src =
    URL.createObjectURL(file.files[0]);
});

// resize
async function upload() {
  const f = file.files[0];

  const formData = new FormData();
  formData.append("image", f);
  formData.append("width", document.getElementById("width").value);
  formData.append("height", document.getElementById("height").value);
  formData.append("format", document.getElementById("format").value);
  formData.append("quality", document.getElementById("quality").value);

  const res = await fetch(API, { method: "POST", body: formData });
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  document.getElementById("preview").src = url;

  const d = document.getElementById("download");
  d.href = url;
  d.download = "image";
  d.style.display = "block";
}

// remove bg
async function removeBG() {
  const f = file.files[0];

  const formData = new FormData();
  formData.append("image", f);

  const res = await fetch("/remove-bg", {
    method: "POST",
    body: formData
  });

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  document.getElementById("preview").src = url;

  const d = document.getElementById("download");
  d.href = url;
  d.download = "bg-removed.png";
  d.style.display = "block";
}
