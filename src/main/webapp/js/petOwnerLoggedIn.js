var requested = false;

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
var lat;
var lon;

function createTableFromJSON(data) {
    var html = "<table id='myTable'>";
    for (const category in data) {
        var value = data[category];
        if(category == "owner_id"){
            owner_id = value;
        }
        else if(category == "lat"){
            lat = value;
        }
        else if(category == "lon"){
            lon = value;
        }
        if (category == "username" || category == "email" || category == "owner_id") {
            html += "<tr><td>" + category + "</td><td>" + value + "</td></tr>";
        } else {
            html += "<tr><td class='label-row'>" + category + "</td><td><input class='table-inputs' type='text' value='" + value + "' data-category='" + category + "'></td></tr>";
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

var petType;

function checkPet(){
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            petType = xhr.responseText;
            console.log(xhr.responseText);
            var dates = document.getElementById('dates');
            dates.style.display = 'block';
            showAvailableKeepers(xhr.responseText);
        } else if (xhr.status !== 200) {
            $("#ajaxContent3").html("You don't have a pet");
            return;
        }
    };
    xhr.open('GET', 'Pet');
    xhr.setRequestHeader("owner_id", owner_id);
    xhr.setRequestHeader("Return", "Type");
    xhr.setRequestHeader("Pet-Id", "-");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

var keepers;

function showAvailableKeepers(type){
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            keepers = JSON.parse(xhr.responseText);
            console.log(keepers);
            $("#ajaxContent3").html(createTableFromJSONKeepers(keepers));
        } else if (xhr.status !== 200) {
            return;
        }
    };
    xhr.open('GET', 'LoggedIn');
    xhr.setRequestHeader("Type", type);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

var pet_id;

function get_pet_id(){
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            pet_id = xhr.responseText;
        } else if (xhr.status !== 200) {
            return;
        }
    };
    xhr.open('GET', 'PetServlet');
    xhr.setRequestHeader("owner_id", owner_id);
    xhr.setRequestHeader("Return", "pet_id");
    xhr.setRequestHeader("Pet-Id", "-");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function createTableFromJSONKeepers(data) {
    var html = "<table id='myTable'><tr><th>Username</th><th>Email</th><th>Cost (per Day)</th><th>Total Cost</th><th>Book</th></tr>";
    for(var i = 0; i < data.length; i++) {
        if(petType == "dog"){
            html += "<tr><td>" + data[i]["username"] + "</td><td>" + data[i]["email"] + "</td>\n\
            <td><p class='cost_per_day'>" + data[i]["dogprice"] + "</p></td><td><p class='cost'>" + data[i]["dogprice"] + "</p></td><td><input type='button' \n\
            onclick='ownerRequest(" + data[i]["keeper_id"] + "," + data[i]["dogprice"] + ")' value='book'></td></tr>";
        }
        else{
            html += "<tr><td>" + data[i]["username"] + "</td><td>" + data[i]["email"] + "</td>\n\
            <td><p class='cost_per_day'>" + data[i]["catprice"] + "</p></td><td><p class='cost'>" + data[i]["catprice"] + "</p></td><td><input type='button' \n\
            onclick='ownerRequest(" + data[i]["keeper_id"] + "," + data[i]["catprice"] + ")' value='book'></td></tr>";
        }
    }
    html += "</table>";
    return html;
}

async function book(keeper_id, price){
    await new Promise(r => setTimeout(r, 1000));
    var fromDateValue = document.getElementById('fromDate').value;
    var toDateValue = document.getElementById('toDate').value;
    var fromDate = new Date(fromDateValue);
    var toDate = new Date(toDateValue);
    var timeDifference = toDate.getTime() - fromDate.getTime();
    var dayDifference = timeDifference / (1000 * 60 * 60 * 24);
    dayDifference++;
    var cost = dayDifference * price;
    var jsonData = {};
    jsonData['owner_id'] = owner_id;
    jsonData['pet_id'] = pet_id;
    jsonData['keeper_id'] = keeper_id;
    jsonData['fromdate'] = fromDateValue;
    jsonData['todate'] = toDateValue;
    jsonData['status'] = "requested";
    jsonData['price'] = cost;
    for (let key in jsonData) {
        if (jsonData.hasOwnProperty(key)) {
            console.log(key + ": " + jsonData[key]);
        }
    }
    console.log(JSON.stringify(jsonData));
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            $("#ajaxContent4").html("Booking request completed.");
        } else if (xhr.status !== 200) {
            $("#ajaxContent4").html("Booking request failed.");
            return;
        }
    };
    xhr.open('POST', 'BookingServlet');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(jsonData));
}

