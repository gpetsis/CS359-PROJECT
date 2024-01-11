var keeper_form_created = 0;
var submitted = 0;
var map_showed = 0; 

function show_keeper_form() {
    $("#pet-keeper-extra-div").show();
    $("#pet-stay-inside").prop("required", true);
    $("#pet-stay-outside").prop("required", true);
    $("#pet-stay-both").prop("required", true);

    if(keeper_form_created == 1) {
        return;
    }

    keeper_form_created = 1;

    var paragraph = $("<p></p>");
    paragraph.text("Where will the pet be staying?");

    var pet_stay_inside = $("<input type='radio' name='property' value='Indoor' onchange='check_radio_options()' id='pet-stay-inside'>").prop("required", true);
    var pet_stay_inside_label = $("<label>").attr('for', 'pet-stay-inside').text("Inside");

    var pet_stay_outside = $("<input type='radio' name='property' value='Outdoor' onchange='check_radio_options()' id='pet-stay-outside'>").prop("required", true);
    var pet_stay_outside_label = $("<label>").attr('for', 'pet-stay-outside').text("Outside");

    var pet_stay_both = $("<input type='radio' name='property' value='Both' onchange='check_radio_options()' id='pet-stay-both'>").prop("required", true);
    var pet_stay_both_label = $("<label>").attr('for', 'pet-stay-both').text("Both");

    var accomodate_cat = $("<input type='checkbox' name='catkeeper' id='catkeeper' onchange='change_price_required()'>");
    var accomodate_cat_label = $("<label>").attr('for', 'catkeeper').text("Accomodate Cat");

    var accomodate_dog = $("<input type='checkbox' name='dogkeeper' id='dogkeeper' onchange='change_price_required()'>");
    var accomodate_dog_label = $("<label>").attr('for', 'dogkeeper').text("Accomodate Dog");
    
    var cat_price = $("<input type='number' id='catprice' name='catprice' min='0' max='15' step='1' value='8'>");
    var cat_price_label = $("<label>").attr('for', 'doginput').text("Price for cat: ");
    
    var dog_price = $("<input type='number' id='dogprice' name='dogprice' min='0' max='20' step='1' value='10'>");
    var dog_price_label = $("<label>").attr('for', 'doginput').text("Price for dog: ");
    
    var home_description = $("<textarea name='propertydescription'></textarea>").attr("id", "home-description");
    var home_description_label = $("<label>").attr('for', 'home-description').text("Home description: ");

    $("#pet-keeper-extra-div").prepend(paragraph);
    $("#inside-stay-div").append(pet_stay_inside_label);
    $("#inside-stay-div").append(pet_stay_inside);
    
    $("#outside-stay-div").append(pet_stay_outside_label);
    $("#outside-stay-div").append(pet_stay_outside);

    
    $("#both-stay-div").append(pet_stay_both_label);
    $("#both-stay-div").append(pet_stay_both);
    $("#both-stay-div").append($("<br>"));
    
    $("#accomodate-cat-div").append(accomodate_cat_label);
    $("#accomodate-cat-div").append(accomodate_cat);
    $("#accomodate-cat-div").append($("<br>"));
    
    $("#accomodate-dog-div").append(accomodate_dog_label);
    $("#accomodate-dog-div").append(accomodate_dog);
    $("#accomodate-dog-div").append($("<br>"));
    
    $("#price-cat-div").append(cat_price_label);
    $("#price-cat-div").append(cat_price);
    $("#price-cat-div").append($("<br>"));

    $("#price-dog-div").append(dog_price_label);
    $("#price-dog-div").append(dog_price);
    $("#price-dog-div").append($("<br>"));

    $("#home-description-div").append(home_description_label);
    $("#home-description-div").append(home_description);
    $("#home-description-div").append($("<br>"));
}

function check_radio_options() {
    var selected_value = $("input[name='property']:checked").val();
    if(selected_value === "Outdoor") {
        $("#catkeeper").prop("checked", false);
        $("#catkeeper").prop("disabled", true);
        
        $("#catprice").prop("disabled", true);
        $("#catprice").val(0);
    } else {
        $("#catkeeper").prop("disabled", false);
        $("#catprice").prop("disabled", false);
    }
}

function hide_keeper_form() {
    var div = $("#pet-keeper-extra-div");
    $("#pet-stay-inside").removeAttr("required");
    $("#pet-stay-outside").removeAttr("required");
    $("#pet-stay-both").removeAttr("required");
    div.hide();
}

function change_price_required() {
    var cat_required = $("#catkeeper").prop("checked");
    var dog_required = $("#dogkeeper").prop("checked");

    if(cat_required == true) {
        $("#catprice").prop("required", true);
    } else {
        $("#catprice").removeAttr("required");
    }

    if(dog_required == true) {
        $("#dogprice").prop("required", true);
    } else {
        $("#dogprice").removeAttr("required");
    }
}