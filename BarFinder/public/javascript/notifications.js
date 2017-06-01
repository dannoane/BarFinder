$(document).ready(function() {

    $("li button.glyphicon-remove").on("click",function () {
        event.stopPropagation();
        $.post("http://10.10.10.10:3000/notifications/delete", {notificationId: $(this).attr("value"), function(response){
                $(this).parent().remove();
        }});
     });
});