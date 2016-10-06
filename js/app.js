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
    // Finally displayMarkers() function is called to begin the markers creation
    //displayLocations();
    ko.applyBindings(new ViewModel());
}



// List of stuff to do:
//1. display list
//3. filter list
//4. adding click functionality markers and list items (animate map marker icon)
//5. Include API




var Place = function (data) {
    // Create a marker per location, and put into markers array.


    this.marker = new google.maps.Marker({
        title: data.title,
        map: map,
        position: {
            lat: (data.lat),
            lng: (data.lng)
        }
    });
    this.marker.addListener('click', function () {
        infoWindow.open(map, this);
        this.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
            this.marker.setAnimation(null);
        }, 500);
    });
}


// ViewModel
var ViewModel = function () {
        "use strict";

        //run through the place array
        this.placeList = ko.observableArray();
        //run through locations
        for (var i = 0, j = locations.length; i < j; i++) {
            var tempMarker = new Place(locations[i]);
            this.placeList.push(tempMarker);
        }

        this.placeList.forEach(function (placeItem) {
            //place markers
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations.lng),
                map: map,
                animation: google.maps.Animation.DROP
            });
            placeItem.marker = marker;
            //animate marker
            google.maps.event.addListener(marker, 'click', function () {
                infowindow.open(map, this);
                placeItem.marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function () {
                    placeItem.marker.setAnimation(null);
                }, 500);
            });
        });


        this.showInfo = function (placeItem) {
            google.maps.event.trigger(placeItem.marker, 'click');
            this.hideElements();

            //store user input
            this.userInput = ko.observable('');

            this.filterMarkers = function () {

                var searchInput = this.userInput().toLowerCase();
                this.visible.removeAll();
                this.placeList().forEach(function (place) {
                    place.marker.setVisible(false);

                    if (place.name().toLowerCase().indexOf(searchInput) !== -1) {
                        this.visible.push(place);
                    }
                });
                this.visible().forEach(function (place) {
                    place.marker.setVisible(true);
                });
            };
        };
        /*
            google.maps.event.addListener(marker, 'click', function () {
                //info window content
                var iwContent = '<div id="iw_container">' + '<div class="iw_title">' + title + '</div>' + '<div class="iw_content">' + streetAddress + '<br />' + cityAddress + '<br />' + url + '</div></div>';

                infoWindow.setContent(iwContent);

                infoWindow.open(map, marker);
            });
        }

        */


        function googleError() {
            document.getElementById("map").innerHTML = "<h2>Uh-Oh! Something went wrong, try refreshing the page.</h2>";
        }