function ownerRequest(keeper_id, price){
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            book(keeper_id, price);
        } else if (xhr.status === 702 || xhr.status === 703){
            $("#ajaxContent4").html("You have already made a booking request.");
        } else if (xhr.status !== 200) {
            return;
        }
    };
    xhr.open('GET', 'BookingServlet');
    xhr.setRequestHeader("Request-Type", owner_id);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function updateCost(){
    var fromDateValue = document.getElementById('fromDate').value;
    var toDateValue = document.getElementById('toDate').value;
    var fromDate = new Date(fromDateValue);
    var toDate = new Date(toDateValue);
    var timeDifference = toDate.getTime() - fromDate.getTime();
    var dayDifference = timeDifference / (1000 * 60 * 60 * 24);
    dayDifference++;
    console.log("Day Difference: " + dayDifference);
    var costs_per_day = document.getElementsByClassName("cost_per_day");
    var costs = document.getElementsByClassName("cost");
    for(let i = 0 ; i < costs.length ; i++){
        costs[i].innerHTML = costs_per_day[i].textContent * dayDifference;
    }
}

function createTableFromJSONBooking(data) {
    var html = "<table id='myTable'><tr><th>From Date</th><th>To Date</th><th>Price</th></tr>";
    html += "<tr><td>" + data["fromdate"] + "</td><td>" + data["todate"] + "</td><td>" + data["price"] + "</td></tr>";
    html += "</table>";
    return html;
}

var activeBookingExists = false;

var booking_id;

function activeBooking(){
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("No Accepted Request");
        } else if (xhr.status === 703){
            extractBookingId(JSON.parse(xhr.responseText));
            console.log(booking_id);
            var labelFinished = document.getElementById('labelFinished');
            var finished = document.getElementById('finishedButton');
            var messages = document.getElementById('messages');
            labelFinished.style.display = 'block';
            finished.style.display = 'block';
            messages.style.display = 'block';
            activeBookingExists = true;
            $("#ajaxContent6").html(createTableFromJSONBooking(JSON.parse(xhr.responseText)));
        } else if (xhr.status !== 200) {
            console.log("No Accepted Request");
            return;
        }
    };
    xhr.open('GET', 'BookingServlet');
    xhr.setRequestHeader("Request-Type", owner_id);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function extractBookingId(booking) {
    booking_id = booking.booking_id;
}

function getFinishedBooking(){
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("No Finished Booking");
        } else if (xhr.status === 703){
            console.log(xhr.responseText);
            const jsonResponse = JSON.parse(xhr.responseText);
            var finishedBookings = document.getElementById('finishedBookings');
            finishedBookings.style.display = 'block';
            const keeperIds = jsonResponse.map(entry => entry.keeper_id);
            getKeepersInfo(keeperIds);
//            $("#ajaxContent6").html(createTableFromJSONBooking(JSON.parse(xhr.responseText)));
        } else if (xhr.status !== 200) {
            console.log("No Finished Booking");
            return;
        }
    };
    xhr.open('GET', 'BookingServlet');
    xhr.setRequestHeader("Request-Type", "FinishedBookings");
    console.log(owner_id);
    xhr.setRequestHeader("owner_id", owner_id);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function getKeepersInfo(keeperIds){
    var xhr = new XMLHttpRequest();
    const data = {};
    for(let i = 0 ; i < keeperIds.length ; i++){
        data[i] = keeperIds[i];
    }
    console.log(JSON.stringify(data));
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
            $("#ajaxContent7").html(createTableFromJSONFinishedBooking(JSON.parse(xhr.responseText)));
        } else if (xhr.status !== 200) {
            console.log("Request Failed");
            return;
        }
    };
    xhr.open('GET', 'BookingServlet');
    xhr.setRequestHeader("Request-Type", "KeeperInfo");
    xhr.setRequestHeader("KeeperIds", JSON.stringify(data));
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function createTableFromJSONFinishedBooking(data) {
    var html = "<table id='myTable'><tr><th>Username</th><th>Email</th><th>Review</th></tr>";
    for(var i = 0; i < data.length; i++) {
        html += "<tr><td>" + data[i]["username"] + "</td><td>" + data[i]["email"] + "</td><td><input type='button' \n\
        onclick='review(" + data[i]["keeper_id"] + ")' value='review'></td> </tr>";
    }
    html += "</table>";
    return html;
}

