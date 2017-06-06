$(document).ready(function () {
  $("#advanced_btn").click(function () {
    $(".adv-search-fields").slideToggle("slow");
  });
  $(".description").click(function () {
    $(this).parent().next().slideToggle("slow");
  });

  $('.dropdown-toggle').dropdown();

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

    selectedValues = [];    
    $("#categorySelect :selected").each(function(){
        selectedValues.push($(this).val()); 
    });
    if (selectedValues.length != 0)
      preferences.categories = selectedValues;

    selectedValues = [];    
    $("#foodStyleSelect :selected").each(function(){
        selectedValues.push($(this).val()); 
    });
    if (selectedValues.length != 0)
      preferences.foodStyles = selectedValues;

    selectedValues = [];    
    $("#paymentOptionSelect :selected").each(function(){
        selectedValues.push($(this).val()); 
    });
    if (selectedValues.length != 0)
      preferences.paymentOptions = selectedValues;

    selectedValues = [];    
    $("#restaurantServiceSelect :selected").each(function(){
        selectedValues.push($(this).val()); 
    });
    if (selectedValues.length != 0)
      preferences.restaurantServices = selectedValues;

    selectedValues = [];    
    $("#restaurantSpecialtySelect :selected").each(function(){
        selectedValues.push($(this).val()); 
    });
    if (selectedValues.length != 0)
      preferences.restaurantSpecialties = selectedValues;

    selectedValues = [];    
    $("#priceSelect :selected").each(function(){
        selectedValues.push($(this).val()); 
    });
    if (selectedValues.length != 0)
      preferences.priceRange = selectedValues;

    return preferences;

  }

  function populateLocationsList(data){
        console.log("ENTERED CALLBACK");
        data.locations.forEach(function(location) { //TODO: how does the server send the info? only this row needs change
          $(".locations.list-group").append("<div class=\"list-group-item short-location\"><div class=\"row location\"></div><div class=\"row long-description\"></div></div>");
          var locationRow = $(".list-group-item.short-location > .row.location");
          locationRow.append("<h4 class=\"col-sm-3 location-name\">"+location.name+"</h4>");
          locationRow.append("<span class=\"col-sm-1 rating\">"+location.rating+"</span>");
          locationRow.append("<span class=\"col-sm-2 address\">"+location.street+"</span>");
          locationRow.append("<span class=\"col-sm-offset-1 col-sm-2 description\"><a href=\"#\">See More<i class=\"fa fa-caret-down\" aria-hidden=\"true\"></i></a></span><span class=\"col-sm-offset-1 col-sm-2 goto-rating\"><a href=\"/reviews/"+location._id+"\">Give a rating</a></button></span>");
          locationRow.append('<span class="dropdown col-sm-offset-1 col-sm-2"><button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Dropdown button</button><span class="dropdown-menu" aria-labelledby="dropdownMenuButton"><a class="dropdown-item" href="#">Action</a><a class="dropdown-item" href="#">Another action</a><a class="dropdown-item" href="#">Something else here</a></span></span>');
          var locationDetails = $(".list-group-item.short-location > .row.long-description");
          var listOfAttributes = [];
          locationDetails.append("<span class=\"col-sm-12\">Phone: "+location.phone+"</span>");
          locationDetails.append("<span class=\"col-sm-12\">About: "+location.about+"</span>");
          locationDetails.append("<span class=\"col-sm-12\">Price Range: "+location.priceRange+"</span>");
          listOfAttributes = [];
          if($.isArray(location._attire)){
            location.paymentOptions.forEach(function(element){
              listOfAttributes.push(element.name);
            })
          }
          if(location.paymentOptions){
            listOfAttributes.push(location.paymentOptions.name);
          }
          locationDetails.append("<span class=\"col-sm-12\">Payment: "+listOfAttributes.toString()+"</span>");
          listOfAttributes = [];
          if($.isArray(location._attire)){
            location._attire.forEach(function(element){
              listOfAttributes.push(element.name);
            })
          }
          if(location._attire){
            listOfAttributes.push(location._attire.name);
          }
          locationDetails.append("<span class=\"col-sm-12\">Attire: "+listOfAttributes+"</span>");
          listOfAttributes = [];
          if($.isArray(location._category)){
            location._category.forEach(function(element){
              listOfAttributes.push(element.name);
            })
          }
          if(location._category){
            listOfAttributes.push(location._category.name);
          }
          locationDetails.append("<span class=\"col-sm-12\">Category: "+listOfAttributes+"</span>");
          listOfAttributes = [];
          if($.isArray(location.restaurantServices)){
            location.restaurantServices.forEach(function(element){
              listOfAttributes.push(element.name);
            })
          }
          if(location.restaurantServices){
            listOfAttributes.push(location.restaurantServices.name);
          }
          locationDetails.append("<span class=\"col-sm-12\">Services: "+listOfAttributes+"</span>");
          listOfAttributes = [];
          if($.isArray(location.foodStyles)){
            location.foodStyles.forEach(function(element){
              listOfAttributes.push(element.name);
            })
          }
          if(location.foodStyles){
            listOfAttributes.push(location.foodStyles.name);
          }
          locationDetails.append("<span class=\"col-sm-12\">Food: "+listOfAttributes.toString()+"</span>");
          listOfAttributes = [];
          if($.isArray(location.restaurantSpecialties)){
            location.restaurantSpecialties.forEach(function(element){
              listOfAttributes.push(element.name);
            })
          }
          if(location.restaurantSpecialties){
            listOfAttributes.push(location.restaurantSpecialties.name);
          }
          locationDetails.append("<span class=\"col-sm-12\">Specialties: "+listOfAttributes.toString()+"</span>");
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
    console.log(preferences);
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
    $.get("http://10.10.10.10:3000/search/locations",
    {},
    populateLocationsList, "json"
    );
  })

});
