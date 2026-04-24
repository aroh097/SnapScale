async function upload() {
  const file = document.getElementById("file").files[0];

  let width = document.getElementById("width").value;
  let height = document.getElementById("height").value;

  const format = document.getElementById("format").value;
  const quality = document.getElementById("quality").value;
  const unit = document.getElementById("unit").value;

  if (!file) return alert("Image select karo");

  document.getElementById("loader").style.display = "block";

  const img = new Image();
  img.src = URL.createObjectURL(file);
  await new Promise(r => img.onload = r);

  // default fallback
  if (!width) width = img.width;
  if (!height) height = img.height;

  // unit convert
  const dpi = 96;

  if (unit === "cm") {
    width = (width / 2.54) * dpi;
    height = (height / 2.54) * dpi;
  }

  if (unit === "inch") {
    width = width * dpi;
    height = height * dpi;
  }

  const formData = new FormData();
  formData.append("image", file);
  formData.append("width", Math.round(width));
  formData.append("height", Math.round(height));
  formData.append("format", format);
  formData.append("quality", quality);

  try {
    const res = await fetch("https://snapscale-jvat.onrender.com/resize", {
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

  } catch {
    alert("Server error aa raha hai");
  }

  document.getElementById("loader").style.display = "none";
}

function setBackground(type) {
  if (type === "default") {
    document.body.style.background =
      "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('bg.jpg')";
  } 
  else if (type === "dark") {
    document.body.style.background = "#020617";
  } 
  else {
    document.body.style.background = "linear-gradient(45deg,#0f172a,#1e293b)";
  }
}
