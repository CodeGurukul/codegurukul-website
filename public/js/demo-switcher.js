(function ($) {
  "use strict;"
  
  $(document).ready(function() {
    
    $(".switcher .link").click(function() {

      if ($(".switcher .themeOptions").css("display") === "none") {
        $(".switcher .themeOptions").css("display", "block"); 
        $(".switcher .title").css("display", "block"); 
      } else {
        $(".switcher .themeOptions").css("display", "none");
        $(".switcher .title").css("display", "none");
      }
      
    })
    
    // Theme color
    $('.themeColors li a').click(function() {
      var themeColor = $(this).attr('class');
      
      $('#themeColor').remove();
      $('body').append('<link rel="stylesheet" href="css/color/' + themeColor + '.css" id="themeColor">');
    });

    // Theme layout
    $('.themeLayout').change(function() {
      if($(this).val() == "boxed") {
        $('.main-wrapper').addClass('boxed');
        $('body').addClass('bg-pattern-cross_scratches');
      }
      else {
        $('.main-wrapper').removeClass('boxed');
      }
    });

    // BG Patterns
    $('.themePatterns li a').click(function() {
      var bgPattern = $(this).css("background");

      $('body').css('background', bgPattern);
    });
    
  });

})(jQuery);