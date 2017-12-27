var myLat = 42.406804;
var myLng = -71.120038;
var request = new XMLHttpRequest();
var me = new google.maps.LatLng(myLat, myLng);
var myOptions = {
	zoom: 14, // The larger the zoom number, the bigger the zoom
	center: me,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map;
var markers = [];
var infowindow = new google.maps.InfoWindow();
var listings = [];
var filtered_listings = [];


function init()
{
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	getMyLocation();
}

function getMyLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
		});
		getListings();
	}
	else {
		alert("Geolocation is not supported by your web browser.");
	}
}


function getListings() {
	request = new XMLHttpRequest();
	request.open("GET", "https://comp20-sublets.firebaseio.com/.json", true);
	request.setRequestHeader("Content-type", "application/json");

	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			rawData = request.responseText;
			messages = JSON.parse(rawData);
			var listing_object = messages.listings;
			var listing_keys = [];
			
			for ( var x in messages.listings) {
				var object = listing_object[x];
				object["id"] = x;
				listings.push(listing_object[x]);
			}
			//console.log(listings);

			renderMap(listings);
		}
	}
	request.send();
}




function renderMap(listing_array)
{
	me = new google.maps.LatLng(myLat, myLng);

	// Update map and go there...
	map.panTo(me);

	for (var i = listing_array.length - 1; i >= 0; i--) {
		var listinglatLng = new google.maps.LatLng(listing_array[i].location.lat, listing_array[i].location.lng);
		var listingInfo = "<p>" + listing_array[i].title + "</p><p>Price per month: USD" + 
					listing_array[i].price_details.price + "</p><p>Available term(s): ";

		var fall = spring = summer = false;

		if (listing_array[i].availability.fall == true) {
			listingInfo += "fall";
			fall = true;
		}
		if (listing_array[i].availability.spring == true) {
			if (fall == true) {
				listingInfo += ", ";
			}
			listingInfo += "spring";
		}
		if (listing_array[i].availability.summer == true) {
			if (fall == true || spring == true) {
				listingInfo += ", ";
			}
			listingInfo += "summer";
		}

		listingInfo += "</p><p>Contact info: " + 
					listing_array[i].contact_email + "</p>";

		listingInfo += '<button onclick="view_additional_info(\'' + 	listing_array[i].id + '\')"" class="btn">View Additional Info</button>'
		var iconPic = { url: "logo1.png", 
					    scaledSize: new google.maps.Size(30,30),
					    origin: new google.maps.Point(0, 0),
    			        anchor: new google.maps.Point(0, 15)};

		markers[i] = new google.maps.Marker({
			position: listinglatLng,
			content: listingInfo,
			icon: iconPic
		});
		markers[i].setMap(map);
		// open info window on click of marker
		google.maps.event.addListener(markers[i], 'click', function() {
				infowindow.setContent(this.content);
				infowindow.open(map, this);
		});
	}

}

function filter_map() {
	for (var i = 0; i < markers.length; i++ ) {
    	markers[i].setMap(null);
  	}
  	markers.length = 0;
  	filtered_listings.length = 0;

	var values = $( "#slider" ).slider( "option", "values" );
	var min_price = values[0];
	var max_price = values[1];
	var summer = document.getElementById('summer-check').checked;
    var spring = document.getElementById('spring-check').checked;
    var fall = document.getElementById('fall-check').checked;


	for (var x in listings) {
		var summer_overlap = (summer && listings[x].availability.summer);
		var fall_overlap = (fall && listings[x].availability.fall);
		var spring_overlap = (spring && listings[x].availability.spring);
		if (listings[x].price_details.price > min_price && listings[x].price_details.price < max_price
			&& (summer_overlap || spring_overlap || fall_overlap)) {
			filtered_listings.push(listings[x]);
		}
	}
	renderMap(filtered_listings);
}

function no_filter() {
	$( "#slider" ).slider( "option", "values", [0, 2000] );
	document.getElementById('summer-check').checked = false;
	document.getElementById('spring-check').checked = false;
 	document.getElementById('fall-check').checked = false;
	renderMap(listings);
}

function view_additional_info(listing_id) {
	var listing = null;
	for (var i = listings.length - 1; i >= 0; i--) {
		if (listings[i].id == listing_id){
			listing = listings[i];
			break;
		}
	}

	var availability = "";
	var fall = spring = summer = false;
	if (listing.availability.fall == true) {
		availability += "Fall";
		fall = true;
	}
	if (listing.availability.spring == true) {
		if (fall == true) {
			availability += ", ";
		}
		availability += "Spring";
	}
	if (listing.availability.summer == true) {
		if (fall == true || spring == true) {
			availability += ", ";
		}
		availability += "Summer";
	}

	var info = "<p>Title: " + listing.title + "</p>";
	info += "<p>Price per semester: $" + listing.price_details.price + "</p>";
	info += "<p>Security Deposit: $" + listing.price_details.security_deposit + "</p>";
	info += "<p>Address: " + listing.location.address1 + "</p>";
	info += "<p>Available: " + availability + "</p>";
	$("#additional_info").html(info);

}

