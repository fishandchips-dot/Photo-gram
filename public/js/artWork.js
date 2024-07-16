
//* incomplete
// function liked(){

// }



// make a function to get all reviews for an artwork



function reviewed(){

    const artworkId = document.getElementById('artworkId').value;

    const reviewTextArea = document.getElementById('reviewTextArea').value;


    let data = {
        artwork: artworkId,
        reviewText: reviewTextArea
    };


    console.log(data);
    

    let req = new XMLHttpRequest();

    //destroy review section once review is made
    req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
			
            let reviewSection = document.getElementById("reviewSection");
            if (reviewSection) {
                reviewSection.remove();
            }

		}

	}


    // Send a Post request to the server containing the signup data
    req.open("POST", "/artworks/review");
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(data));


}




//* wanted to set the the colors of the image sprouting from the image itself but cors policy made it a pain in the ass 
//*const img = document.getElementById('yourImageId');




var details_button = document.getElementById('showDetailsButton');
details_button.onclick = showDetails;

var reviews_button = document.getElementById('showReviewsButton');
reviews_button.onclick = showReviews;


function showDetails () {
    //TODO all the styles are returning blank , find out why
    
    console.log("here"+ document.getElementById("overlap-container2").style.width);

    // re set the styles otherwise u get null for the values for some reason
    if(document.getElementById("overlap-container2").style.width == ''){
        document.getElementById("overlap-container2").style.width = 0+'%';
        document.getElementById("overlap-container2").style.transition = 'all 1s';
    }
    
    document.getElementById("details").style.zIndex = 1;
    document.getElementById("reviews").style.zIndex = 0;
   
    console.log( document.getElementById("overlap-container2").style.width);

    if(document.getElementById("overlap-container2").style.width == '0%'){ // expand transition 

        document.getElementById("overlap-container2").style.width = '30%';
        document.getElementById('overlap-container2').style.transition = 'all 1s';
    }
   

}

function showReviews (){
    console.log("here"+ document.getElementById("overlap-container2").style.width);

    // re set the styles otherwise u get null for the values for some reason
    if(document.getElementById("overlap-container2").style.width == ''){
        document.getElementById("overlap-container2").style.width = 0+'%';
        document.getElementById("overlap-container2").style.transition = 'all 1s';
    }
    
    document.getElementById("details").style.zIndex = 0;
    document.getElementById("reviews").style.zIndex = 1;
   
    console.log( document.getElementById("overlap-container2").style.width);

    if(document.getElementById("overlap-container2").style.width == '0%'){ // expand transition 

        document.getElementById("overlap-container2").style.width = '30%';
        document.getElementById('overlap-container2').style.transition = 'all 1s';
    }
}