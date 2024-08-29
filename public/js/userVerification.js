

// used in login and signup pug files
function validateFields() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var loginButton = document.getElementById('Button');

    if (username !== '' && password !== '') {
      loginButton.removeAttribute('disabled');
    } else {
      loginButton.setAttribute('disabled', 'disabled');
    }
}





function login(){
    let req1 = new XMLHttpRequest();


    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    //console.log();

	req1.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
			
			let userStatus = JSON.parse(this.responseText)

            if(userStatus.userExists){
                
                // redirect to main page
                //*tried to make a second request here req2 but due to different html structure it couldnt replace the old one
                window.location.replace("/artworks");
            }
            else{
                document.getElementById("username").value = '';
                document.getElementById("password").value = '';
    
                alert("Username or password is incorrect");
            }

		}

	}

    // Prepare the data payload
    let data = {
        username: username,
        password: password
    };


    console.log(data);

    // Send a PUT request to the server containing the login data
    req1.open("PUT", "/verification/login");
    req1.setRequestHeader('Content-Type', 'application/json');
    req1.send(JSON.stringify(data));


}



//* incomplete - look at user router
function signup(){
    let req = new XMLHttpRequest();


    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    //console.log();

	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
			
			let recievedData = this.responseText

            console.log(recievedData);

            if(recievedData === "action successful"){
                
                // redirect to main page
                //*tried to make a second request here req2 but due to different html structure it couldnt replace the old one
                window.location.replace("/artworks");
            }
            else{
              
    
                alert("Error: "+recievedData);
            }

		}
	}

    
    let data = {
        username: username,
        password: password
    };


    console.log(data);

    // Send a Post request to the server containing the signup data
    req.open("POST", "/verification/signup");
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(data));

}



// this isnt needed becuz i have a server route that handles it
function logout(){

}