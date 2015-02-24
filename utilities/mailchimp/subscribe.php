<?php
$api_key = "858a5e8f2a2284b090e98ebe54ac2316-us10";
$list_id = "f66c508b7d";
//print_r($_POST);exit;
require 'Mailchimp.php';
$Mailchimp = new Mailchimp( $api_key );
$Mailchimp_Lists = new Mailchimp_Lists( $Mailchimp );
$subscriber = $Mailchimp_Lists->subscribe( $list_id, array( 'email' => htmlentities($_POST['email']) ) );

if ( ! empty( $subscriber['leid'] ) ) {
   echo "success";
}
else
{
    echo "fail";
}

?>