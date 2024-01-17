var error_label_placed = 0;
var forbiddenPassword_label_placed = 0;
var keeper_form_created = 0;
var map_showed = 0;
var lat, lon;
var addressDetails;
var submitted = 0;
var previous_city = null;


$(document).ready(function() {
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
})

function isSymbol(char) {
    return /[!@#$%^&*()_+{}|:"<>?~]/.test(char);
}

function isLowerCaseLetter(char) {
    return /[a-z]/.test(char);
}

function isCapitalLetter(char) {
    return /[A-Z]/.test(char);
}


function handle_submit() {
    var password = document.getElementById("password").value;
    var retype_password = document.getElementById("retype-password").value;
    var forbiddenPasswords = ["cat", "dog", "gata", "skylos"];
    var pet_keeper_checked = document.getElementById("pet-keeper").checked;

    $("#animal-radio-p").text("");

    if(pet_keeper_checked) {
        var cat_checked = document.getElementById("catkeeper").checked;
        var dog_checked = document.getElementById("dogkeeper").checked;
        if(!cat_checked && !dog_checked) {
            $("#animal-radio-p").text("At least one animal has to be checked!");
            return false;
        }
    }

    if(password != retype_password && password != "" && retype_password != "" && error_label_placed == 0) {
        var error_label = $("<label>").attr('for', 'password').text("Passwords are not the same!\n").css("color", "red");
        $("#retype-password").after(error_label);
        error_label_placed = 1;
        return false;
    }

    for(var pw of forbiddenPasswords) {
        if((password.includes(pw) || retype_password.includes(pw)) && forbiddenPassword_label_placed == 0) {
            var error_label = $("<label>").attr('for', 'password').text(pw + " substring is forbidden!\n").css("color", "red");
            $("#retype-password").after(error_label);
            forbiddenPassword_label_placed = 1;
            return false;
        }
    }
    
    
    return handle_database_register();
    
//    return true;
}

function check_radio_options() {
    var selected_value = $("input[name='pet-stay']:checked").val();
    if(selected_value == "pet-stay-outside") {
        $("#accomodate-cat").prop("checked", false);
        $("#accomodate-cat").prop("disabled", true);
        
        $("#catprice").prop("disabled", true);
        $("#catprice").val(0);
    } else {
        $("#accomodate-cat").prop("disabled", false);
        $("#catprice").prop("disabled", false);
    }
}

function handle_database_register() {
    let myForm = document.getElementById('form');
    let formData = new FormData(myForm);
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseData = JSON.stringify(xhr.responseText);
            $('#response-div').html("<h4>Successful Registration. Now please log in!</h4>");
            console.log(responseData);
            return false;
        } else if (xhr.status !== 200) {
            $('#response-div').html('<h3>Request failed. Returned status of ' + xhr.status + "<br></h3>");
            const responseData = xhr.responseText;
            console.log(responseData);
            return false;
        }
    };
    xhr.open('POST', 'Register');
    xhr.setRequestHeader("Content-type", "application/json");
    
    var jsonData = {};
    formData.forEach(function(value, key){
        jsonData[key] = value;
        
    });
    jsonData['lat'] = lat;
    jsonData['lon'] = lon;

    if(jsonData['type'] == "pet-keeper") {
        if(jsonData['catkeeper'] == "on") {
            jsonData['catkeeper'] = true;
        } else {
            jsonData['catkeeper'] = false;
            jsonData['catprice'] = 0;
        }
        
        if(jsonData['dogkeeper'] == "on") {
            jsonData['dogkeeper'] = true;
        } else {
            jsonData['dogkeeper'] = false;
            jsonData['dogprice'] = 0;
        }
    }
    
    if(jsonData['propertydescription'] == null) {
        jsonData['propertydescription'] = "";
    }
    
    console.log(JSON.stringify(jsonData));
    xhr.send(JSON.stringify(jsonData));
    return false;
}


function restTest2() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const obj = xhr.responseText;
            console.log(obj);
        } else if (xhr.status !== 200) {
            console.log("Error");
        };
    }
    xhr.open("GET", "http://localhost:4567/pets/asdfasd/asdfasdf");
//    xhr.setRequestHeader("Accept", "application/json");
//    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

$(document).ready(function() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var users = JSON.parse(xhr.responseText);
            console.log(users);
            $("#keepers").html(createTableFromJSONKeepers(users));
        } else if (xhr.status !== 200) {
            return;
        }
    };
    xhr.open('GET', 'Admin');
    xhr.setRequestHeader("Type", "GuestPage");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
})

function createTableFromJSONKeepers(data) {
    var html = "<table id='myTable'><tr><th>Username</th><th>Email</th></tr>";
    for(var i = 0; i < data.length; i++) {
        html += "<tr><td>" + data[i]["username"] + "</td><td>" + data[i]["email"] + "</td>";
    }
    html += "</table>";
    return html;
}