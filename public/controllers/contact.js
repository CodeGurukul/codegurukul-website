angular.module('Codegurukul')
//     .config(function(uiGmapGoogleMapApiProvider) {
//     uiGmapGoogleMapApiProvider.configure({
//         //    key: 'your api key',
//         v: '3.17',
//         libraries: 'weather,geometry,visualization'
//     });
// })
  .controller('ContactCtrl', function($scope,$rootScope,Email,$alert,uiGmapGoogleMapApi) {
    
  //   $scope.map = {center: {latitude: 51.219053, longitude: 4.404418 }, zoom: 14 };
  //       $scope.options = {scrollwheel: false};
  //   console.log('HI');

  //   $scope.marker = {
  //     id: 0,
  //     coords: {
  //       latitude: 19.1359314,
  //       longitude: 72.8325012
  //     }
  // };

     $scope.sendEmail = function(){
        Email.default.save({
            name: $scope.name,
            email: $scope.email,
            subject: $scope.subject,
            contact: $scope.contact,
            message: $scope.message
        },function(data){
            console.log(data);
            $alert({
                content: 'Success.',
                placement: 'right',
                type: 'success',
                duration: 5
            });
        },function(error){
            $alert({
                content: 'There was an error please try again later.',
                placement: 'right',
                type: 'danger',
                duration: 5
            });
        });	
  };

  uiGmapGoogleMapApi.then(function(maps) {

    });
// function initialize() {

//                 // Create an array of styles.
//                 var styles = [
//                     {
//                         "featureType": "water",
//                         "stylers": [
//                             { "hue": "#89909a" },
//                             { "lightness": 60 }
//                         ]
//                     },{
//                         featureType: "road",
//                         elementType: "geometry",
//                         stylers: [
//                             { lightness: 50 },
//                             { visibility: "simplified" }
//                         ]
//                     },{
//                         featureType: "road",
//                         elementType: "labels",
//                         stylers: [
//                             { visibility: "off" }
//                         ]
//                     }
//                 ];

//                 // Create a new StyledMapType object, passing it the array of styles,
//                 // as well as the name to be displayed on the map type control.
//                 var styledMap = new google.maps.StyledMapType(styles,
//                 {name: "Styled Map"});
//                 var mapOptions = {
//                                 scrollwheel: false,
//                                 zoom: 18,
//                                 center: new google.maps.LatLng(19.1359314, 72.8325012),
//                                 mapTypeControlOptions: {
//                                     mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
//                                 }
//                     };
//                 var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

//                 //Associate the styled map with the MapTypeId and set it to display.
//                 map.mapTypes.set('map_style', styledMap);
//                 map.setMapTypeId('map_style');

//                 setMarkers(map, places);
//             }

//             var places = [
//                 ['Karthik Complex,Opp. Laxmi Industrial Estate, Andheri West, Mumbai, Maharashtra 400053', 19.1359314, 72.8325012, 1]
//             ];

//             function setMarkers(map, locations) {
//                 // Add markers to the map
//                 var image = {
//                     url: 'images/marker.png',
//                     // This marker is 40 pixels wide by 42 pixels tall.
//                     size: new google.maps.Size(40, 42),
//                     // The origin for this image is 0,0.
//                     origin: new google.maps.Point(0,0),
//                     // The anchor for this image is the base of the pin at 20,42.
//                     anchor: new google.maps.Point(15, 42)
//                 };

//                 var infowindow = new google.maps.InfoWindow();

//                 var marker, i;
//                 var markers = new Array();

//                 for (var i = 0; i < locations.length; i++) {
//                         var place = locations[i];
//                         var myLatLng = new google.maps.LatLng(place[1], place[2], place[3]);
//                         var marker = new google.maps.Marker({
//                             position: myLatLng,
//                             map: map,
//                             icon: image,
//                             title: place[0],
//                             zIndex: place[3],
//                             animation: google.maps.Animation.DROP
//                         });

//                         markers.push(marker);

//                         google.maps.event.addListener(marker, 'click', (function(marker, i) {
//                             return function() {
//                                 infowindow.setContent(locations[i][0]);
//                                 infowindow.open(map, marker);
//                             }
//                         })(marker, i));
//                     }
//             };

//             google.maps.event.addDomListener(window, 'load', initialize);
});