const password = document.getElementById('password');

let passwordvisibility = false;
showpassword.addEventListener('click', function(){
    passwordvisibility = !passwordvisibility;
    if(passwordvisibility){
        password.type = 'text';
        showpassword.textContent = 'Hide Password';
    } 
    else{
        password.type = 'password';
        showpassword.textContent = 'Show Password';
    }
});

function handlePetOwnerLogin(){
    let myForm = document.getElementById('petOwnerLogin');
    let formData = new FormData(myForm);
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseData = xhr.responseText;
            $('#ajaxContent').html("Successful Login");
            window.location.href = 'petOwnerLoggedIn.html';
            console.log(responseData);
        } else if (xhr.status !== 200) {
            $('#ajaxContent').html("Request failed");
           const responseData = xhr.responseText;
        }
    };
    const data = {};
    formData.forEach((value, key) => (data[key] = value));
    console.log(JSON.stringify(data));
    xhr.open('POST', 'Login');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("User", "PetOwner");
    xhr.send(JSON.stringify(data));
    return false;
}