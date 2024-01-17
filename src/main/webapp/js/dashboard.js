var keeperId;
var keeperBookings;
var petInfo = [];

$(document).ready(loadData());


async function loadData() {
    loadKeeperData();
    await new Promise(r => setTimeout(r, 2000));
    loadKeeperRequests();
    await new Promise(r => setTimeout(r, 2000));
    for(var i = 0; i < keeperBookings.length; i++) {
        loadPetInfo(i); // With keeperBookings;
    }
    await new Promise(r => setTimeout(r, 2000));
    var html = "<table id='myTable2'><tr><th>From</th><th>To</th><th>Cost</th><th>Name</th><th>Breed</th><th>Type</th></tr>";
    for(var i = 0; i < keeperBookings.length; i++) {
        console.log(petInfo[i]);
        html += "<tr><td>" + keeperBookings[i]["fromdate"] + "</td><td>" + keeperBookings[i]["todate"] + "</td><td>" + keeperBookings[i]["price"] + "</td><td>" 
                + petInfo[i]["name"] + "</td><td>" + petInfo[i]["breed"] + "</td><td>" + petInfo[i]["type"] + "</td></tr>";
    }
    html += "</table>";

    $("#ajaxContent").append(html);
}

function loadPetInfo(i) {
        var xhr = new XMLHttpRequest();
        
        xhr.onload = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const responseData = JSON.parse(xhr.responseText);
                petInfo.push(responseData);
//                $('#ajaxContent').append(createTableFromJSONKeeperData(responseData));
                console.log(responseData);
            } else if (xhr.status !== 200) {
                alert('Request failed. Returned status of ' + xhr.status);
            }
        };

        xhr.open('GET', 'PetServlet');
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Pet-Id", keeperBookings[i]["pet_id"]);
        xhr.send();
}

function loadKeeperData() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseData = JSON.parse(xhr.responseText);
            keeperId = responseData['keeper_id'];
            $('#ajaxContent').append(createTableFromJSONKeeperData(responseData));
            console.log(responseData);
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };

    xhr.open('GET', 'Register');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("User", "-");
    xhr.send();
}

function loadKeeperRequests() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseData = JSON.parse(xhr.responseText);
            keeperBookings = responseData;
//            $('#ajaxContent').append(createTableFromJSONKeeperRequests(responseData));
            console.log(responseData);
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    
    console.log(keeperId);
    
    xhr.open('GET', 'Keeper');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("User", "-");
    xhr.setRequestHeader("Request-Type", "Keeper-Requests");
    xhr.setRequestHeader("Keeper-Id", keeperId);
    xhr.send();
}

function createTableFromJSONKeeperData(data) {
    var html = "<table id='myTable'><tr><th>Category</th><th>Value</th></tr>";
    for (const x in data) {
        var category = x;
        var value = data[x];
        if(category != "username" && category != "email" && category != "keeper_id") {
            html += "<tr><td class='label-row'>" + category + "</td><td><input class='table-inputs' value='" + value + "'</input></td></tr>";
        } else {
            html += "<tr><td>" + category + "</td><td>" + value + "</td></tr>";
        }
    }
    html += "</table>";
    return html;
}

function createTableFromJSONKeeperRequests(data) {
    var html = "<table id='myTable'><tr><th>From</th><th>To</th><th>Cost</th></tr>";
    for(var i = 0; i < data.length; i++) {
        html += "<tr><td>" + data[i]["fromdate"] + "</td><td>" + data[i]["todate"] + "</td><td>" + data[i]["price"] + "</td></tr>";
    }
    html += "</table>";
    return html;
}

function handle_logout() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            window.location.href = 'index.html';
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.open('POST', 'Logout');
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function edit_database() {
    var table = document.getElementById('myTable');
    var jsonData = {};
    var rows = table.getElementsByTagName('tr');
    var label, input, username;

    username = rows[2].childNodes[1].textContent;

    for (var i = 1; i < rows.length; i++) {
        var inputs = rows[i].getElementsByTagName('input');
        var labels = rows[i].getElementsByClassName('label-row');
        for (var j = 0; j < inputs.length; j++) {
            label = labels[j].textContent;
            input = inputs[j].value;
            
            jsonData[label] = input;
        }
    }
    
    jsonData['username'] = username;
    
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            $("#ajaxMessagesDiv").html("<h4>The changes were saved in the database</h4>");
        } else if (xhr.status !== 200) {
            $("#ajaxMessagesDiv").html("<h3>The changes were not saved in the database</h3>");
        }
    };
    xhr.open('PUT', 'Register');
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send(JSON.stringify(jsonData));
}