function review(keeper_id){
    const reviewValue = document.getElementById("review").value;
    const ratingValue = getSelectedRating();
    var jsonData = {};
    jsonData['keeper_id'] = keeper_id;
    jsonData['owner_id'] = owner_id;
    jsonData['reviewText'] = reviewValue;
    jsonData['reviewScore'] = ratingValue;
    for (let key in jsonData) {
        if (jsonData.hasOwnProperty(key)) {
            console.log(key + ": " + jsonData[key]);
        }
    }
    console.log(JSON.stringify(jsonData));
    if(reviewValue == "" || ratingValue == 0){
        $("#ajaxContent8").html("Please provide both a review and a rating before submitting.");
    }
    else{
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                $("#ajaxContent8").html("Review request completed.");
            } else if (xhr.status !== 200) {
                $("#ajaxContent8").html("Review request failed.");
                return;
            }
        };
        xhr.open('POST', 'ReviewServlet');
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(jsonData));
    }
}

function getSelectedRating() {
    const stars = document.querySelectorAll('.stars .star');
    let rating = 0;
    stars.forEach((star, index) => {
        if (star.classList.contains('selected')) {
            rating = index + 1;
        }
    });
    return rating;
}

async function doRequests(){
    findUserData();
    await new Promise(r => setTimeout(r, 1000));
    get_pet_id();
    activeBooking();
    await new Promise(r => setTimeout(r, 1000));
    getFinishedBooking();
    await new Promise(r => setTimeout(r, 1000));
    if(activeBookingExists){
        getMessages();
    }
}

$(document).ready(doRequests())

function finished(){
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            $("#ajaxContent5").html("Your booking is finished.");
        } else if (xhr.status !== 200) {
            $("#ajaxContent5").html("Something went wrong.");
            return;
        }
    };
    xhr.open('PUT', 'BookingServlet');
    xhr.setRequestHeader("owner_id", owner_id);
    xhr.setRequestHeader("Request-Type", "Finished-Request");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function rateKeeper(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => star.classList.remove('selected'));
    for (let i = 0; i < rating; i++) {
        stars[i].classList.add('selected');
    }
    console.log('Rated:', rating);
}

function getMessages(){
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            displayMessages(JSON.parse(xhr.responseText));
        } else if (xhr.status !== 200) {
            $("#messageContainer").html("Failed");
            return;
        }
    };
    xhr.open('GET', 'MessageServlet');
    xhr.setRequestHeader("BookingId", booking_id);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function displayMessages(messages) {
    const container = document.getElementById('messageContainer');
    messages.forEach(message => {
        const div = document.createElement('div');
        div.className = 'message-container';

        const senderClass = message.sender === 'owner' ? 'sender-owner' : 'sender-keeper';
        div.innerHTML = `<p class="${senderClass}">${message.sender}: ${message.message}</p>
                         <p>${message.datetime}</p>`;
        container.appendChild(div);
    });
}

function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const currentDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return currentDateTime;
}

