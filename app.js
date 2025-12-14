let assignments = [];
let currentFilter = "all";

// ------------------------------ MENU TOGGLE ---------------------------
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.querySelector(".sidebar");

if (menuToggle) {
    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("show");
    });
}

const closeSidebar = document.getElementById("closeSidebar");

if (closeSidebar) {
    closeSidebar.addEventListener("click", () => {
        sidebar.classList.remove("show");
    });
}
// ----------------------------- LOAD ASSIGNMENTS --------------------------

async function loadAssignments() {
    const response = await fetch("backend/get_assignments.php");
    const text = await response.text();

    if (text === "not_logged_in") {
        window.location.href = "login_signup/login.html";
        return;
    }

    assignments = JSON.parse(text);
    renderAssignments();
}

// ----------------------------- ADD ASSIGNMENT ----------------------------

async function addAssignment(e) {
    e.preventDefault();

    let formData = new FormData(document.getElementById("assignmentForm"));

    const response = await fetch("backend/submit_assignment.php", {
        method: "POST",
        body: formData
    });

    const result = await response.text();

    if (result === "success") {
        loadAssignments();
        switchView("dashboard");
        document.getElementById("assignmentForm").reset();
    } else {
        alert("Error saving assignment");
    }
}

// ----------------------------- DELETE ASSIGNMENT -------------------------

async function deleteAssignmentConfirm(id) {
    if (!confirm("Are you sure you want to delete this assignment?")) return;

    const response = await fetch("backend/delete_assignment.php?id=" + id);

    if ((await response.text()) === "success") {
        loadAssignments();
    } else {
        alert("Delete failed");
    }
}

// ----------------------------- MARK COMPLETED ----------------------------

async function markCompleted(id) {
    let formData = new FormData();
    formData.append("id", id);

    const response = await fetch("backend/mark_completed.php", {
        method: "POST",
        body: formData
    });

    if ((await response.text()) === "success") {
        loadAssignments();
    } else {
        alert("Update failed");
    }
}

// ----------------------------- RENDER TABLE ------------------------------

function renderAssignments() {
    const tbody = document.getElementById("assignementTableBody");
    const emptyMessage = document.getElementById("emptyMessage");
    const searchInput = document.getElementById("searchInput");
    tbody.innerHTML = "";

    let visibleCount = 0;
    const today = new Date().toISOString().split("T")[0];

    assignments.forEach((a) => {
        if (!matchesFilter(a, today)) return;

        let query = searchInput.value.trim().toLowerCase();
        if (query && !a.title.toLowerCase().includes(query) && !a.subject.toLowerCase().includes(query)) {
            return;
        }

        visibleCount++;

        const tr = document.createElement("tr");

        const isOverdue = a.status !== "completed" && a.dueDate < today;
        const statusLabel = isOverdue ? "Overdue" : a.status === "completed" ? "Completed" : "Pending";
        const statusClass = isOverdue ? "status-overdue" :
            a.status === "completed" ? "status-complete" : "status-pending";

        tr.innerHTML = `
            <td>${a.title}</td>
            <td>${a.subject}</td>
            <td>${a.dueDate}</td>
            <td><span class="priority-pill priority-${a.priority}">${a.priority}</span></td>
            <td><span class="status-pill ${statusClass}">${statusLabel}</span></td>
            <td>
                <button class="table-action-btn" onclick="toggleDesc(this)">View</button>
                <button class="table-action-btn" onclick="markCompleted('${a.id}')">Mark Done</button>
                <button class="table-action-btn" onclick="deleteAssignmentConfirm('${a.id}')">Delete</button>
            </td>
        `;

        const descRow = document.createElement("tr");
        descRow.classList.add("desc-row");
        descRow.style.display = "none";
        descRow.innerHTML = `
            <td colspan="6" class="desc-cell">
                <strong>Description:</strong> ${a.description || "No description provided"}
            </td>
        `;

        tbody.appendChild(tr);
        tbody.appendChild(descRow);
    });

    emptyMessage.style.display = visibleCount === 0 ? "block" : "none";

    updateSummaryCards();
}

