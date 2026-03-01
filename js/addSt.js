const form = docEl("addStudentForm");
const alertEl = docEl("alert");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const student = Object.fromEntries(formData.entries());
  addStudent(student);
});

async function addStudent(st) {
  try {
    const res = await fetch("http://192.168.31.116:5100/addStudent/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(st),
    });
    const data = await res.json();
    window.location.href = `message.html?status=${data.status}&msg=${data.message}`;
  } catch (err) {
    alertEl.innerText = "Server Error!";
  }
}
