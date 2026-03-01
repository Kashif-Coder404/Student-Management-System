const docEl = (id) => {
  return document.getElementById(id);
};

document.addEventListener("DOMContentLoaded", async () => {
  const navbarContainer = docEl("navbar-container");

  const response = await fetch("js/components/navbar.html");
  const data = await response.text();
  navbarContainer.innerHTML = data;

  const menuBtn = document.querySelectorAll(".menu-btn");
  const logoutBtn = docEl("logout-btn");

  if (menuBtn) {
    menuBtn.forEach((el) => {
      el.addEventListener("click", () => {
        toggleSidebar();
      });
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
});
let delkey = "";

const savedAdmin = sessionStorage.getItem("isAdmin");
const savedKey = sessionStorage.getItem("adminKey");

async function logout() {
  try {
    const res = await fetch(
      "https://student-management-system-u00h.onrender.com/logout",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
    );
    const data = await res.json();
    if (data.status === "success") {
      sessionStorage.removeItem("adminKey");
      sessionStorage.removeItem("isAdmin");
    }
    window.location.href = `message.html?status=${data.status}&msg=${data.message}`;
  } catch (err) {
    alertEl.innerText = "Server Error!";
  }
}
function toggleSidebar() {
  const sidebarEl = document.querySelector(".sidebar");
  console.log(sidebarEl);
  if (!sidebarEl) return;

  sidebarEl.classList.toggle("active");
}

document.addEventListener("click", (e) => {
  if (e.target.closest(".sidebar a")) {
    document.querySelector(".sidebar")?.classList.remove("active");
  }
});

//Active sideBar Link

const currentPage = window.location.pathname.split("/").pop();

const sideLinks = document.querySelectorAll(".sideLink");

sideLinks.forEach((li) => {
  const anchor = li.querySelector("a");
  const href = anchor.getAttribute("href");

  if (href === currentPage || (href === "index.html" && currentPage === "")) {
    li.classList.add("active");
  } else {
    li.classList.remove("active");
  }
});

async function stDet(stRollNo) {
  try {
    const res = await fetch(
      "https://student-management-system-u00h.onrender.com/stDet",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stRoll: stRollNo }),
      },
    );
    const data = await res.json();
    console.log(data);
    // window.location.href = `studentDetails.html?staus=${data.status}&msg=${data.message}`;
  } catch (err) {
    console.log(err);
  }
}
