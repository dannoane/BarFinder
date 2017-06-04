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
        else
            $.post('http://10.10.10.10:3000/groups', {groupName: newName},
            function(data){return}, 'json');
    })
})