document.getElementById("loginForm").addEventListener("submit", function(e){
    e.preventDefault();

    let formData = new FormData(this);

    fetch("../backend/login.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.text())
    .then(data => {
        if (data === "success") {
            window.location.href = "../index.html";
        } 
        else if (data === "invalid") {
            alert("Invalid email or password");
        } 
        else {
            alert("Login error");
        }
    });
});
