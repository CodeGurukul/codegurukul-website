angular.module('Codegurukul')
    .controller('PaymentCtrl', function($scope, $rootScope,$location, Email, $alert, Pay) {


    $scope.sendEmail = function(name, email, contact, query){
        console.log(email);
        Email.default.save({
            name: name,
            email: email,
            contact: contact,
            type: $rootScope.warroomType,
            message: query
        },function(data){
            $scope.contactModalShown=false;
            console.log(data);
            $alert({
                content: 'Success',
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
        $scope.registerModalShown = !$scope.registerModalShown;
    };



    $scope.pay = function(){
        if($rootScope.currentUser){
            $scope.options = {
                "key": "rzp_live_sZFQUuhcZ9XIYd",
                "amount": $rootScope.coursePrice,
                "name": "Bit Brothers Tech Pvt. Ltd.",
                "description": $rootScope.courseName,
                "image": "img/logo.png",
                "handler": function (response){
                    Pay.default.save({
                        payment_id: response.razorpay_payment_id
                    },function(data){
                        $alert({
                            content: 'Your payment was a success!',
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
                }
            };
            var rzp1 = new Razorpay($scope.options);
            rzp1.open();
        }
        else{
            $alert({
                content: 'You need to login to continue.',
                placement: 'right',
                type: 'danger',
                duration: 5
            });
            console.log("here");
        }
    };
});