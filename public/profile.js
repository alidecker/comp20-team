// var users = [];
// var admin = require("firebase-admin");
// var db = admin.database();
// var ref = db.ref("server/saving-data/fireblog/posts");

// ref.on("value", function(snapshot) {
//   console.log(snapshot.val());
// }, function (errorObject) {
//   console.log("The read failed: " + errorObject.code);
// });

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
  
  var userID = firebase.auth().currentUser.uid;
  getListingInfo();
  

    const logoutBtn = document.getElementById("logout");
    logoutBtn.addEventListener("click", function() {
        console.log("You are logged out");
        window.location("index.html");
        firebase.auth().signOut();
    });

    var users = [];

});

// function init() 
// {
//   getListingInfo();
// }
function logOut() {
  firebase.auth().signOut();
  window.location("index.html");
}

// function getListingInfo() {

//   request = new XMLHttpRequest();
//   request.open("GET", "https://comp20-sublets.firebaseio.com/.json", true);
//   request.setRequestHeader("Content-type", "application/json");

//   request.onreadystatechange = function() {
//     if (request.readyState == 4 && request.status == 200) {
//       rawData = request.responseText;
//       messages = JSON.parse(rawData);
//       var user_object = messages.user;
//       var user_keys = [];

//       for (var x in messages.users) {
//         var object = user_object[x];
//         object["id"] = x;
//         users.push(user_object[x]);
//       }

//       renderListing(users);

//     }
//   }
//   request.send();
// }


// function renderListing(users_array) 
// {
 
//   for (var i = users_array.length-1; i >=0; i--) {
//     var listingInfo = "<p>" + users_array[i].listing_id;
//     document.getElementById("houseTitle").innerHTML = listingInfo;
//   //   var listingInfo = "<p>" + users_array[i].title + "</p><p>Price per month: USD" + 
//   //         listing_array[i].price_details.price + "</p><p>Available term(s): ";
//   //   var fall = spring = summer = false;

//   //   if (users_array[i].availability.fall == true) {
//   //     listingInfo += "fall";
//   //     fall = true;
//   //   }
//   //   if (users_array[i].availability.spring == true) {
//   //     if (fall == true) {
//   //       listingInfo += ", ";
//   //     }
//   //     listingInfo += "spring";
//   //   }
//   //   if (users_array[i].availability.summer == true) {
//   //     if (fall == true || spring == true) {
//   //       listingInfo += ", ";
//   //     }
//   //     listingInfo += "summer";
//   //   }
//   // }
// }
// }





