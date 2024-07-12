

function sendArtworkForProcessing() {
   
    // Collect values from input fields
    let artworkTitle = document.getElementById('ArtWorkTitle').value;
    //let artworkArtist = document.getElementById('ArtworkArtist').value;
    let yearCreated = document.getElementById('YearCreated').value;
    let artworkCategory = document.getElementById('ArtworkCategory').value;
    let artworkMedium = document.getElementById('ArtworkMedium').value;
    let description = document.getElementById('Description').value;
    let linkToArtworkPoster = document.getElementById('LinkToArtworkPoster').value;

    // Create data object with input values
    let data = {
        artworkTitle: artworkTitle,
        //artworkArtist: artworkArtist,
        yearCreated: yearCreated,
        artworkCategory: artworkCategory,
        artworkMedium: artworkMedium,
        description: description,
        linkToArtworkPoster: linkToArtworkPoster
    };

    let req = new XMLHttpRequest();

    // Update the onreadystatechange function
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Handle response if needed
            console.log(this.responseText);
        }
    };

    // Send a Post request to the server containing the artwork data
    req.open("POST", "/artworks/addartwork");
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(data));
}