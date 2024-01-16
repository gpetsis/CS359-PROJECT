$(document).ready(function() {
    if(window.location.href == 'http://localhost:8080/Ask2/admindashboard.html') {
        console.log("Here");
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var users = JSON.parse(xhr.responseText);
                console.log("Ola kala");
                console.log(users);
                $("#ajaxContent").html(createTableFromJSON(users));
            } else if (xhr.status !== 200) {
                return;
            }
        };

        console.log("Called init");
        xhr.open('GET', 'Admin');
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send();
    }
})

function handle_admin_login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    
    if(username == "admin" && password == "admin12*") {
        window.location.href = 'admindashboard.html';
    } else {
        $("#response-div").html("<h3>You are not the Master</h3>");
        console.log("You are not the Master");
    }
}

function createTableFromJSON(data) {
    var html = "<table id='myTable'><tr><th>Username</th><th>Name</th><th>Delete User</th></tr>";
    for(var i = 0; i < data.length; i++) {
        html += "<tr><td>" + data[i]["email"] + "</td><td>" + data[i]["firstname"] + "</td><td><input type='button' onclick='adminRemoveUser(" + JSON.stringify(data[i]) + ")' value='Delete'></td></tr>";
    }
    html += "</table>";
    return html;
}

function adminRemoveUser(user) {
    console.log(user);
    
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = xhr.responseText;
            console.log(response);
        } else if (xhr.status !== 200) {
            return;
        }
    };

    xhr.open('DELETE', 'Admin');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(user));
}