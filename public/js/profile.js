



function switchAccountType(){

    let req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) {
                // Request was successful

                console.log("yo wtf");
                
                const responseObj = JSON.parse(this.responseText);
                
                console.log(responseObj);
                
                if (responseObj && responseObj.hasOwnProperty("isNewArtist")){ 
                    if(!responseObj.isNewArtist) {
                        console.log(" old artist");
                        window.location.replace("/user/profile"); //* reload profile to unlock disabled buttons
                    }
                    else{
                        // fist ever time switching to artist
                        console.log(" new artist");
                        //window.location.replace("/addArtwork");  //* u can find this in main server page

                        //wait for the new window to load then confirm
                        

                        if (confirm("Add an artwork to become an artist!")) {
                            window.location.replace("/addArtwork");  //* u can find this in main server page
                        }
                    
                        
                    }
                }


            } else {
                // Handle errors
                console.error("Error switching account type. Status code: " + this.status);
            }
        }
    }

    // Send a POST request to the server (or you can use GET if it makes more sense)
    req.open("POST", "/user/type");
    req.setRequestHeader("Content-Type", "application/json");
    req.send();

}