const tableHead = docEl("tH");

async function getStudentDetails() {
  try {
    const res = await fetch(
      "https://student-management-system-u00h.onrender.com/students",
      {
        method: "GET",
      },
    );
    const data = await res.json();
    console.log("View Students from server: ", data);
    insertStudent(data["studentData"]);
  } catch (err) {
    console.log("server ERROR: ", err);
  }
}
getStudentDetails();

function insertStudent(dataOfStudent) {
  const stArr = Object.values(dataOfStudent);
  stArr.forEach((el) => {
    console.log(el);
    tableHead.innerHTML += `<tr>
                <td>${el["name"]}</td>
                <td>${el["rollNo"]}</td>
                <td>${el["email"]}</td>
                <td>${el["course"]}</td>
              </tr>`;
  });
}
// insertStudent(stData);
