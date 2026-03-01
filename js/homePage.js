let totalStudents = 0;
const total_Student_El = docEl("totalStudents");

async function getStudents() {
  try {
    const res = await fetch("http://192.168.31.116:5100/students/");
    const data = await res.json();
    totalStudents = data["studentsNum"];
    total_Student_El.innerText = totalStudents;
    console.log(totalStudents);
  } catch (err) {
    console.log("Server Error: ", err);
  }
}
getStudents();
