



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



let uploadedArtworks;
let reviewedArtworks;



function getUploadedArtworks() {

    let username =document.getElementById("username").innerText;
    console.log("userame " + username);

    
    let url = "/artworks/?Artist=" + username;


    fetch(url)
        .then(res => res.text())
        .then((text) => {

            //console.log(text);
            const doc = new DOMParser().parseFromString(text, 'text/html');
            
            uploadedArtworks = doc.querySelector('.gallery-image').innerHTML;
            document.getElementById("selfuploads").innerHTML = uploadedArtworks;
            
            document.getElementById("selfuploads").classList.add("gallery-image");
        
        });

      
}



function getReviewedArtworks(){
    let username =document.getElementById("username").innerText;
    console.log("userame " + username);

    
    let url = "/artworks/?reviewerName=" + username;


    fetch(url)
        .then(res => res.text())
        .then((text) => {

            //console.log(text);
            const doc = new DOMParser().parseFromString(text, 'text/html');
            
            reviewedArtworks = doc.querySelector('.gallery-image').innerHTML;
            document.getElementById("reviewedartworks").innerHTML = reviewedArtworks;
            
            document.getElementById("reviewedartworks").classList.add("gallery-image");
        
        });
} 


getUploadedArtworks();
getReviewedArtworks();



let showuploadsButton = document.getElementById('uploadsButton');
showuploadsButton.onclick = () => {
    document.getElementById('reviewedartworks').classList.add("removeDisplay");
    document.getElementById('selfuploads').classList.remove("removeDisplay"); // now this is shown

}

let showreviewedButton = document.getElementById('reviewedButton');
showreviewedButton.onclick = () => {
    document.getElementById('selfuploads').classList.add("removeDisplay"); 
    document.getElementById('reviewedartworks').classList.remove("removeDisplay");
    
}







