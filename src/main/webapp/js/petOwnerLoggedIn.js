function findUserData(){
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseData = JSON.parse(xhr.responseText);
            console.log(responseData);
            $('#ajaxContent').html("<h1>Your Data</h1>");
            $('#ajaxContent').append(createTableFromJSON(responseData));
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.open('GET', 'Register');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("User", "PetOwner");
    xhr.send();
}

var owner_id;

function createTableFromJSON(data) {
    var html = "<table id='newTable'>";
    for (const category in data) {
        var value = data[category];
        if(category == "owner_id"){
            owner_id = value;
        }
        if (category == "username" || category == "email" || category == "owner_id") {
            html += "<tr><td>" + category + "</td><td>" + value + "</td></tr>";
        } else {
            html += "<tr><td class='label-row'>" + category + "</td><td><input type='text' value='" + value + "' data-category='" + category + "'></td></tr>";
        }
    }
    html += "</table>";
    return html;
}

function getDataFromTable() {
    var table = document.getElementById('newTable');
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseData = xhr.responseText;
            $('#newAjaxContent').html("Request Completed");
            console.log(responseData);
        } else if (xhr.status !== 200) {
            $('#newAjaxContent').html('Request failed. Returned status of ' + xhr.status + "<br>");
           const responseData = xhr.responseText;
        }
    };
    var jsonData = {};
    var rows = table.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName('td');
        var label = cells[0].textContent.trim();
        var cellValue = cells[1];
        if (cellValue.querySelector('input')) {
            jsonData[label] = cellValue.querySelector('input').value;
        } else {
            jsonData[label] = cellValue.textContent.trim();
        }
    }
    console.log(jsonData);
    var pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=!])/;
    if (!pattern.test(jsonData['password']) || jsonData['password'].length < 8 || jsonData['password'].length > 15) {
        console.log('Invalid password:', jsonData['password']);
        $("#newAjaxContent").html('Invalid password pattern.');
        return false;
    }
    const forbiddenwords = ["cat", "dog", "gata", "skulos"];
    for(const sequence of forbiddenwords){
        if(jsonData['password'].includes(sequence)){
            $("#newAjaxContent").html('Invalid password pattern.');
            return false;
        }
    }
    const numcounter = (jsonData['password'].match(/[0-9]/g) || []).length;
    if((numcounter / jsonData['password'].length) >= (50/100)){
        $("#newAjaxContent").html('Invalid password pattern.');
        return false;
    }
    pattern = /[a-zA-Z]+/;
    if(!pattern.test(jsonData['firstname']) || jsonData['firstname'].length < 3 || jsonData['firstname'].length > 30){
        $("#newAjaxContent").html('Invalid firstname pattern.');
        return false;
    }
    if(!pattern.test(jsonData['lastname']) || jsonData['lastname'].length < 3 || jsonData['lastname'].length > 30){
        $("#newAjaxContent").html('Invalid lastname pattern.');
        return false;
    }
    pattern = /^\d{4}-\d{2}-\d{2}$/;
    if(!pattern.test(jsonData['birthdate'])){
        $("#newAjaxContent").html('Invalid birthdate pattern.');
        return false;
    }
    const genders = ["Male", "Female", "Other"];
    if (!genders.includes(jsonData['gender'])) {
        $("#newAjaxContent").html('Invalid gender pattern.');
        return false;
    }
    pattern = /[a-zA-Z]+/;
    if(jsonData['country'] !== "Greece"){
        $("#newAjaxContent").html('We exclusively offer our services in Greece.');
        return false;
    }
    if(jsonData['job'].length > 0){
        if(!pattern.test(jsonData['job']) || jsonData['job'].length < 3 || jsonData['job'].length > 30){
            $("#newAjaxContent").html('Invalid job pattern.');
            return false;
        }
    }
    if(jsonData['city'].length < 3 || jsonData['city'].length > 30){
        $("#newAjaxContent").html('Invalid city pattern.');
        return false;
    }
    if(jsonData['address'].length < 10 || jsonData['address'].length > 150){
        $("#newAjaxContent").html('Invalid address pattern.');
        return false;
    }
    pattern = /^\d{10,14}$/;
    if(jsonData['telephone'].length > 0){
        if(!pattern.test(jsonData['telephone'])){
            $("#newAjaxContent").html('Invalid telephone pattern.');
            return false;
        }
    }
    pattern = /^https:\/\/.*/;
    if(jsonData['personalpage'].length > 0){
        if(!pattern.test(jsonData['personalpage'])){
            $("#newAjaxContent").html('Invalid personalpage pattern.');
            return false;
        }
    }
    xhr.open('PUT', 'Register');
    xhr.setRequestHeader("User", "PetOwner");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(jsonData));
}

function logout(){
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            window.location.href = 'index.html';
            $("#ajaxContent").html("Successful Logout");
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.open('POST', 'Logout');
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

document.addEventListener("DOMContentLoaded", function() {
    findUserData();
});

function handlePost() {
    let myForm = document.getElementById('petsForm');
    let formData = new FormData(myForm);
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseData = xhr.responseText;
            $('#ajaxContent2').html("Successful Post");
            console.log(responseData);
        } else if (xhr.status !== 200) {
            $('#ajaxContent2').html('Request failed. Returned status of ' + xhr.status + "<br>");
           const responseData = xhr.responseText;
        }
    };
    const data = {};
    formData.forEach((value, key) => (data[key] = value));
    console.log(JSON.stringify(data));
    data['pet_id'] = Number(data['pet_id']);
    xhr.open('POST', 'http://localhost:4567/pet');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));
    return false;
}

function checkPet(){
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
            showAvailableKeepers(xhr.responseText);
        } else if (xhr.status !== 200) {
            $("#ajaxContent3").html("You don't have a pet");
            return;
        }
    };
    console.log("Called Pet");
    xhr.open('GET', 'Pet');
    xhr.setRequestHeader("owner_id", owner_id);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function showAvailableKeepers(type){
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var users = JSON.parse(xhr.responseText);
            console.log(users);
            $("#ajaxContent3").html(createTableFromJSONKeepers(users));
        } else if (xhr.status !== 200) {
            return;
        }
    };
    xhr.open('GET', 'LoggedIn');
    xhr.setRequestHeader("Type", type);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function createTableFromJSONKeepers(data) {
    var html = "<table id='myTable'><tr><th>Username</th><th>Email</th></tr>";
    for(var i = 0; i < data.length; i++) {
        html += "<tr><td>" + data[i]["username"] + "</td><td>" + data[i]["email"] + "</td>";
    }
    html += "</table>";
    return html;
}