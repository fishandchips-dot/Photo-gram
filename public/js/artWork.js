
//* incomplete
// function liked(){

// }



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













