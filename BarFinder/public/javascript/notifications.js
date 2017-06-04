$(document).ready(function() {

    $("li button.glyphicon-remove").on("click",function () {
        event.stopPropagation();
            $.ajax({
            type: "POST",
            url: "http://10.10.10.10:3000/notifications/delete",
            data: {notificationId: $(this).attr("value")},
            success: function(data, textStatus, jqXHR){$(this).parent().remove();},
            dataType: "json"
            }).always(function(data, textStatus, jqXHR){
                    $(this).parent().remove();
            });   
     });
});