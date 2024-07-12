



let artworkList = {}; // {pageNumber: [artwork1, artwork2, ...]}

let pageNumber = 1;


let urlComponents; // current url









document.addEventListener('DOMContentLoaded', function() {
    
    
    //console.log(document.getElementById("image-container"));
   printUrl();

    //// was in side the next listener block
    urlComponents = new URL(window.location.href);
    console.log(urlComponents);

    if(urlComponents.searchParams.size > 0){ 
    getArtworks(urlComponents.pathname + urlComponents.search); 
    }      
    else { getArtworks("/artworks/"); }


    // remove this listener
    document.getElementById("loadmore").addEventListener('click',
        
        () =>{ 

            const newUrl = window.location.pathname + "?page=" + pageNumber;

            // Log the URL to check if it's correct
            console.log("Loading more artworks from: " + newUrl);
        
            // Call the function to get artworks
            getArtworks(newUrl);
        });


});







function getArtworks(requestPathNAme){

    console.log("here "+requestPathNAme);

    let req = new XMLHttpRequest();

    //destroy review section once review is made
    req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
			
            artworkList[pageNumber] = (JSON.parse(this.responseText));
            
            //console.log(artworkList[pageNumber]);
            
            displayArtworks(pageNumber);

            pageNumber++;
		}

	}


    // Send a Post request to the server containing the signup data
    req.open("GET", `${requestPathNAme}`);
    req.setRequestHeader('Accept', 'application/json');
    req.send();


}



/*
    bellow each output artwork div will look like: 
        -   div
        -     a(href="/artworks/" + artwork._id, target="_self")
        -       img(src=artwork.Poster, alt=artwork.Title , id=artwork._id)

*/

function displayArtworks(pageNum){


    let artworksBlock = document.getElementById("image-container");

    artworkList[pageNum].forEach(function (artObject) {
       
        const imageBlock = document.createElement('div');

        const link = document.createElement('a');
        link.href = `/artworks/${artObject._id}`;
        link.target = '_self';

        const img = document.createElement('img');
        img.src = artObject.Poster;
        img.alt = artObject.Title;
        img.id = artObject._id;

        link.appendChild(img);
        imageBlock.appendChild(link);
        console.log(imageBlock);
        artworksBlock.appendChild(imageBlock); 
    });

}



function printUrl(){
    let currentUrl = window.location.href;
    console.log('Current URL: ' + currentUrl);
    
}







// function parseUrl() {
//     var currentUrl = window.location.href;
//     var url = new URL(currentUrl);

//     var urlComponents = {
//         href: url.href,
//         protocol: url.protocol,
//         host: url.host,
//         hostname: url.hostname,
//         port: url.port,
//         pathname: url.pathname,
//         search: url.search,
//         searchParams: Array.from(url.searchParams.entries()),
//         hash: url.hash
//     };

    

//     return urlComponents;
// }
