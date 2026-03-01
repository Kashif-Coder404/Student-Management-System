const form = docEl("addStudentForm");
const alertEl = docEl("alert");

const keyOverlay = docEl("keyOverlay");
const authKeyInp = docEl("authKey");
const keyAlertEl = docEl("keyAlert");
const verifyKeyBtn = docEl("verifyKeyBtn");
const cancelKeyBtn = docEl("cancelKeyBtn");

let cachedStudentData = null;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  cachedStudentData = Object.fromEntries(formData.entries());

  keyOverlay.style.display = "flex";
});

cancelKeyBtn.addEventListener("click", () => {
  keyOverlay.style.display = "none";
  authKeyInp.value = "";
  keyAlertEl.innerText = "";
});

async function keyCheck(key) {
  try {
    const res = await fetch(
      "https://student-management-system-u00h.onrender.com/adminCheck",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminKey: key }),
      },
    );
    const data = await res.json();
    if (data.status === "error") {
      keyAlertEl.innerText = data.msg;
      return false;
    }
    return true;
  } catch (err) {
    keyAlertEl.innerText = "Server Error: " + err;
    return false;
  }
}
verifyKeyBtn.addEventListener("click", async () => {
  const adminKey = authKeyInp.value.trim();

  if (!adminKey) {
    keyAlertEl.innerText = "Admin key is required!";
    return;
  }
  const isValid = await keyCheck(adminKey);
  if (isValid) {
    addStudent(cachedStudentData);
  }
});

async function addStudent(st) {
  try {
    const res = await fetch(
      "https://student-management-system-u00h.onrender.com/addStudent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(st),
      },
    );

    const data = await res.json();

    // success
    keyOverlay.style.display = "none";
    form.reset();
    authKeyInp.value = "";

    window.location.href = `message.html?status=${data.status}&msg=${data.message}`;
  } catch (err) {
    alertEl.innerText = "Server Error!";
  }
}
