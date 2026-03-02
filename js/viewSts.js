const tableHead = docEl("tH");

async function getStudentDetails() {
  console.log("FETCHING");
  try {
    const res = await fetch(
      "https://student-management-system-u00h.onrender.com/students",
      {
        method: "GET",
      },
    );
    const data = await res.json();
    studentData = Object.values(data["studentData"]);
    console.log(studentData);
    insertStudent(studentData);
  } catch (err) {
    console.log("server ERROR: ", err);
  }
}
getStudentDetails();

function insertStudent(stDataArr) {
  tableHead.innerHTML = `
  <tr>
                <th>Name</th>
                <th>Roll No</th>
                <th>Email</th>
                <th>Course</th>
              </tr>
  `;
  stDataArr.forEach((el) => {
    tableHead.innerHTML += `
    <tr class="stRow">
    <td>
    
    <button class="getDetBtn" onclick="window.location.href='studentDetails.html?rollNo=${el["rollNo"]}'">
    >
    </button>
    ${el["name"]}
    </td>
    <td>${el["rollNo"]}</td>
    <td>${el["email"]}</td>
    <td>${el["course"]}</td>
    </tr>`;
  });
}

const serachInpEl = document.getElementById("searchInput");
serachInpEl.addEventListener("input", (e) => {
  searchSt(e.target.value);
});

function searchSt(val) {
  const searchVal = val.toLowerCase();
  const filteredSts = studentData.filter(
    (st) =>
      st.name.toLowerCase().includes(searchVal) ||
      st.rollNo.toLowerCase().includes(searchVal) ||
      st.email.toLowerCase().includes(searchVal),
  );
  insertStudent(filteredSts);
}
// function searchSt(val) {
//   const searchVal = val.toLowerCase();

//   const filteredSts = studentData.filter(
//     (st) =>
//       st.name.toLowerCase().includes(searchVal) ||
//       st.rollNo.toLowerCase().includes(searchVal) ||
//       st.email.toLowerCase().includes(searchVal),
//   );

//   insertStudent(filteredSts);
// }
