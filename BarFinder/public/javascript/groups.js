$(document).ready(function(){
    $('#addGroup').click(function(){
        if ($('#addForm').css('display') == 'block')
            $('#addForm').css('display', 'none');
        else
            $('#addForm').css('display', 'block');
    })
    $('#saveButton').click(function(){
        var newName = $.trim($('#groupName').val());
        if (newName == "")
            alert("You must enter a name")
        else{
            $.ajax({
            type: "POST",
            url: "http://10.10.10.10:3000/groups",
            data: {groupName: newName},
            success: function(data, textStatus, jqXHR){console.log("ENTERED CALLBACK"); window.location.href='http://10.10.10.10:3000/groups';},
            dataType: "json"
            }).always(function(data, textStatus, jqXHR){
                    console.log("ENTERED CALLBACK");
                    window.location.href='http://10.10.10.10:3000/groups';
            });           
        }            
    })
})