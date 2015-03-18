(function ($) {
  "use strict;"
  
  $(document).ready(function() {

    // prevent the # links to scroll to the top of the page
    $("[href=#]").click(function(e) {
      e.preventDefault();
    });

    $("[data-toggle=popover]").popover();
    
    $("[data-toggle=tooltip]").tooltip();

    // flexslider
    $('.flex-bullet-slider').flexslider({
      slideshowSpeed: 10000,
      directionNav: false,
      animation: "fade"
    });

    $('.flex-arrow-slider').flexslider({
      slideshowSpeed: 5000,
      directionNav: true,
      controlNav: false,
      animation: "fade"
    });

    $('.vertical-center').flexVerticalCenter('padding-top');

    //Portfolio page functionalities
    $('#grid').mixitup();

    //Sticky Header
    if ($().waypoint) {
      $('header').waypoint('sticky', {
        offset: "-25px"
      });
    }

    $(window).scroll(function() {
      if ($(this).scrollTop()) {
        $('#back-to-top').fadeIn();
      } else {
        $('#back-to-top').fadeOut();
      }
    });

    $("#back-to-top").click(function () {
      $("html, body").animate({scrollTop: 0}, 300);
    });

  });
  
})(jQuery);

jQuery(window).load(function() {
  "use strict";

  // Parallax
  if ($(window).width() >= 991 && !navigator.userAgent.match(/(Android|iPod|iPhone|iPad|IEMobile|Opera Mini)/)) {
    $(window).stellar({
      horizontalScrolling: false,
      horizontalOffset: 0
    });
  }

  $(window).resize(function() {
    ($(window).width() < 991 || navigator.userAgent.match(/(Android|iPod|iPhone|iPad|IEMobile|Opera Mini)/)) ? $(window).stellar('destroy') : $(window).stellar({ horizontalScrolling: false, horizontalOffset: 0 });
  });
  
  // Google Maps Goodness
  if (document.getElementById('map_canvas')) {
    
    var gLatitude = 40.787278;
    var gLongitude = -73.969722;
    var gZoom = 13;
    var gTitle = 'Codegurukul';
    var gDescription = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
      
    var latlng = new google.maps.LatLng(gLatitude, gLongitude);
    
    var settings = {
      zoom: parseInt(gZoom),
      center: latlng,
      scrollwheel: false,
      mapTypeControl: true,
      mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
      navigationControl: true,
      navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    var map = new google.maps.Map(document.getElementById("map_canvas"), settings);
    
    var companyLogo = new google.maps.MarkerImage('img/google-maps/map-marker.png',
                                                  new google.maps.Size(20,30),
                                                  new google.maps.Point(0,0),
                                                  new google.maps.Point(10,30));
    
    var companyMarker = new google.maps.Marker({
      position: latlng,
           map: map,
          icon: companyLogo,
         title: gTitle
    });
    
    var contentString = '<div id="content-map">'+
        '<h3>' + gTitle + '</h3>'+
        '<p>' + gDescription + '</p>'+
        '</div>';
    
    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });
    
    google.maps.event.addListener(companyMarker, 'click', function() {
      infowindow.open(map,companyMarker);
    });
  
  }

});