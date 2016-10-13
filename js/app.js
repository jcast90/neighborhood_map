"use strict"
var map;
var infoWindow;
//array of locations
var locations = [
        {
            title: "Home",
            lat: 32.856288,
            lng: -117.214201,
            streetAddress: "3227 Mercer Ln",
            cityAddress: "San Diego, CA 92122",
            url: ""
    }
    , {
            title: "Starbucks",
            lat: 32.85145,
            lng: -117.21664,
            streetAddress: "3202 Governor Dr",
            cityAddress: "San Diego, CA 92122",
            url: "www.starbucks.com"
    }
    , {
            title: "Sprouts",
            lat: 32.850838,
            lng: -117.21419,
            streetAddress: "3358 Governor Dr",
            cityAddress: "San Diego, CA 92122",
            url: "www.sprouts.com"
    }
    , {
            title: "Round Table Pizza",
            lat: 32.851135,
            lng: -117.21541,
            streetAddress: "3250 Governor Dr",
            cityAddress: "San Diego, CA 92122",
            url: "www.roundtablepizza.com"
    }
    , {
            title: "Post Office",
            lat: 32.85111,
            lng: -117.21531,
            streetAddress: "3298 Governor Dr",
            cityAddress: "San Diego, CA 92122",
            url: "www.usps.com"
    }
    , {
            title: "Outcast Grill",
            lat: 32.85203,
            lng: -117.2171337,
            streetAddress: "6104 Regents Rd",
            cityAddress: "San Diego, CA 92122",
            url: "www.outcastgrillsandiego.com"
    }
    , {
            title: "Standley Recreation Center",
            lat: 32.85175,
            lng: -117.21034,
            streetAddress: "3585 Governor Dr,",
            cityAddress: "San Diego, CA 92122",
            url: "www.sandiego.gov"
    }
    , {
            title: "The Coffee Bean & Tea Leaf",
            lat: 32.854595,
            lng: -117.20382,
            streetAddress: "3939 Governor Dr",
            cityAddress: "San Diego, CA 92122",
            url: "www.locations.coffeebean.com"
    }
    , {
            title: "J K Computer Services",
            lat: 32.854595,
            lng: -117.2033,
            streetAddress: "3977 Governor Dr",
            cityAddress: "San Diego, CA 92122",
            url: "jkcomputerservices.com"
    }
    , {
            title: "Ahi Sushi & Grill",
            lat: 32.854595,
            lng: -117.20368,
            streetAddress: "3949 Governor Dr",
            cityAddress: "San Diego, CA 92122",
            url: "ahisushiutc"
    }
    , {
            title: "Vons",
            lat: 32.854595,
            lng: -117.20309,
            streetAddress: "3993 Governor Dr",
            cityAddress: "San Diego, CA 92122",
            url: "www.local.vons.com"
    }
    , {
            title: "Papa Chito's Mexican Food",
            lat: 32.854595,
            lng: -117.20365,
            streetAddress: "3951 Governor Dr",
            cityAddress: "San Diego, CA 92122",
            url: ""
    }
, ]
    //start map
function initMap() {
    "use strict"
    var mapOptions = {
        center: new google.maps.LatLng(32.85652, -117.214226),
        zoom: 15,
    };
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    // a new Info Window is created
    infoWindow = new google.maps.InfoWindow();
    // Event that closes the Info Window with a click on the map
    google.maps.event.addListener(map, "click", function () {
        infoWindow.close();
    });

    ko.applyBindings(new ViewModel());

}

// List of stuff to do:
//1. display list
//3. filter list
//4. adding click functionality markers and list items (animate map marker icon)
//5. Include API
var Place = function (data) {
        var self = this;
        self.title = data.title;
        self.cityAddress = data.cityAddress;

        self.marker = new google.maps.Marker({
            title: data.title,
            map: map,
            position: {
                lat: (data.lat),
                lng: (data.lng)
            }
        });

        self.marker.addListener('click', function () {
            var that = this;
            /******** add call to yelp request *******/



            function nonce_generate() {
                return (Math.floor(Math.random() * 1e12).toString());
            }
            var yelp_url = 'http://api.yelp.com/v2/search';

            var YELP_KEY = "ZIxGwPs8HIxQ99IbdLgrZg";
            var YELP_KEY_SECRET = "una9U8wr7rimXI6qHnMiU-1_Kjg";
            var YELP_TOKEN = "JTxjHJxlTYnWd46jVajkSQiKJqusEoQS";
            var YELP_TOKEN_SECRET = "vF5ZDTZnzCVUkMUAj_HsozOvc-I";

            var parameters = {
                oauth_consumer_key: YELP_KEY,
                oauth_token: YELP_TOKEN,
                oauth_nonce: nonce_generate(),
                oauth_timestamp: Math.floor(Date.now() / 1000),
                oauth_signature_method: 'HMAC-SHA1',
                oauth_version: '1.0',
                callback: 'cb', // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
                location: 'San Diego',
                term: self.title
            };

            var encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
            parameters.oauth_signature = encodedSignature;

            var settings = {
                url: yelp_url,
                data: parameters,
                cache: true, // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
                dataType: 'jsonp',
                success: function (yelpResults) {
                    console.log(yelpResults);
                    console.log(yelpResults.businesses[0].rating);
                    console.log(yelpResults.businesses[0].rating_img_url);

                    var stars = yelpResults.businesses[0].rating_img_url;
                    var starRating = '<img src=stars>'  ;
                    // Do stuff with results
                    var iwContent = '<div id="iw_container">' + '<div class="iw_title">' + data.title + '</div>' + '<div class="iw_content">' + data.streetAddress + '<br />' + data.cityAddress + '<br />' + '<p>Rating:</p>' + yelpResults.businesses[0].rating + starRating + '</div></div>';

                    infoWindow.setContent(iwContent, yelpResults);
                    infoWindow.open(map, self.marker);

                    that.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function () {
                        that.setAnimation(null);
                    }, 1400);
                },
                fail: function (xhr, status, error) {
                    console.log("An AJAX error occured: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
                }
            };

            // Send AJAX query via jQuery library.
            $.ajax(settings);









            /***** move code that updates and opens infowindo to SUCCESS or DONE functions in AJAX request http://api.jquery.com/jquery.ajax/ *****/

            /*
            infoWindow.setContent(iwContent);
            infoWindow.open(map, self.marker);
            that.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
                that.setAnimation(null);
            }, 1400);*/
        });

        self.isVisible = ko.observable(true);

    }
    // ViewModel
var ViewModel = function () {
    "use strict";
    var self = this;
    //run through the place array
    this.placeList = ko.observableArray();
    //run through locations
    for (var i = 0, j = locations.length; i < j; i++) {
        var tempMarker = new Place(locations[i]);
        this.placeList.push(tempMarker);
    }


    //store user input
    self.userInput = ko.observable('');

    self.filterMarkers = ko.computed(function () {
        console.log(self.userInput());
        var searchInput = self.userInput().toLowerCase();



        self.placeList().forEach(function (place) {
            place.marker.setVisible(false);
            if (place.title.toLowerCase().indexOf(searchInput) !== -1) {
                place.isVisible(true);
                place.marker.setVisible(true);
            } else {
                place.isVisible(false);
                place.marker.setVisible(false);
            }

        });
    });
};
this.listClick = function (location) {
    google.maps.event.trigger(location.marker, 'click');
}

function googleError() {
    document.getElementById("map").innerHTML = "<h2>Uh-Oh! Something went wrong, try refreshing the page.</h2>";
}
