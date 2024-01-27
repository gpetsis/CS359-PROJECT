var numberOfCats;
var numberOfDogs;
var numberOfOwners;
var numberOfKeepers;
var totalEarnings;
var chartType;

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

function getNumberOf(type) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = xhr.responseText;
            console.log(response);
            if(type == "Owners") {
                numberOfOwners = parseInt(response);
            } else if(type == "Keepers") {
                numberOfKeepers = parseInt(response);
            } else if(type == "Dogs") {
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

function getTotalEarnings() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = xhr.responseText;
            console.log(response);
            totalEarnings = response;
        } else if (xhr.status !== 200) {
            return;
        }
    };

    xhr.open('GET', 'Login');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Request-Type", "Total-Earnings");
    xhr.send();
}

function loadStatistics() {
    google.charts.load('current', {'packages':['corechart']});

    google.charts.setOnLoadCallback(initialize);
    
    getNumberOf("Cats");
    getNumberOf("Dogs");
    getNumberOf("Owners");
    getNumberOf("Keepers");
    getTotalEarnings();
}

function drawChartPets() {
    console.log("Cats and Dogs" + numberOfCats, numberOfDogs);

    var data = new google.visualization.DataTable();
    data.addColumn('string', "Pets");
    data.addColumn('number', '# of pets');
    data.addRows([
        ["Cats", numberOfCats],
        ["Dogs", numberOfDogs],
    ]);

    var options = {
        title: 'Total number of pets',
        backgroundColor: {
            fill: 'darkslategrey'
        },
    };

    var chart = new google.visualization.BarChart(document.getElementById('chartPets'));
    chart.draw(data, options);
}

function drawChartUsers() {
    console.log("Keepers and Owners" + numberOfKeepers, numberOfOwners);

    var data = new google.visualization.DataTable();
    data.addColumn('string', "Users");
    data.addColumn('number', '# of users');
    data.addRows([
        ["Keepers", numberOfKeepers],
        ["Owners", numberOfOwners],
    ]);

    var options = {
        title: 'Total number of users',
        backgroundColor: {
            fill: 'darkslategrey'
        },
    };

    var chart = new google.visualization.BarChart(document.getElementById('chartUsers'));
    chart.draw(data, options);
}

function drawChartEarnings() {
    console.log("Earnings" + totalEarnings);

    var data = new google.visualization.DataTable();
    data.addColumn('string', "Earnings");
    data.addColumn('number', "Total earnings");
    data.addRows([
        ["App", (15/100) * totalEarnings],
        ["Keeper", (85/100) * totalEarnings],
    ]);

    var options = {
        title: 'Total income',
        backgroundColor: {
            fill: 'darkslategrey'
        },
    };

    var chart = new google.visualization.PieChart(document.getElementById('chartEarnings'));
    chart.draw(data, options);
}

async function initialize() {
    await new Promise(r => setTimeout(r, 500));
    drawChartPets();
    drawChartUsers();
    drawChartEarnings();
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
            $("#messageDiv").html("<h4>User deleted</h4>");
        } else if (xhr.status !== 200) {
            $("#messageDiv").html("<h3>Error deleting user</h3>");
            return;
        }
    };

    xhr.open('DELETE', 'Admin');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(user));
}