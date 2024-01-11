function handle_add_pet() {
    let form = document.getElementById('add-pet-form');
    let formData = new FormData(form);
    var jsonData = {};
    
    formData.forEach(function(value, key){
        jsonData[key] = value;
    });
 
    jsonData['birthyear'] = parseInt(jsonData['birthyear']);
    jsonData['pet_id'] = parseInt(jsonData['pet_id']);
    jsonData['owner_id'] = parseInt(jsonData['owner_id']);
    jsonData['weight'] = parseFloat(jsonData['weight']);
 
    console.log(jsonData);
    
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            $("#ajaxContent").html("<h4>Added pet to database successfully!</h4>");
            console.log(xhr.responseText);
            return false;
        } else if (xhr.status !== 200) {
            $("#ajaxContent").html("<h3>Error registering pet!</h3>");
            return false;
        };
    }
    
    
    xhr.open("POST", "http://localhost:4567/pet");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(jsonData));
    return false;
}

function handle_get_pets() {
    let type = document.getElementById('get-pets-type').value;
    let breed = document.getElementById('get-pets-breed').value;
    
    let fromWeight = document.getElementById('from-weight').value;
    let toWeight = document.getElementById('to-weight').value;
    
    let checkFromWeight = document.getElementById('check-from-weight').checked;
    let checkToWeight = document.getElementById('check-to-weight').checked;
    
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let object = JSON.parse(xhr.responseText);
            console.log(xhr.responseText);
            
            $("#ajaxContent-get").empty();
            
            for(let i = 0; i < object.length; i++) {
                $("#ajaxContent-get").append(createTableFromJSON(object[i], i + 1, type));
            }
            
            return false;
        } else if (xhr.status !== 200) {
            $("#ajaxContent-get").html("<h3>No pets found!</h3>");
            return false;
        };
    }
    
    if(checkFromWeight == true && checkToWeight == true) {
        if(checkToWeight > checkFromWeight) {
            $("#ajaxContent-get").html("<h3>Enter correct values!</h3>");
            return false;
        }
        xhr.open("GET", "http://localhost:4567/pets/" + type + "/" + breed + "?fromWeight=" + fromWeight + "&toWeight=" + toWeight);
    } else if(checkFromWeight == true) {
        xhr.open("GET", "http://localhost:4567/pets/" + type + "/" + breed + "?fromWeight=" + fromWeight);
    } else if(checkToWeight == true) {
        xhr.open("GET", "http://localhost:4567/pets/" + type + "/" + breed + "?toWeight=" + toWeight);
    } else {
        xhr.open("GET", "http://localhost:4567/pets/" + type + "/" + breed);
    }
    
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function createTableFromJSON(data, i, type) {
    var html = "<table><tr><th>" + type + " no" + i + "</th><th></th></tr>";
    for (const x in data) {
        var category=x;
        var value=data[x];
        html += "<tr><td>" + category + "</td><td>" + value + "</td></tr>";
    }
    html += "</table><br>";
    return html;

}

function handle_update_pet() {
    let pet_id = document.getElementById('update-pet-id').value;
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

function handle_delete_pet() {
    let pet_id = document.getElementById('delete-pet-id').value;
    
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let object = xhr.responseText;
            console.log(object);
            $("#ajaxContent-delete").html("<h4>Deleted pet from database successfully!</h4>");
            
            return false;
        } else if (xhr.status !== 200) {
            if(xhr.status === 404) {
                $("#ajaxContent-delete").html("<h3>Pet with this id not found!</h3>");
            } else {
                $("#ajaxContent-delete").html("<h3>Error deleting pet!</h3>");
            }
            return false;
        };
    }
    
    xhr.open("DELETE", "http://localhost:4567/petDeletion/" + pet_id);
    
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}