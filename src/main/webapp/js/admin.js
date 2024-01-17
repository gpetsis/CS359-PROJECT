var numberOfCats;
var numberOfDogs;

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
        xhr.setRequestHeader("Type", "-");
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send();
        loadStatistics();
    }
})

function getNumberOfPets(type) {
    var xhr = new XMLHttpRequest();
    var number;
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = xhr.responseText;
            console.log(response);
            if(type == "Dogs") {
                numberOfDogs = parseInt(response);
            } else {
                numberOfCats = parseInt(response);
            }
        } else if (xhr.status !== 200) {
            return;
        }
    };

    xhr.open('GET', 'Login');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Request-Type", "Number-Of-" + type);
    xhr.send();
}

function loadStatistics() {
    google.charts.load('current', {'packages':['corechart']});

    google.charts.setOnLoadCallback(initialize);
    
    getNumberOfPets("Cats");
    getNumberOfPets("Dogs");

//    initialize();

}

function drawChart() {
    console.log(numberOfCats, numberOfDogs);

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Pet');
    data.addColumn('number', '# of pets');
    data.addRows([
        ['Cats', numberOfCats],
        ['Dogs', numberOfDogs]
    ]);

    var options = {
        title: 'Total number of pets',
        backgroundColor: {
            fill: 'darkslategrey'
        }
    };

    var chart = new google.visualization.BarChart(document.getElementById('chart'));
    chart.draw(data, options);
}

async function initialize() {
    await new Promise(r => setTimeout(r, 500));
    drawChart();
}

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