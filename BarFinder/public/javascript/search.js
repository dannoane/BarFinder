$(document).ready(function () {
  $("#advanced_btn").click(function () {
    $(".adv-search-fields").slideToggle("slow");
  });
  $(".description").click(function () {
    $(this).parent().next().slideToggle("slow");
  });


  $(".multiple-select-down").chosen({
      width: "80%"
    }

  );

  function getCustomPreferences(){
    var preferences = {};
    var selectedValues = [];    
    $("#attireSelect :selected").each(function(){
        selectedValues.push($(this).val()); 
    });
    if (selectedValues.length == 0)
      preferences.attires = null;
    else
      preferences.attires = selectedValues;

    selectedValues = [];    
    $("#categorySelect :selected").each(function(){
        selectedValues.push($(this).val()); 
    });
    if (selectedValues.length == 0)
      preferences.categories = null;
    else
      preferences.categories = selectedValues;

    selectedValues = [];    
    $("#foodStyleSelect :selected").each(function(){
        selectedValues.push($(this).val()); 
    });
    if (selectedValues.length == 0)
      preferences.foodStyles = null;
    else
      preferences.foodStyles = selectedValues;

    selectedValues = [];    
    $("#paymentOptionSelect :selected").each(function(){
        selectedValues.push($(this).val()); 
    });
    if (selectedValues.length == 0)
      preferences.paymentOptions = null;
    else
      preferences.paymentOptions = selectedValues;

    selectedValues = [];    
    $("#restaurantServicesSelect :selected").each(function(){
        selectedValues.push($(this).val()); 
    });
    if (selectedValues.length == 0)
      preferences.restaurantServices = null;
    else
      preferences.restaurantServices = selectedValues;

    selectedValues = [];    
    $("#restaurantSpecialtySelect :selected").each(function(){
        selectedValues.push($(this).val()); 
    });
    if (selectedValues.length == 0)
      preferences.restaurantSpecialties = null;
    else
      preferences.restaurantSpecialties = selectedValues;

    selectedValues = [];    
    $("#priceSelect :selected").each(function(){
        selectedValues.push($(this).val()); 
    });
    if (selectedValues.length == 0)
      preferences.priceRange = null;
    else
      preferences.priceRange = selectedValues;

    preferences.latitude = null;
    preferences.longitude = null;
    preferences.radius = null;

    return preferences;

  }

  $("#advancedSearch").click(function(){
    $(".locations.list-group").empty();
    // $(".locations.list-group").html(function(){
    //   var listEntry = '<div class=\"list-group-item short-location\"\> <div class="row location"\> <h4 class="col-sm-3 location-name">Darcula\'s Residence</h4\> <span class="col-sm-1 rating">8.2</span\> <span class="col-sm-2 address">Str. Mal nr. 167</span\> <span class="col-sm-offset-1 col-sm-2 description"><a href="#">See More<i class="fa fa-caret-down" aria-hidden="true"></i></a></span\> <span class="col-sm-offset-1 col-sm-2 goto-rating"><a href="#">Give a rating</a></span\> </div\> <div class="row long-description"\> <span class="col-sm-12">asdfghj</span\> </div\></div>';
    //   return listEntry;
    // })
    //create list entries
    $(".locations.list-group").append("<div class=\"list-group-item short-location\"><div class=\"row location\"></div><div class=\"row long-description\"></div></div>");
    var locationRow = $(".list-group-item.short-location > .row.location");
    locationRow.append("<h4 class=\"col-sm-3 location-name\">Darcula's Residence</h4>");
    locationRow.append("<span class=\"col-sm-1 rating\">8.2</span>");
    locationRow.append("<span class=\"col-sm-2 address\">Str. Mal nr. 167</span>");
    locationRow.append("<span class=\"col-sm-offset-1 col-sm-2 description\"><a href=\"#\">See More<i class=\"fa fa-caret-down\" aria-hidden=\"true\"></i></a></span><span class=\"col-sm-offset-1 col-sm-2 goto-rating\"><a href=\"#\">Give a rating</a></span>");
    var locationDetails = $(".list-group-item.short-location > .row.long-description");
    locationDetails.append("<span class=\"col-sm-12\">asdfghj</span>")
    //remake functionalities of list buttons
    $(".description").click(function () {
    $(this).parent().next().slideToggle("slow");
    });
  
    var preferences = getCustomPreferences();

    console.log(preferences);

  })

});
