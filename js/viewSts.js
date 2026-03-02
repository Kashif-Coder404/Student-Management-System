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
    tableHead.innerHTML += `
    <tr class="stRow" name="${el["name"]}" id="${el["rollNo"]}">
    <td>
    
    ${el["name"]}
    <button onclick="window.location.href='studentDetails.html?rollNo=${el["rollNo"]}'">
    >
  </button>
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

function searchSt(nameORrollNo) {
  const idEls = document.querySelectorAll(".stRow");

  idEls.forEach((el) => {
    const stId = el.getAttribute("id");
    const stName = el.getAttribute("name");
    // console.log(el.getAttribute("id"));
    if (stId.includes(nameORrollNo) || stName.includes(nameORrollNo)) {
      console.log("FOUND!")
    }
  });
}
