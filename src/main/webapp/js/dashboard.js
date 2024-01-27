var keeperId;
var keeperBookings;
var petInfo = [];
var bookingId;

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
    await new Promise(r => setTimeout(r, 2000));
    loadStatistics();
    if(keeperBookings.length != 0) {
        showRequests();
    }
}

function loadStatistics() {
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            console.log(response);
            $("#ajaxNumberOfKeepings").append("<h2>Number of total bookings: " + response["numberOfBookings"] + "</h2>");
            $("#ajaxNumberOfKeepings").append("<h2>Number of total days booked: " + response["numberOfDays"] + "</h2>");
            appendReviews(response["reviews"]);
        } else if (xhr.status !== 200) {
            $("#ajaxMessagesDiv").html("<h3>Error accepting request!</h3>");
        }
    };

    xhr.open('GET', 'BookingServlet');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Keeper-Id", keeperId);
    xhr.setRequestHeader("Request-Type", "Get-Statistics");
    xhr.send();
}

function appendReviews(reviews) {
    var html = "<h2>Your Reviews</h2>"
    html += "<table id='myTable'><tr><th>ReviewScore</th><th>ReviewText</th></tr>";
    var reviewScore;
    var reviewText;
    for(let i = 0; i < reviews.length; i++) {
        reviewScore = reviews[i]["reviewScore"];
        reviewText = reviews[i]["reviewText"];
        console.log(reviewScore, reviewText);

        html += "<tr><td>" + reviewScore + "</td><td>" + reviewText + "</td></tr>";
    }
    html += "</table>";
    $("#ajaxNumberOfKeepings").append(html);
}

function handleChatGPT(number) {
    var question;
    if(number == 1) {
        var input = document.getElementById("chatGPT1").value;
        question = "How to take care of a " + input;
    } else if(number ==  2) {
        var input = document.getElementById("chatGPT2").value;
        question = "Show me information about " + input;
    } else {
        var input = document.getElementById("chatGPT3").value;
        question = input;   
    }

    var key = "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";
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const apiKey = key;
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [{
                "role": "system",
                "content": "You are ChatGPT, a helpful assistant."
            }, {
                "role": "user",
                "content": question
            }]
        })
    }).then(response => {
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        console.log(data.choices[0].message.content);
        $("#ajaxchatGPTResponse").html("<p>" + data.choices[0].message.content + "</p>")
    }).catch(error => {
        console.error('Error:', error);
    });

    console.log(question);
}

function loadCurrentKeeping() {
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if(response['keeper_id'] != 0) {
                $('#ajaxMessagesDiv').html(response);
                showCurrentKeeping(response);
                console.log("Keeping: " + xhr.responseText);
                bookingId = response['booking_id'];
                loadMessages(bookingId);
            }
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

function loadMessages(bookingId) {
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = xhr.responseText;
            displayMessages(JSON.parse(response));
            console.log(response);
        } else if (xhr.status !== 200) {
            $("#ajaxMessagesDiv").html("<h3>Error accepting request!</h3>");
        }
    };

    xhr.open('GET', 'MessageServlet');
    xhr.setRequestHeader("BookingId", bookingId);
    xhr.send();
}

function sendNewMessage() {
    var xhr = new XMLHttpRequest();
    var message = document.getElementById('textareaMessage').value;

    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            $("#ajaxMessagesDiv").html("<h4>Message Sent</h4>");
        } else if (xhr.status !== 200) {
            $("#ajaxMessagesDiv").html("<h3>Error accepting request!</h3>");
        }
    };

    var currentTime = getCurrentDateTime();
    var body = {
        "booking_id": bookingId,
        "sender": "keeper",
        "datetime": currentTime,
        "message": message
    }

    console.log(body);
    xhr.open('POST', 'MessageServlet');
    xhr.send(JSON.stringify(body));
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

function displayMessages(messages) {
    const container = document.getElementById('keepingMessagesDiv');
    const messagesDiv = document.getElementById('messages');
    messagesDiv.style.display = 'block';

    messages.forEach(message => {
        const div = document.createElement('div');
        div.className = 'message-container';

        const senderClass = message.sender === 'owner' ? 'sender-owner' : 'sender-keeper';
        div.innerHTML = `<p class="${senderClass}">${message.sender}: ${message.message}</p>
                         <p>${message.datetime}</p>`;

        container.appendChild(div);
    });
}

function showMessages(messages) {
    
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
    xhr.setRequestHeader('User', 'PetKeeper');
    xhr.send(JSON.stringify(jsonData));
}