function sendMessage(){
    const message = document.getElementById("message").value;
    var jsonData = {};
    jsonData['booking_id'] = booking_id;
    jsonData['message'] = message;
    jsonData['sender'] = "owner";
    jsonData['datetime'] = getCurrentDateTime();
    for (let key in jsonData) {
        if (jsonData.hasOwnProperty(key)) {
            console.log(key + ": " + jsonData[key]);
        }
    }
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            $("#ajaxMessage").html("Message sent");
        } else if (xhr.status !== 200) {
            $("#ajaxMessage").html("Something went wrong.");
            return;
        }
    };
    xhr.open('POST', 'MessageServlet');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(jsonData));
}

function handle_update_pet() {
    let weight = document.getElementById('update-pet-weight').value;
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let object = xhr.responseText;
            console.log(object);
            $("#ajaxContent-update").html("<h4>Updated pet to database successfully!</h4>");
            
            return false;
        } else if (xhr.status !== 200) {
            if(xhr.status === 404) {
                $("#ajaxContent-update").html("<h3>Pet with this id not found!</h3>");
            } else {
                $("#ajaxContent-update").html("<h3>Error updating pet!</h3>");
            }
            return false;
        };
    }
    
    xhr.open("PUT", "http://localhost:4567/petWeight/" + pet_id + "/" + weight);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}


async function handleRadioButtonChange() {
    var selectedOption = document.querySelector('input[name="sortingOption"]:checked').value;
    switch (selectedOption) {
        case "distance":
            console.log("Sorting by Distance");
            if(requested == false){
                request();
                requested = true;
                await new Promise(r => setTimeout(r, 5000));
            }
            sortByDistance();
            break;
        case "duration":
            console.log("Sorting by Duration");
            if(requested == false){
                request(keepers);
                requested = true;
                await new Promise(r => setTimeout(r, 5000));
            }
            sortByDuration();
            break;
        case "price":
            console.log("Sorting by Price");
            sortByPrice();
            break;
        default:
            console.log("Invalid option");
            break;
    }
}

function sortByPrice() {
    if(petType == "dog"){
        keepers.sort((a, b) => a.dogprice - b.dogprice);
    }
    else{
        keepers.sort((a, b) => a.catprice - b.catprice);
    }
    $("#ajaxContent3").html(" ");
    $("#ajaxContent3").html(createTableFromJSONKeepers(keepers));
}

async function makeRequest(obj) {
    const data = null;
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            obj.newField = this.responseText;
            console.log(obj.newField);
        }
    });
    const destinationLat = obj.lat;
    const destinationLon = obj.lon;
    const url = `https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix?origins=${lat},${lon}&destinations=${destinationLat},${destinationLon}`;
    xhr.open("GET",url);
    xhr.setRequestHeader("x-rapidapi-host", "trueway-matrix.p.rapidapi.com");
    const key = "a6274b88e4mshee7fe03b54478e0p102465jsnd0d029e848d8";
    xhr.setRequestHeader("x-rapidapi-key", key);
    xhr.send(data);
    await new Promise(resolve => setTimeout(resolve, 1000));
}

async function request(){
    for (const obj of keepers) {
        await makeRequest(obj);
    }
}

function sortByDistance() {
    keepers.sort((a, b) => {
        const newFieldA = JSON.parse(a.newField);
        const newFieldB = JSON.parse(b.newField);
        const distancesA = newFieldA.distances[0][0];
        const distancesB = newFieldB.distances[0][0];
        return distancesA - distancesB; 
    });
    $("#ajaxContent3").html(" ");
    $("#ajaxContent3").html(createTableFromJSONKeepers(keepers));
    console.log("Sorted by Distance");
}

function sortByDuration() {
    keepers.sort((a, b) => {
        const newFieldA = JSON.parse(a.newField);
        const newFieldB = JSON.parse(b.newField);
        const durationsA = newFieldA.durations[0][0];
        const durationsB = newFieldB.durations[0][0];
        return durationsA - durationsB; 
    });
    $("#ajaxContent3").html(" ");
    $("#ajaxContent3").html(createTableFromJSONKeepers(keepers));
    console.log("Sorted by Time");
}
