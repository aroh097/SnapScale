async function upload() {
  const file = document.getElementById("file").files[0];
  let width = document.getElementById("width").value;
  let height = document.getElementById("height").value;
  const percent = document.getElementById("percent").value;
  const format = document.getElementById("format").value;
  const quality = document.getElementById("quality").value;
  const bgMode = document.getElementById("bgMode").value;
  const bgColor = document.getElementById("bgColor").value;

  if (!file) return alert("Image select karo");

  document.getElementById("status").innerText = "Processing...";

  const img = new Image();
  img.src = URL.createObjectURL(file);
  await new Promise(r => img.onload = r);

  if (percent) {
    width = img.width * (percent / 100);
    height = img.height * (percent / 100);
  }

  const formData = new FormData();
  formData.append("image", file);
  formData.append("width", width);
  formData.append("height", height);
  formData.append("format", format);
  formData.append("quality", quality);
  formData.append("bgMode", bgMode);
  formData.append("bgColor", bgColor);

  const res = await fetch("https://snapscale-jvat.onrender.com/resize", {
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

  document.getElementById("status").innerText = "Done ✅";
}

// Theme switch
function changeTheme() {
  const theme = document.getElementById("theme").value;

  if (theme === "light") {
    document.body.style.background = "#ffffff";
    document.body.style.color = "#000";
  } else if (theme === "neon") {
    document.body.style.background = "#020617";
    document.body.style.color = "#38bdf8";
  } else {
    document.body.style.background = "#020617";
    document.body.style.color = "#fff";
  }
}
