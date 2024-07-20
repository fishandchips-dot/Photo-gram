


// const galleryContainer = document.getElementById("gallery-image");



// //galleryContainer.addEventListener("click", expandImage);



function expandImage(){
    
  document.getElementById("image-window").src = '';

  let imageID = this.id;


  let displayFrame = document.getElementById("image-window");
  
  displayFrame.src = "/artworks/" + imageID;

  //   let req = new XMLHttpRequest();
  //   req.onreadystatechange = function() {
	// 	if(this.readyState==4 && this.status==200){
			
  //           let displayFrame = document.getElementById("display-box");
            
  //           displayFrame.innerHTML='';
  //           displayFrame.innerHTML = this.responseText;
            

	// 	}

	// }

  //   req.open("GET", "/artworks/" + imageID);
  //   req.setRequestHeader('Content-Type', 'text/html');
  //   req.send();
   
  
}



const imageContainers = document.getElementsByClassName("img-box");


for (const container of imageContainers) {
    container.addEventListener("click", expandImage); // Or any event you want
    
    console.log(container.id);
  }