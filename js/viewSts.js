const tableHead = docEl("tH");

async function getStudentDetails() {
  try {
    const res = await fetch(`${renderAPI}/students`, {
      method: "GET",
    });
    const data = await res.json();
    studentData = Object.values(data["studentData"]);
    insertStudent(studentData);
  } catch (err) {
    console.log("server ERROR: ", err);
  }
}
getStudentDetails();

function insertStudent(stDataArr) {
  tableHead.innerHTML = `
  <tr>
                <th><i class="fa-regular fa-user"></i> Name</th>
                <th><i class="fa-regular fa-id-card"></i> Roll No</th>
                <th><i class="fa-regular fa-envelope"></i> Email</th>
                <th><i class="fa-solid fa-book"></i> Course</th>
                <th><i class="fa-solid fa-book"></i> Date</th>
              </tr>
  `;
  stDataArr.forEach((el) => {
    const displayTime = new Date(el["createdAt"]).toLocaleString();
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
    <td>${displayTime}</td>
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
