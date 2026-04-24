const API = "/resize";

async function upload() {

  const file = document.getElementById("file").files[0];
  let width = document.getElementById("width").value;
  let height = document.getElementById("height").value;

  const format = document.getElementById("format").value;
  const quality = document.getElementById("quality").value;
  const unit = document.getElementById("unit").value;

  if (!file) {
    alert("Image select karo");
    return;
  }

  document.getElementById("loader").style.display = "block";

  document.getElementById("preview").src = URL.createObjectURL(file);

  const img = new Image();
  img.src = URL.createObjectURL(file);
  await new Promise(r => img.onload = r);

  if (!width) width = img.width;
  if (!height) height = img.height;

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
    d.download = "snapscale." + format;
    d.style.display = "block";

  } catch (err) {
    alert("Upload ya processing fail ho gaya");
    console.error(err);
  }

  document.getElementById("loader").style.display = "none";
}
