var List = $('#personList');
$(document).ready(function () {
    $('#locationExpanded').hide();
    $('#dateEdit').hide();
    $('#locationName').click(function () {
        $('#locationExpanded').toggle();
    });
    $('#editButton').click(function () {
        $('#dateEdit').show();
    });
    $('#saveButton').click(function () {
        $('#dateEdit').hide();
    });
    
    $('#addButton').click(function(){
       $('#userModal').hide(); 
    });
        $('#viewMap').click(function () {
                $('#mapModal').show();
            initMap();
            google.maps.event.trigger(map, 'resize') ;
        });
    
    $('#dateDiv').text($('#dateDiv').text().slice(0, 24));

    $("#userAddButton").click(function(){
       $("#userModal").show(); 
    });
    $("li button.glyphicon-remove#removeUser").on("click",function () {
        event.stopPropagation();
        console.log(location.pathname.split('/')[2]);
        $.post("http://10.10.10.10:3000/group/" + location.pathname.split('/')[2] +"/deleteUser", {userId: $(this).attr("value")}, function(response){
                $(this).parent().remove();
                window.location.href='http://10.10.10.10:3000/group/'+location.pathname.split('/')[2];
        });
     });
     $('#searchButton').click(function(){
        console.log($('#inputsm').val());
        // event.stopPropagation();
        $.post("http://10.10.10.10:3000/group/" +location.pathname.split('/')[2]+ "/findUsers", {username: $('#inputsm').val()}, function(data){
            data.forEach(function(element) {
                $('#toAddUsers').append('<li value="ASDF" class="notificationItem"><a href="#" class="noStyle"><span class="glyphicon glyphicon-send"></span>'+ element.username +'</a><button id="confirmAddUser" value="'+ element.username +'" class="glyphicon confirmAddUser">Confirm</button></li>');
                // window.location.href='http://10.10.10.10:3000/group/'+location.pathname.split('/')[2];
            }, this);
            $('.confirmAddUser').click(function(){
                console.log( $(this).attr('value'));
                $.post("http://10.10.10.10:3000/group/" +location.pathname.split('/')[2]+ "/addUser", {username: $(this).val()}, function(data){
                    window.location.href='http://10.10.10.10:3000/group/'+location.pathname.split('/')[2];
                    // $('#prevUsers').append('<li value="ASDF" class="notificationItem"><a href="" class="noStyle"><span class="glyphicon glyphicon-send"></span>'+$(this).val()+'</a><button id="removeUser" value="" class="glyphicon glyphicon-remove"></button></li>')
                })
            })
        });
     })
});

function initMap() {
    var uluru = {
        lat: -25.363,
        lng: 131.044
    };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: uluru
    });
    var marker = new google.maps.Marker({
        position: uluru,
        map: map
    });
}
