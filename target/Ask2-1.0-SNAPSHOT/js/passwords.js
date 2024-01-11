function show_passwords() {
    var password = document.getElementById("password");
    var retype_password = document.getElementById("retype-password");

    if(password.type === "password") {
        password.type = "text";
        retype_password.type = "text";
    } else {
        password.type = "password";
        retype_password.type = "password";
    }
}

function isSymbol(char) {
    return /[!@#$%^&*()_+{}|:"<>?~]/.test(char);
}

function isLowerCaseLetter(char) {
    return /[a-z]/.test(char);
}

function isCapitalLetter(char) {
    return /[A-Z]/.test(char);
}

function show_password_login() {
    var password = document.getElementById("password");

    if(password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
}

function check_password_strength() {
    var password = document.getElementById("password").value;
    var options = [["Weak strength", "red"], ["Medium strength", "orange"], ["Strong strength", "green"], ["", ""]];

    const labelExists = $("#strength_label").length;

    const strength = get_password_strength(password);

    if(strength == 0) {
        $("#submit-button").prop("disabled", true);
    } else {
        $("#submit-button").prop("disabled", false);
    }

    if(labelExists == 0) {
        var strength_label = $("<label>").text(options[strength][0]).css("color", options[strength][1]).attr("id", "strength_label");
        $("#password-div").prepend(strength_label);
    } else {
        $("#strength_label").text(options[strength][0]);
        $("#strength_label").css("color", options[strength][1]);
    }
}

function get_password_strength(password) {
    var noNumbers = 0;
    var symbol = 0;
    var capital = 0;
    var small = 0;
    var char;

    for(var i = 0; i < password.length; i++){
        char = password.charAt(i);
        if(!isNaN(char)) {
            noNumbers++;
        } else if(isSymbol(char)) {
            symbol = 1;
        } else if(isCapitalLetter(char)) {
            capital = 1;
        } else if(isLowerCaseLetter(char)) {
            small = 1;
        }
    }

    if(password.length == 0) {
        return 3;
    } else if(noNumbers > password.length / 2 || password.length < 8) {
        return 0;
    } else if(noNumbers > 0 && symbol == 1 && capital == 1 && small == 1) {
        return 2;
    } else {
        return 1;
    }
}