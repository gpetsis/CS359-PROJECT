$(document).ready(loadData());


function loadData() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseData = JSON.parse(xhr.responseText);
            $('#ajaxContent').append(createTableFromJSON(responseData));
            console.log(responseData);
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };

    xhr.open('GET', 'Register');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function createTableFromJSON(data) {
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