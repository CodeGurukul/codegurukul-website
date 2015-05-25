angular.module('Codegurukul')
    .controller('ProgramCtrl', function($scope, $rootScope, $stateParams, Program, Courses, Pay, $alert, Email, Codes, $http) {
    $scope.processing = false;
    $scope.showCourseJoinedTickMark = false;
    $scope.couponCode = "";  
    $scope.textAnimation = "";
    $scope.courseUnlocked = false;
    
    
    $scope.inviteMessageModalShown = false;

    $scope.validate = function(){
        $http({
            url: '/api/codes/'+$stateParams.course+'/validateCode', 
            method: "GET",
            params: {code: $scope.couponCode}
        }).success(function(data, status, headers, config) {
            console.log(data);
            //            console.log(status);
            $scope.discountedRate = data.result;
            //            console.log($scope.discountedRate);
            $scope.course.price = $scope.discountedRate;

            $alert({
                content: "Your coupon code has been validated successfuly. Please check your updated Course Price.",
                placement: 'right',
                type: 'success',
                duration: 5
            });
            $scope.courseUnlocked = true;
            $scope.textAnimation = "animate"; 

        }).error(function(data, status, headers, config) {
            console.log("Error");
            //            console.log(data);
            //            console.log(status);
            $alert({
                content: "Your coupon code is invalid. Please check the code you have entered and try again.",
                placement: 'right',
                type: 'danger',
                duration: 5
            });
        });
    };

    Courses.getAll.get({
        cslug: $stateParams.course

    }, function(data) {
        $scope.course = data.course;
        $scope.course.joined = data.joined;
        console.log($scope.course.date);

        if ($scope.course.date === "COMING SOON") {
            $scope.notifyButton = true;
            $scope.registerButton = false;
        } else {
            $scope.registerButton = true;
            $scope.notifyButton = false;
        }


        if($scope.course.joined == true){
            $scope.showCourseJoinedTickMark = true;
        }
    });

    $scope.loginModalShown = false;
    $scope.registerModalShown = false;
    $scope.registerModal = function() {
        $scope.registerModalShown = !$scope.registerModalShown;

    };

    $scope.checkCondition = function(){
        if ($scope.course.slug == 'internship'){
            
        $scope.inviteMessageModalShown = !$scope.inviteMessageModalShown;
        }
//        
//        if ($scope.course.status == 'open' && $scope.course.price > 0){
//            $scope.canJoin();
//
//        }
//        else if ($scope.course.status == 'open' && $scope.course.price == '0'){
//            $scope.joinCourse();
//            console.log("join course function executed");
//        }
//        else if ($scope.course.status=='new'){
//            $scope.notify();
//            console.log("notify function executed");
//        }
    }


    $scope.joinCourse = function() {
        if ($scope.course.joined) {
            $alert({
                content: "You have already joined the event.",
                placement: 'right',
                type: 'success',
                duration: 5
            });
            return;
        } else {
            $scope.processing = true;
            Courses.join.update({
                cslug: $stateParams.course
            },
                                function(data) {
                console.log("SUCCESS!!");
                $alert({
                    content: "You successfuly joined the course.",
                    placement: 'right',
                    type: 'success',
                    duration: 5
                });
                // $scope.course.joined = true;
                $scope.processing = false;
            },
                                function(error) {
                console.log(error);
                $alert({
                    content: error.data,
                    placement: 'right',
                    type: 'danger',
                    duration: 5
                });
                $scope.processing = false;
            }
                               );
        }
    };
    $scope.canJoin = function() {
        if ($rootScope.currentUser) {
            $scope.processing = true;
            Courses.canJoin.get({
                cslug: $stateParams.course
            },
                                function() {
                $scope.processing = false;
                $scope.pay();
            },
                                function(error) {
                console.log(error);
                $alert({
                    content: error.data,
                    placement: 'right',
                    type: 'danger',
                    duration: 5
                });
                $scope.processing = false;
            }
                               );
        } else {
            $alert({
                content: 'You need to login to continue.',
                placement: 'right',
                type: 'danger',
                duration: 5
            });
        }
    };
    $scope.pay = function() {
        $scope.options = {
            "key": "rzp_test_RYIGbvgxqTBJha",
            "amount": $scope.course.price * 100,
            "name": "Bit Brothers Tech Pvt. Ltd.",
            "description": $scope.course.slug,
            "image": "img/logo.png",
            "handler": function(response) {
                $scope.processing = true;
                Pay.default.save({
                    payment_id: response.razorpay_payment_id,
                    cslug: $stateParams.course
                }, function(data) {
                    $alert({
                        content: 'Your payment was a success!',
                        placement: 'right',
                        type: 'success',
                        duration: 5
                    });
                    $scope.processing = false;
                    // joinCourse();
                }, function(error) {
                    $alert({
                        content: 'There was an error please try again later.',
                        placement: 'right',
                        type: 'danger',
                        duration: 5
                    });
                    $scope.processing = false;
                });
            }
        };
        var rzp1 = new Razorpay($scope.options);
        rzp1.open();
    };
    $scope.notify = function() {
        if ($rootScope.currentUser) {
            $scope.processing = true;
            Email.newsletter.save(function(data) {
                console.log(data);
                $alert({
                    content: 'Success.',
                    placement: 'right',
                    type: 'success',
                    duration: 5
                });
                $scope.processing = false;
                console.log("here");
            }, function(error) {
                $alert({
                    content: 'There was an error please try again later.',
                    placement: 'right',
                    type: 'danger',
                    duration: 5
                });
                $scope.processing = false;
            });
        } else {
            $alert({
                content: 'You need to login to continue.',
                placement: 'right',
                type: 'danger',
                duration: 5
            });
        }
    };

});