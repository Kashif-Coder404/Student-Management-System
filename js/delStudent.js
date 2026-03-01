const form = docEl("delStForm");
const keyInp = docEl("authKey");
const sendKeyBtn = docEl("sendKeybtn");
const delAlertEl = docEl("delAlert");
const keyAlertEl = docEl("keyAlert");

if (savedAdmin === "true" && savedKey) {
  delkey = savedKey;
  document.querySelector(".keyPrCont").style.display = "none";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const stDetail = Object.fromEntries(formData.entries());
  console.log(stDetail);

  delSt(stDetail);
});

sendKeyBtn.addEventListener("click", () => {
  adminCheck(keyInp.value.toString());
  console.log(delkey);
});
async function adminCheck(key) {
  try {
    const res = await fetch(
      `https://student-management-system-u00h.onrender.com/delStudents/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authKey: key, stRoll: "", name: "" }),
      },
    );
    const data = await res.json();
    console.log("data first: ", data);

    if (data.isAdmin) {
      keyAlertEl.innerText = "Access Granted";

      // ✅ save login state
      sessionStorage.setItem("isAdmin", "true");
      sessionStorage.setItem("adminKey", key);

      delkey = key;

      setTimeout(() => {
        document.querySelector(".keyPrCont").style.display = "none";
      }, 1000);
    } else {
      console.log(data);
      keyAlertEl.innerText = data.error || "Invalid Key";
    }
  } catch (err) {
    console.log(err);
    keyAlertEl.innerText = "Server Error!";
  }
}

async function delSt(stDet) {
  if (!sessionStorage.getItem("isAdmin")) {
    delAlertEl.innerText = "Admin login required!";
    return;
  }

  try {
    const res = await fetch(
      `https://student-management-system-u00h.onrender.com/delStudents/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Map your form data to the backend 'stRoll' field
        body: JSON.stringify({
          authKey: delkey,
          stRoll: stDet.rollNo,
          name: stDet.name,
        }),
      },
    );

    const data = await res.json();
    console.log(data);
    delAlertEl.innerText = data.msg || data.error;

    if (data.status === "success") {
      window.location.href = `message.html?status=${data.status}&msg=${data.message}`;
    }
  } catch (err) {
    console.log(err);
    delAlertEl.innerText = "Server Error!";
  }
}
