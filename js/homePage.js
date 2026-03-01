let totalStudents = 0;
const total_Student_El = docEl("totalStudents");

async function getStudents() {
  try {
    const res = await fetch(
      "https://student-management-system-u00h.onrender.com/students/",
    );
    const data = await res.json();
    totalStudents = data["studentsNum"];
    total_Student_El.innerText = totalStudents;
    console.log(totalStudents);
  } catch (err) {
    console.log("Server Error: ", err);
  }
}
getStudents();
