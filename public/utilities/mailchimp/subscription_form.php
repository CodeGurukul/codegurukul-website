<?php 
include($_SERVER['DOCUMENT_ROOT']."/includes_settings.php");
get_header();
?>
<div class="message"></div>
 
<form  role="form" method="post" id="subscribe">
    
    <input type="email"  id="email" name="email" placeholder="you@yourself.com" value="">
    <button type="submit" onClick="sub();">SUBSCRIBE</button>
    
</form>
<script>
function sub() {
event.preventDefault();
   // $('#subscribe').submit(function() {
       /* if (!valid_email_address($("#email").val()))
        {
            $(".message").html('The email address you entered was invalid. Please make sure you enter a valid email address to subscribe.');
        }
        else
        {*/
            
            $(".message").html("<span style='color:green;'>Adding your email address...</span>");
            $.ajax({
                url: '/utilities/mailchimp/subscribe', 
                data: $('#subscribe').serialize(),
                type: 'POST',
                success: function(msg) {
                    if(msg=="success")
                    {
                        $("#email").val("");
                        $(".message").html('<span style="color:green;">You have successfully subscribed to our mailing list.</span>');
                        
                    }
                    else
                    {
                      $(".message").html('The email address you entered was invalid. Please make sure you enter a valid email address to subscribe.');  
                    }
                }
            });
        /*}*/
 
        return false;
    //});
}
function valid_email_address(email)
{
    var pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
    return pattern.test(email);
}
</script>
<?php get_contact_referral("Want to partner with us!");?>
<?php get_footer();?>