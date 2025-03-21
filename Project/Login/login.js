document.addEventListener("DOMContentLoaded", () => {
    // Check if the user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
        window.location.href = "Home/home.html"; // Redirect to Dashboard
    }
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) {
        localStorage.setItem("token", data.token); // Save token
        localStorage.setItem("userData", JSON.stringify(data.user)); // Save user info
        window.location.href = "Home/home.html"; // Redirect to dashboard
    } else {
        alert(data.message); // Show error message
    }
});