function toggleDesc(btn) {
  const descRow = btn.closest("tr").nextElementSibling;
  descRow.style.display = descRow.style.display === "none" ? "table-row" : "none";
}

// ----------------------------- SUMMARY CARDS -----------------------------

function updateSummaryCards() {
    const totalEl = document.getElementById("totalAssignments");
    const weekEl = document.getElementById("dueThisWeek");
    const completedEl = document.getElementById("completedCount");
    const overdueEl = document.getElementById("overdueCount");

    const today = new Date().toISOString().split("T")[0];

    const weekLater = new Date();
    weekLater.setDate(weekLater.getDate() + 7);
    const weekStr = weekLater.toISOString().split("T")[0];

    const total = assignments.length;
    const completed = assignments.filter(a => a.status === "completed").length;
    const overdue = assignments.filter(a => a.status !== "completed" && a.dueDate < today).length;
    const dueThisWeek = assignments.filter(a => a.dueDate >= today && a.dueDate <= weekStr).length;

    totalEl.innerText = total;
    completedEl.innerText = completed;
    overdueEl.innerText = overdue;
    weekEl.innerText = dueThisWeek;
}

// ----------------------------- FILTER SYSTEM -----------------------------

function matchesFilter(a, today) {
    if (currentFilter === "all") return true;
    if (currentFilter === "pending") return a.status === "pending";
    if (currentFilter === "completed") return a.status === "completed";
    if (currentFilter === "overdue") return a.status !== "completed" && a.dueDate < today;
}

// ----------------------------- VIEW SWITCH ---------------------------

function switchView(target) {
    const views = ["dashboard", "add"];

    views.forEach(v => {
        document.getElementById(`view-${v}`).classList.toggle("hidden", v !== target);
    });

    document.querySelectorAll(".nav-link").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.view === target);
    });
}

// ----------------------------- FETCH USER NAME -------------------------

async function updateUserDisplay() {
    const el = document.querySelector(".user-name");

    const res = await fetch("backend/get_user.php");
    const name = await res.text();

    if (name === "not_logged_in") {
        window.location.href = "login_signup/login.html";
        return;
    }

    el.textContent = "Student: " + name;
}

// ----------------------------- LOGOUT -------------------------------

async function logout() {
    const res = await fetch("backend/logout.php");
    if ((await res.text()) === "success") {
        window.location.href = "login_signup/login.html";
    }
}

// ----------------------------- PAGE LOAD ----------------------------

document.addEventListener("DOMContentLoaded", () => {
    updateUserDisplay();
    loadAssignments();

    const form = document.getElementById("assignmentForm");
    if (form) form.addEventListener("submit", addAssignment);

    document.querySelectorAll(".nav-link").forEach(btn => {
        btn.addEventListener("click", () => switchView(btn.dataset.view));
    });

    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.addEventListener("input", renderAssignments);

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) logoutBtn.addEventListener("click", logout);

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            currentFilter = btn.dataset.filter;

            document.querySelectorAll(".filter-btn").forEach(b =>
                b.classList.remove("active")
            );

            btn.classList.add("active");
            renderAssignments();
        });
    });

    const dashAddBtn = document.getElementById("openAddFromDashboard");
    if (dashAddBtn) {
        dashAddBtn.addEventListener("click", () => {
            switchView("add");
        });
    }

    const cancelAdd = document.getElementById("cancelAdd");
    if (cancelAdd) {
        cancelAdd.addEventListener("click", () => {
            switchView("dashboard");
        });
    }

    // Restore theme
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }

});

const themeToggle = document.getElementById("themeToggle");

// Load saved theme
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
    document.body.classList.add("light-theme");
    if (themeToggle) themeToggle.textContent = "🌙";
} else {
    if (themeToggle) themeToggle.textContent = "☀️";
}

// Switch theme on click
if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");

        if (document.body.classList.contains("light-theme")) {
            themeToggle.textContent = "🌙";
            localStorage.setItem("theme", "light");
        } else {
            themeToggle.textContent = "☀️";
            localStorage.setItem("theme", "dark");
        }
    });
}
