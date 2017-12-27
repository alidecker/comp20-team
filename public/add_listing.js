
var images = [];
var upload_images = [];
var index = 0;
var current_image = 0;

// https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
function previewFiles() {
    var preview = document.querySelector('#preview');
    var files   = document.querySelector('input[type=file]').files;

    function readAndAdd(file) {

        // Make sure `file.name` matches our extensions criteria
        if ( /\.(jpe?g|png|gif)$/i.test(file.name)) {
            var reader = new FileReader();

            reader.addEventListener("load", function () {
                images[index] = new Image();
                images[index].height = 100;
                images[index].title = file.name;
                images[index].src = this.result;
                upload_images[index] = file;
                //preview.appendChild( images[index] );
                if (index == 0) { 
                   displayImages(); 
                }
                index++;
            }, false);
            reader.readAsDataURL(file);
        }
    }

    if (files) {
        [].forEach.call(files, readAndAdd);
    }
    
    //console.log(images);
}

// logout.addEventListener('click', e => {
//     firebase.auth().signOut();
//     window.location("index.html");
// });

function displayImages() {
    if (images[0]) {
        preview.appendChild(images[0]);
        current_image = 0;
    }
}

function nextImage() {
    next_image = (current_image + 1) % index;
    if (images[next_image]) {
        preview.replaceChild(images[next_image], images[current_image]);
        current_image = next_image;
    }
}

function postListing() {
    // var ref = new Firebase("https://comp20-sublets.firebaseapp.com/")
        // scope.authObj = firebaseAuth();


    var a1 = document.getElementById('address-1');
    var a2 = document.getElementById('address-2');
    var city = document.getElementById('city-box');
    var price = document.getElementById('price');
    var sd = document.getElementById('security-deposit');
    var summer = document.getElementById('summer-check').checked;
    var spring = document.getElementById('spring-check').checked;
    var fall = document.getElementById('fall-check').checked;
    // var info = document.getElementById('description-box');
    var furnished = document.getElementById('furnished').checked;
    var pets = document.getElementById('pets').checked;
    var no_smoking = document.getElementById('no-smoking').checked;
    var utilities = document.getElementById('utilities').checked;
    var title = document.getElementById('title-input');
    var email = document.getElementById('email-input');
    if (auth.currentUser == null) {
        alert("Please log in if you would like to post a listing.");
        return;
    }
    var uid = auth.currentUser.uid;

    
    a1.value = sanitize(a1.value);
    a2.value = sanitize(a2.value);
    city.value = sanitize(city.value);
    price.value = sanitize(price.value);
    sd.value = sanitize(sd.value);
    title.value = sanitize(title.value);
    email.value = isEmail(email.value);

    if (!(a1.value && city.value && price.value && sd.value
          && email.value && title.value) || (summer + spring + fall) == 0) {
        alert("One or more of the required fields is empty");
    } else {
        var position;
        var address_full = a1.value + ", " + city.value + ", MA, USA";
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( {'address': address_full}, function(results, status) {
            if (status == 'OK') {
                position = results[0].geometry.location;

                writeToFirebase(a1.value, a2.value, city.value, position, price.value, 
                    sd.value, summer, spring, fall, email.value, images, upload_images, 
                    furnished, pets, no_smoking, utilities, title.value, uid);
                alert("Your listing has been posted!");                
            } else {
                alert("Could not find given address");
            }
        });  
    }
}

function writeToFirebase(a1, a2, city, position, price, sd, summer, spring, 
            fall, email, user_image_names, user_image_files, furnished, pets, no_smoking, utilities, title, uid) {
   
    var lat = position.lat();
    var lng = position.lng();
    var location = { address1: a1, address2: a2, city: city, lat: lat, lng: lng };
    var price_details = { price: price, security_deposit: sd };
    var availability = { summer: summer, spring: spring, fall: fall };
    var features = { furnished: furnished, pets: pets, no_smoking: no_smoking,
                     utilities: utilities};
    var newList = firebase.database().ref('listings').push();

    newList.set({
        title: title, location: location, price_details: price_details, availability: availability,
        features: features, contact_email: email, uid: uid
    });
    var storageRef = firebase.storage().ref('images');
    var userRef = storageRef.child(newList.key);
    for( i = 0; i < user_image_names.length; i++) {
        var imageRef = userRef.child(user_image_names[i].title);
        imageRef.put(user_image_files[i]);
   
    }
    var userList = firebase.database().ref("users");
    var newUserList = userList.child(firebase.auth().currentUser.uid);
    newUserList.set({
        listing_id: newList.key
    });
    var listDet = newUserList.child(newList.key);
    listDet.set({
        location: location, price_details:price_details, availability: availability
    });
}

function sanitize(str) {
    str = str.replace(/\</g,"&lt;");
    str = str.replace(/\>/g,"&gt;");
    str = str.replace(/\&/g,"&amp;");
    str = str.replace(/\"/g,"&quot;");
    str = str.replace(/\'/g,"&#39;");
    return str;
}

function isNumber(num) {
    num = validator.toFloat(num);
    return num;
}

function isEmail(em) {
    /*em = ????*/
    return em;
}