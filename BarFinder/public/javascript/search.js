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
    if (selectedValues.length != 0)
      preferences.attires = selectedValues;
    else
      preferences.attires = null;

    selectedValues = [];    
    $("#categorySelect :selected").each(function(){
        selectedValues.push($(this).val()); 
    });
    if (selectedValues.length != 0)
      preferences.categories = selectedValues;
    else
      preferences.categories = null;

    selectedValues = [];    
    $("#foodStyleSelect :selected").each(function(){
        selectedValues.push($(this).val()); 
    });
    if (selectedValues.length != 0)
      preferences.foodStyles = selectedValues;
    else
      preferences.foodStyles = null;

    selectedValues = [];    
    $("#paymentOptionSelect :selected").each(function(){
        selectedValues.push($(this).val()); 
    });
    if (selectedValues.length != 0)
      preferences.paymentOptions = selectedValues;
    else
      preferences.paymentOptions = null;

    selectedValues = [];    
    $("#restaurantServicesSelect :selected").each(function(){
        selectedValues.push($(this).val()); 
    });
    if (selectedValues.length != 0)
      preferences.restaurantServices = selectedValues;
    else
      preferences.restaurantServices = null;

    selectedValues = [];    
    $("#restaurantSpecialtySelect :selected").each(function(){
        selectedValues.push($(this).val()); 
    });
    if (selectedValues.length != 0)
      preferences.restaurantSpecialties = selectedValues;
    else
      preferences.restaurantSpecialties = null;

    selectedValues = [];    
    $("#priceSelect :selected").each(function(){
        selectedValues.push($(this).val()); 
    });
    if (selectedValues.length != 0)
      preferences.priceRange = selectedValues;
    else
      preferences.priceRange = null;

    preferences.latitude = null;
    preferences.longitude = null;
    preferences.radius = null;

    return preferences;

  }

  function populateLocationsList(data){
        data.locations.forEach(function(location) { //TODO: how does the server send the info? only this row needs change
          $(".locations.list-group").append("<div class=\"list-group-item short-location\"><div class=\"row location\"></div><div class=\"row long-description\"></div></div>");
          var locationRow = $(".list-group-item.short-location > .row.location");
          locationRow.append("<h4 class=\"col-sm-3 location-name\">"+location.name+"</h4>");
          locationRow.append("<span class=\"col-sm-1 rating\">"+location.rating+"</span>");
          locationRow.append("<span class=\"col-sm-2 address\">"+location.street+"</span>");
          locationRow.append("<span class=\"col-sm-offset-1 col-sm-2 description\"><a href=\"#\">See More<i class=\"fa fa-caret-down\" aria-hidden=\"true\"></i></a></span><span class=\"col-sm-offset-1 col-sm-2 goto-rating\"><a href=\"/reviews/"+location._id+"\">Give a rating</a></button></span>");
          var locationDetails = $(".list-group-item.short-location > .row.long-description");
          locationDetails.append("<span class=\"col-sm-12\">Phone: "+location.phone+"</span>");
          locationDetails.append("<span class=\"col-sm-12\">About: "+location.about+"</span>");
          locationDetails.append("<span class=\"col-sm-12\">Price Range: "+location.priceRange+"</span>");
          locationDetails.append("<span class=\"col-sm-12\">Payment: "+location.paymentOptions.toString()+"</span>");
          locationDetails.append("<span class=\"col-sm-12\">Attire: "+location._attire+"</span>");
          locationDetails.append("<span class=\"col-sm-12\">Category: "+location._category+"</span>");
          locationDetails.append("<span class=\"col-sm-12\">Services: "+location.restaurantServices.toString()+"</span>");
          locationDetails.append("<span class=\"col-sm-12\">Food: "+location.foodStyles.toString()+"</span>");
          locationDetails.append("<span class=\"col-sm-12\">Specialties: "+location.restaurantSpecialties.toString()+"</span>");
        }, this);
        //remake functionalities of list buttons
      $(".description").click(function () {
        $(this).parent().next().slideToggle("slow");
      });
      $(".ratingButton").click(function(){
        
      })
  }

  $("#advancedSearch").click(function(){
    $(".locations.list-group").empty();
    //TODO: check transmission of null
    var preferences = getCustomPreferences();
    $.post("http://10.10.10.10:3000/search/locations",{

      attires : preferences.attires,
      categories : preferences.categories,
      foodStyles : preferences.foodStyles,
      paymentOptions : preferences.paymentOptions,
      restaurantServices : preferences.restaurantServices,
      restaurantSpecialties : preferences.restaurantSpecialties,
      priceRange : preferences.priceRange,
      latitude : preferences.latitude,
      longitude : preferences.longitude,
      radius : preferences.radius

    },
      populateLocationsList, "json"
    );
  })

  $("#quickSearch").click(function(){
    $(".locations.list-group").empty();
    $get("http://10.10.10.10:3000/search/locations",
    {},
    populateLocationsList, "json"
    );
  })

});
