/*************************************************
  Email Signature Generator
**************************************************/

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const templateSelect = document.getElementById("templateSelect");

const nameInput = document.getElementById("nameInput");
const jobInput = document.getElementById("jobInput");
const addressInput = document.getElementById("addressInput");
const phoneInput = document.getElementById("phoneInput");
const emailInput = document.getElementById("emailInput");
const websiteInput = document.getElementById("websiteInput");

const downloadBtn = document.getElementById("downloadBtn");
const copyLinkBtn = document.getElementById("copyLinkBtn");
const statusEl = document.getElementById("status");

const TEMPLATES = {
  template1: {
    src: "./assets/Emailsignature.jpg",
    width: 2048,
    height: 819,

    fields: {
      name: {
        x: 895,
        y: 488,
        maxWidth: 520,
        fontSize: 48,
        color: "#1E6E44",
        weight: "700",
      },

      job: {
        x: 895,
        y: 545,
        maxWidth: 420,
        fontSize: 28,
        color: "#444444",
        weight: "500",
      },

      address: {
        x: 940,
        y: 610,
        maxWidth: 420,
        fontSize: 24,
        color: "#555555",
        weight: "400",
      },

      email: {
        x: 940,
        y: 668,
        maxWidth: 420,
        fontSize: 24,
        color: "#555555",
        weight: "400",
      },

      phone: {
        x: 1440,
        y: 610,
        maxWidth: 360,
        fontSize: 24,
        color: "#555555",
        weight: "400",
      },

      website: {
        x: 1440,
        y: 668,
        maxWidth: 360,
        fontSize: 24,
        color: "#555555",
        weight: "400",
      },
    },
  },
};

let bgImage = null;

function resizeCanvas(templateKey) {
  const cfg = TEMPLATES[templateKey];
  canvas.width = cfg.width;
  canvas.height = cfg.height;
}

function loadTemplate(templateKey) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      bgImage = img;
      resolve();
    };

    img.onerror = () => reject(new Error("Failed to load template image"));

    img.src = TEMPLATES[templateKey].src;
  });
}

function isArabic(text) {
  return /[\u0600-\u06FF]/.test(text);
}

function drawField(text, field) {
  if (!text) return;

  const fontFamily = `"BrandFont", Arial`;
  let size = field.fontSize;

  ctx.font = `${field.weight} ${size}px ${fontFamily}`;

  while (ctx.measureText(text).width > field.maxWidth && size > 10) {
    size -= 1;
    ctx.font = `${field.weight} ${size}px ${fontFamily}`;
  }

  ctx.fillStyle = field.color;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.direction = "ltr";

  ctx.fillText(text, field.x, field.y);
}
function draw() {
  const key = templateSelect.value;
  const cfg = TEMPLATES[key];

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (bgImage) {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  }

  drawField(nameInput.value.trim(), cfg.fields.name);
  drawField(jobInput.value.trim(), cfg.fields.job);
  drawField(addressInput.value.trim(), cfg.fields.address);
  drawField(emailInput.value.trim(), cfg.fields.email);
  drawField(phoneInput.value.trim(), cfg.fields.phone);
  drawField(websiteInput.value.trim(), cfg.fields.website);
}

async function init() {
  resizeCanvas(templateSelect.value);
  await loadTemplate(templateSelect.value);
  draw();
}

templateSelect.addEventListener("change", async () => {
  resizeCanvas(templateSelect.value);
  await loadTemplate(templateSelect.value);
  draw();
});

[
  nameInput,
  jobInput,
  addressInput,
  phoneInput,
  emailInput,
  websiteInput,
].forEach((input) => {
  input.addEventListener("input", draw);
});

downloadBtn.addEventListener("click", async () => {
  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png", 1),
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "email-signature.png";
  a.click();

  URL.revokeObjectURL(url);
});

copyLinkBtn.addEventListener("click", async () => {
  const fixedUrl = "https://email-signature-alafdal.vercel.app/";

  try {
    await navigator.clipboard.writeText(fixedUrl);
    statusEl.textContent = " تم نسخ رابط موقع إنشاء التوقيع";
  } catch {
    statusEl.textContent = "انسخ الرابط يدويًا";
  }
});

init().catch(() => {
  statusEl.textContent = "تعذر تحميل قالب التوقيع";
});
