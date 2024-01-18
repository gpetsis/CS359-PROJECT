var keeperId;
var keeperBookings;
var petInfo = [];

$(document).ready(loadData());


async function loadData() {
    await loadKeeperData();
    await new Promise(r => setTimeout(r, 2000));
    await loadKeeperRequests();
    await new Promise(r => setTimeout(r, 2000));
    for(var i = 0; i < keeperBookings.length; i++) {
        await loadPetInfo(i); // With keeperBookings;
    }
    await new Promise(r => setTimeout(r, 2000));
    loadCurrentKeeping();
    showRequests();
}

function loadCurrentKeeping() {
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            $('#ajaxMessagesDiv').html(response);
            if(response['keeper_id'] != 0) {
                showCurrentKeeping(response);
            }
            
            console.log("Loaded currentKeeping");
        } else if (xhr.status !== 200) {
            $("#ajaxMessagesDiv").html("<h3>Error accepting request!</h3>");
        }
    };

    xhr.open('GET', 'BookingServlet');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Keeper-Id", keeperId);
    xhr.setRequestHeader("Request-Type", "Get-Keeping");
    xhr.send();
}

function showCurrentKeeping(keeping) {
    console.log(keeping);
    var html = "<h1>Your Current Keeping</h1>"
    html += "<table id='myTable3'><tr><th>From</th><th>To</th><th>Cost</th></tr>";
    html += "<tr><td>" + keeping["fromdate"] + "</td><td>" + keeping["todate"] + "</td><td>" + keeping["price"] + "</td></tr>";
    html += "</table>";

    $("#ajaxContentCurrentKeeping").append(html);
}

function showRequests() {
    var html = "<h1>Your Keeping Requests</h4>"
    html += "<table id='myTable2'><tr><th>From</th><th>To</th><th>Cost</th><th>Name</th><th>Breed</th><th>Type</th><th>Accept</th><th>Decline</th></tr>";
    for(var i = 0; i < keeperBookings.length; i++) {
        console.log(petInfo[i]);
        html += "<tr><td>" + keeperBookings[i]["fromdate"] + "</td><td>" + keeperBookings[i]["todate"] + "</td><td>" + keeperBookings[i]["price"] + "</td><td>" 
                + petInfo[i]["name"] + "</td><td>" + petInfo[i]["breed"] + "</td><td>" + petInfo[i]["type"] + "</td><td><input onclick='acceptRequest(" + keeperBookings[i]["booking_id"] + ")' type='button' value='✓'</td>\n\
                <td><input onclick='declineRequest(" + keeperBookings[i]["booking_id"] + ")' type='button' value='✖'</td></tr>";
    }
    html += "</table>";

    $("#ajaxContentRequests").append(html);
}

function acceptRequest(bookingId) {
    console.log("Booking Id" + bookingId);
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            $('#ajaxMessagesDiv').html("<h4>Accepted request succesfully</h4>");
        } else if (xhr.status !== 200) {
            $("#ajaxMessagesDiv").html("<h3>Error accepting request!</h3>");
        }
    };

    xhr.open('PUT', 'BookingServlet');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Booking-Id", bookingId);
    xhr.setRequestHeader("Request-Type", "Accept-Request");
    xhr.send();
}

function declineRequest(bookingId) {
    console.log("Booking Id" + bookingId);
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            $('#ajaxMessagesDiv').html("<h4>Declined request succesfully</h4>");
        } else if (xhr.status !== 200) {
            $("#ajaxMessagesDiv").html("<h3>Error declining request!</h3>");
        }
    };

    xhr.open('PUT', 'BookingServlet');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Booking-Id", bookingId);
    xhr.setRequestHeader("Request-Type", "Decline-Request");
    xhr.send();
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