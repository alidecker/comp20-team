(function() {
	var config = {
    	apiKey: "AIzaSyBjaMxOs_yfhBLWVhdqrrWFN2uExKdmqRc",
    	authDomain: "comp20-sublets.firebaseapp.com",
    	databaseURL: "https://comp20-sublets.firebaseio.com",
    	projectId: "comp20-sublets",
    	storageBucket: "comp20-sublets.appspot.com",
    	messagingSenderId: "288024894813"
  };
  firebase.initializeApp(config);
  var database = firebase.database();
  // FirebaseDatabase database = FirebaseDatabase.getInstance();
  // DatabaseReference ref = database.getReference("server/saving-d")

  const txtEmail = document.getElementById('txtEmail');
  const txtPassword = document.getElementById('txtPassword');
  const btnLogin = document.getElementById('btnLogin');
  const btnSignUp = document.getElementById('btnSignUp');
  const btnLogout = document.getElementById('btnLogout');

  btnLogin.addEventListener('click', e => {
  	const email = txtEmail.value;
  	const pass = txtPassword.value;
  	const auth = firebase.auth();
  	const promise = auth.signInWithEmailAndPassword(email, pass);
  	promise.catch(e => console.log(e.message));
  });

  btnSignUp.addEventListener('click', e => {
  	const email = txtEmail.value;
  	const pass = txtPassword.value;
  	const auth = firebase.auth();
  	const promise = auth.createUserWithEmailAndPassword(email, pass);
  	promise
  		.catch(e => console.log(e.message));
  });

  btnLogout.addEventListener('click', e => {
  	firebase.auth().signOut();
  });

  firebase.auth().onAuthStateChanged(firebaseUser => {
  	if (firebaseUser) {
  		console.log(firebaseUser);
  		btnLogout.classList.remove('hide');
      window.location = "map.html"
  	} else {
  		console.log('not logged in');
  		btnLogout.classList.add('hide');
  	}
  });

}());

function writeToFirebase(email, listingID) {
  var email = email;
  var listingID = {listingID}

    var newUser = firebase.database().ref('users').push();
    newUser.set({
        email: email, listingID: listingID
    });
  }