const form = docEl("addStudentForm");
const alertEl = docEl("alert");
const keyAlertEL2 = document.querySelector(".key-alert"); //FOR ANIMATION ONLY

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
  console.log("Sending KEY: ", key);
  try {
    const res = await fetch(`${renderAPI}/adminCheck`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authKey: key }),
    });
    const data = await res.json();
    if (data.status === "error") {
      keyAlertEL2.classList.add("active");
      setTimeout(() => {
        keyAlertEL2.classList.remove("active");
      }, 1000);
      keyAlertEl.innerText = data.msg;
      return false;
    }
    return true;
  } catch (err) {
    keyAlertEL2.classList.add("active");
    setTimeout(() => {
      keyAlertEL2.classList.remove("active");
    }, 1000);
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
    const res = await fetch(`${renderAPI}/addStudent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(st),
    });

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
