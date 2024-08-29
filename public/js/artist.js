

// this script is utilised in the profile page


function toggleFollow(){

    
  let pathname = window.location.pathname;
  const artistId = pathname.split("/")[2];

  
  
  //const artistId = document.getElementById("artistId").value;

  
    
    
    let data = {
        artistId: artistId,
       
    };


    console.log(data);
    

    let req = new XMLHttpRequest();

    //destroy review section once review is made
    req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
			
            var button = document.getElementById('followButton');
            var buttonText = button.innerText;
          
            if (buttonText === "Follow") {
              buttonText = "Following";
            } else {
              buttonText = "Follow";
            }
          
            // Set the updated text back to the button
            button.innerText = buttonText;

		}

	}


    // Send a Post request to the server containing the signup data
    req.open("POST", "/user/follow");
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(data));
}