$(document).ready(function() {
    if(window.location.href != 'http://localhost:8080/Ask2/adminlogin.html') {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                window.location.href = 'dashboard.html';
            } else if (xhr.status !== 200) {
                return;
            }
        };

        xhr.open('GET', 'Register');
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send();
    }
})

function handle_login() {
    let myForm = document.getElementById('form');
    let formData = new FormData(myForm);
    var jsonData = {};
    formData.forEach(function(value, key){
        jsonData[key] = value;
        console.log(key, jsonData[key]);
    });
    
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            loadLoginPage();
            return false;
        } else if (xhr.status !== 200) {
            $('#response-div').html('<h3>Request failed. Returned status of ' + xhr.status + "<br></h3>");
            return false;
        }
    };
    xhr.open('POST', 'Login');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("User", "-");
   
    console.log(JSON.stringify(jsonData));
    xhr.send(JSON.stringify(jsonData));
    return false;
}

function loadLoginPage() {
    window.location.href = 'dashboard.html';
}

function handle_admin_login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    
    if(username == "admin" && password == "admin12*") {
        console.log("Welcome Master");
        window.location.href = 'admindashboard.html';
    } else {
        console.log("You are not the Master");
    }
    
}