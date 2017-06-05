$(document).ready(function () {

  $(".adv-search-fields").slideToggle("slow");

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
    preferences.attires = selectedValues;

    selectedValues = [];    
    $("#categorySelect :selected").each(function(){
        selectedValues.push($(this).val()); 
    });
      preferences.categories = selectedValues;

    selectedValues = [];    
    $("#foodStyleSelect :selected").each(function(){
        selectedValues.push($(this).val()); 
    });
    preferences.foodStyles = selectedValues;

    selectedValues = [];    
    $("#paymentOptionSelect :selected").each(function(){
        selectedValues.push($(this).val()); 
    });
    preferences.paymentOptions = selectedValues;

    selectedValues = [];    
    $("#restaurantServicesSelect :selected").each(function(){
        selectedValues.push($(this).val()); 
    });
    preferences.restaurantServices = selectedValues;

    selectedValues = [];    
    $("#restaurantSpecialtySelect :selected").each(function(){
        selectedValues.push($(this).val()); 
    });
    preferences.restaurantSpecialties = selectedValues;

    selectedValues = [];    
    $("#priceSelect :selected").each(function(){
        selectedValues.push($(this).val()); 
    });
    if (selectedValues.length != 0)
    preferences.priceRange = selectedValues;

    preferences.latitude = null;
    preferences.longitude = null;
    preferences.radius = null;

    return preferences;

  }

  $('#savePreferences').click(function(){
    var preferences = getCustomPreferences();
    $.post('http://10.10.10.10:3000/preferences',
      {preferences: preferences},
      null,
      'json'
    ).always(function(data){
      console.log(data);
    })
    console.log(preferences);
  })

});
