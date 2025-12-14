document.getElementById("signupForm").addEventListener("submit", function(e){
    e.preventDefault();

    let formData = new FormData(this);

    fetch("../backend/signup.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.text())
    .then(data => {
        if (data === "success") {
            alert("Signup Successful!");
            window.location.href = "login.html";
        }
        else if (data === "exists") {
            alert("Email already registered!");
        }
        else {
            alert("Signup error");
        }
    });
});
