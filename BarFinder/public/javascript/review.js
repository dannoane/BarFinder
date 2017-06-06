function submitDataFromForm(){
    var rating = $('input[name="rating"]:checked').val();
    var comment = $("#comment").val();
    var locationId = location._id;
    $.post('http://10.10.10.10:3000/reviews',{rating: rating, comment: comment, locationId:locationId},
    function(data){
        $('#otherReviews').append('<li><div id="topOfReview"><span class="stars-container stars-'+rating+' ">★★★★★</span><span id="otherUsers"> <span class="glyphicon glyphicon-user"></span>' +username+ '</span></div><div id="otherComments">'+comment+'</div></li>')
    })
}
 
$(document).ready(function (){
   $('submitButton').click(function(){
       var rating = $('input[name="rating"]:checked').val();
        var comment = $("#comment").val();
        var locationId = location._id;
        $.post('http://10.10.10.10:3000/reviews',{rating: rating, comment: comment, locationId:locationId},
        function(data){
        $('#otherReviews').append('<li><div id="topOfReview"><span class="stars-container stars-'+rating+' ">★★★★★</span><span id="otherUsers"> <span class="glyphicon glyphicon-user"></span>' +username+ '</span></div><div id="otherComments">'+comment+'</div></li>');
        }).always(function(data, textStatus, jqXHR){
                    $('#otherReviews').append('<li><div id="topOfReview"><span class="stars-container stars-'+rating+' ">★★★★★</span><span id="otherUsers"> <span class="glyphicon glyphicon-user"></span>' +username+ '</span></div><div id="otherComments">'+comment+'</div></li>');
        });  
   }) 
})