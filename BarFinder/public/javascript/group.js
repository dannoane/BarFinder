var users = ["plm", "prost"];

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
    
    $("#userAddButton").click(function(){
       $("#userModal").show(); 
    });
    $.each(users, function (i) {
        var li = $('<li/>')
        .addClass('list-group-item')
        .appendTo(List);
       
        var a = $('<p/>')
        .text(users[i].name + ": " + users[i].status)
        .appendTo(li);
        
        var x = $('<button/>')
        .addClass("btn btn-danger btn-xs")
        .appendTo(a);
        
        var s = $('<a href = "#"/>')
        .addClass("glyphicon glyphicon-trash")
        .appendTo(x);
    });
    $("li button.glyphicon-remove#removeUser").on("click",function () {
        event.stopPropagation();
        $.post("http://10.10.10.10:3000/group/:groupId/deleteUser", {userId: $(this).attr("value")}, function(response){
                $(this).parent().remove();
        });
     });
     $('#searchButton').click(function(){
        console.log($('#inputsm').val());
        event.stopPropagation();
        $.post("http://10.10.10.10:3000/group/" +location.pathname.split('/')[2]+ "/findUsers", {username: $('#inputsm').val()}, function(data){
            data.forEach(function(element) {
                $('#toAddUsers').append('<li value="ASDF" class="notificationItem"><a href="#" class="noStyle"><span class="glyphicon glyphicon-send"></span>'+ element.username +'</a><button id="confirmAddUser" value="'+ element.username +'" class="glyphicon confirmAddUser">Confirm</button></li>');
            }, this);
            $('.confirmAddUser').click(function(){
                console.log( $(this).attr('value'));
                $.post("http://10.10.10.10:3000/group/" +location.pathname.split('/')[2]+ "/addUser", {username: $(this).val()}, function(data){
                    // window.location.href='http://10.10.10.10:3000/group/'+location.pathname.split('/')[2];
                    $('#prevUsers').append('<li value="ASDF" class="notificationItem"><a href="" class="noStyle"><span class="glyphicon glyphicon-send"></span>'+$(this).val()+'</a><button id="removeUser" value="undefined" class="glyphicon glyphicon-remove"></button></li>')
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
