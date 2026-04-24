async function upload() {
  const file = document.getElementById("file").files[0];
  let width = document.getElementById("width").value;
  let height = document.getElementById("height").value;
  const percent = document.getElementById("percent").value;
  const format = document.getElementById("format").value;
  const quality = document.getElementById("quality").value;
  const unit = document.getElementById("unit").value;

  if (!file) return alert("Image select karo");

  document.getElementById("loader").style.display = "block";

  const img = new Image();
  img.src = URL.createObjectURL(file);
  await new Promise(r => img.onload = r);

  if (percent) {
    width = img.width * (percent / 100);
    height = img.height * (percent / 100);
  }

  const dpi = 96;

  if (unit === "cm") {
    width = (width / 2.54) * dpi;
    height = (height / 2.54) * dpi;
  }

  if (unit === "inch") {
    width = width * dpi;
    height = height * dpi;
  }

  if (!width) width = img.width;
  if (!height) height = img.height;

  const formData = new FormData();
  formData.append("image", file);
  formData.append("width", width);
  formData.append("height", height);
  formData.append("format", format);
  formData.append("quality", quality);

  const res = await fetch("https://snapscale-jvat.onrender.com/resize", {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    alert("Server error");
    return;
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  document.getElementById("preview").src = url;

  const d = document.getElementById("download");
  d.href = url;
  d.download = "snapscale." + format;
  d.style.display = "block";

  document.getElementById("loader").style.display = "none";
}

// Background switch
function setBackground(type) {
  if (type === "default") {
    document.body.style.background =
      "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('bg.jpg')";
  }
  if (type === "dark") {
    document.body.style.background = "#020617";
  }
  if (type === "gradient") {
    document.body.style.background = "linear-gradient(45deg,#0f172a,#1e293b)";
  }
}
