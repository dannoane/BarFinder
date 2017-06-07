 $(document).ready(function (){
   $('#submitButton').click(function(){
        var rating = $('input[name="rating"]:checked').val();
        var comment = $("#comment").val();
        var locationId = location.pathname.split('/')[2];
        if (!rating || !comment || !locationId){
            alert("All fields are required");
            return;
        }
        console.log(rating,comment,locationId);
        $.post('http://10.10.10.10:3000/reviews',{rating: rating, comment: comment, locationId:locationId},
        function(data){
        $('#otherReviews').append('<li><div id="topOfReview"><span class="stars-container stars-'+rating+' ">★★★★★</span><span id="otherUsers"> <span class="glyphicon glyphicon-user"></span>' +username+ '</span></div><div id="otherComments">'+comment+'</div></li>');
        }).always(function(data, textStatus, jqXHR){
                    location.reload(true);
        });  
        location.reload(true);
   }) 
   console.log(location.pathname.split('/')[2]);
})