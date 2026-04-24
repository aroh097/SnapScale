// ======================
// 📤 Upload & Resize
// ======================
async function upload() {

  const file = document.getElementById("file").files[0];

  let width = document.getElementById("width").value;
  let height = document.getElementById("height").value;
  const percent = document.getElementById("percent")?.value;

  const format = document.getElementById("format").value;
  const quality = document.getElementById("quality").value;
  const unit = document.getElementById("unit").value;

  if (!file) {
    alert("Image select karo");
    return;
  }

  // loader show
  document.getElementById("loader").style.display = "block";

  // preview instantly
  document.getElementById("preview").src = URL.createObjectURL(file);

  const img = new Image();
  img.src = URL.createObjectURL(file);
  await new Promise(r => img.onload = r);

  // % resize logic
  if (percent) {
    width = img.width * (percent / 100);
    height = img.height * (percent / 100);
  }

  // default fallback
  if (!width) width = img.width;
  if (!height) height = img.height;

  // 📏 unit conversion
  const dpi = 96;

  if (unit === "cm") {
    width = (width / 2.54) * dpi;
    height = (height / 2.54) * dpi;
  }

  if (unit === "inch") {
    width = width * dpi;
    height = height * dpi;
  }

  // form data
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

    if (!res.ok) {
      throw new Error("Server error");
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    // result preview
    document.getElementById("preview").src = url;

    // download
    const d = document.getElementById("download");
    d.href = url;
    d.download = "snapscale." + format;
    d.style.display = "block";

  } catch (err) {
    alert("Server error aa raha hai");
    console.error(err);
  }

  document.getElementById("loader").style.display = "none";
}


// ======================
// 🎨 Background Switch
// ======================
function setBackground(type) {

  if (type === "default") {
    document.body.style.backgroundImage =
      "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('bg.jpg')";
  }

  else if (type === "dark") {
    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = "#020617";
  }

  else if (type === "gradient") {
    document.body.style.backgroundImage = "none";
    document.body.style.background =
      "linear-gradient(45deg,#0f172a,#1e293b)";
  }
}
