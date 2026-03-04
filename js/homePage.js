let totalStudents = 0;
const total_Student_El = docEl("totalStudents");
const totalCourseEL = docEl("numCourse");
const bcaEL = docEl("BCA");
const bbaEL = docEl("BBA");
const bscITEL = docEl("BSc-IT");
async function getStudents() {
  try {
    const res = await fetch(`${renderAPI}/students`);
    const data = await res.json();
    totalStudents = data["studentsNum"];
    bcaEL.innerText = data["cBCA"];
    bbaEL.innerText = data["cBBA"];
    bscITEL.innerText = data["cBSCIT"];
    total_Student_El.innerText = totalStudents;
    console.log(totalStudents);
  } catch (err) {
    console.log("Server Error: ", err);
  }
}
getStudents();
