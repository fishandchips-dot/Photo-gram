
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
details_button.onclick = showContainer;

var reviews_button = document.getElementById('showReviewsButton');
reviews_button.onclick = showContainer;

var addReview_button = document.getElementById('addReviewButton');

if(addReview_button){
    addReview_button.onclick = showContainer;

}

function showContainer () {
    //TODO all the styles are returning blank , find out why
    
    console.log("here"+ document.getElementById("overlap-container2").style.width);

    // re set the styles otherwise u get null for the values for some reason
    if(document.getElementById("overlap-container2").style.width == ''){
        document.getElementById("overlap-container2").style.width = 0+'%';
    }
    

    let detailsInput = details_button;
    let reviewsInput = reviews_button;
    let addReviewInput = addReview_button;

    // reset button images, event listeners and z-indices
    detailsInput.src = "images/description.png";
    details_button.onclick = showContainer;
    reviewsInput.src = "images/comments.png";
    reviews_button.onclick = showContainer;
    if(addReviewInput){
        addReviewInput.src = "images/review.png";
        addReview_button.onclick = showContainer;
    }
        
    document.getElementById("reviews").style.zIndex = 0;
    document.getElementById("addReview").style.zIndex = 0;
    document.getElementById("details").style.zIndex = 0;

    // replace the button image with a close icon
    this.src = "images/close.png";
    this.onclick = closeContainer;

    switch (this.id) {
        case 'showDetailsButton':
            document.getElementById("details").style.zIndex = 1;
            break;
        case 'showReviewsButton':
            document.getElementById("reviews").style.zIndex = 1;
            break;
        case 'addReviewButton':
            document.getElementById("addReview").style.zIndex = 1;
            break;
        default:
            break;
    }

    console.log(this.id);

    if(document.getElementById("overlap-container2").style.width == '0%'){ // expand transition 

        document.getElementById("overlap-container2").style.width = '30%';
        document.getElementById('overlap-container2').style.transition = 'all 0.5s';
        

        //document.getElementById('overlap-container2').classList.add("showText");

        // document.getElementById('details').style.opacity = 1;
        // document.getElementById('details').style.transition = "1s";
        //document.getElementById('details').style.transitionDelay = "1s";


        

        // document.getElementById('overlap-container2').style.opacity = 1;
    }
   

}


function closeContainer(){

    document.getElementById("overlap-container2").style.width = 0+'%';
    document.getElementById("overlap-container2").style.transition = 'all 0.5s';


    switch (this.id) {
        case 'showDetailsButton':
            details_button.src = "images/description.png";
            details_button.onclick = showContainer;
            break;
        case 'showReviewsButton':
            reviews_button.src = "images/comments.png";
            reviews_button.onclick = showContainer;
            break;
        case 'addReviewButton':
            addReview_button.src = "images/review.png";
            addReview_button.onclick = showContainer;
            break;
        default:
            break;
    }
}

