angular.module('Codegurukul')
    .controller('ProgramCtrl', function($scope, $rootScope, $stateParams, Courses, Pay, $alert, Email, $http, $state) {
    $scope.processing = false;
    $scope.showCourseJoinedTickMark = false;
    $scope.couponCode = "";  
    $scope.textAnimation = "";



    $scope.inviteMessageModalShown = false;

    $scope.cookie = function(){
        function setCookie(name, value, expires) {	
            document.cookie = name + "=" + escape(value) + "; path=/" + ((expires == null) ? "" : "; expires=" + expires.toGMTString()); 
        } 
        //set new date object	
        var exp = new Date();
        //set expiry to 30 days
        exp.setTime(exp.getTime() + (1000 * 60 * 60 * 24 * 30)); 
        setCookie('lead',$scope.course.slug,exp)
    }

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
                content: "Your coupon code has been validated successfuly.",
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
        $scope.course.joinedSid = data.joinedSid;
        console.log($scope.course.joinedSid);
        //        $scope.slotIdentification = $scope.course.slots[0]._id;
        //        $scope.slots = $scope.course.slots;
        //        for(var i=0; i<$scope.slots.length; i++){
        //            console.log($scope.slots[i]._id);
        //        }

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

        if($scope.course.inviteOnly == true){
            $scope.courseUnlocked = false;
        }
        else{
            $scope.courseUnlocked = true;
        }
    });

    $scope.payViaModalShown = false;

    $scope.togglePayViaModal = function(){
        $scope.payViaModalShown = !$scope.payViaModalShown;
    }


    $scope.checkCondition = function(slot){
        $scope.slotIdentification = slot;
        if ($rootScope.currentUser){
            if($scope.course.joined){
                $alert({
                    content: 'You have already registered for this event.',
                    placement: 'right',
                    type: 'danger',
                    duration: 5
                });
            }
            else if ($scope.courseUnlocked == false && $scope.course.joined == false){
                $scope.inviteMessageModalShown = !$scope.inviteMessageModalShown;
                Courses.addLead.save({
                    cslug: $stateParams.course
                },function(data){
                    console.log("lead added");
                },function(error){
                    console.log("error");
                });
            }

            else {
                if ($scope.course.status == 'open' && $scope.course.joined == false){
                    $scope.canJoin();
                }
                else if ($scope.course.status=='new'){
                    $scope.notify();
                    console.log("notify function executed");
                }
            }
        }
        else {
            $rootScope.loginModal();
            $scope.cookie();
            $alert({
                content: 'You need to login to continue.',
                placement: 'right',
                type: 'danger',
                duration: 5
            });
        }
    }

    //    console.log($scope.slotIdentification);
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
                cslug: $stateParams.course,
                sid: $scope.slotIdentification,
                code: $scope.couponCode
            },
                                function(data) {
                console.log("SUCCESS!!");
                $alert({
                    content: "You successfuly joined the course.",
                    placement: 'right',
                    type: 'success',
                    duration: 5
                });
                $scope.course.joined = true;
                $scope.showCourseJoinedTickMark = true;
                $scope.processing = false;
                $state.transitionTo($state.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
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
                cslug: $stateParams.course,
                sid: $scope.slotIdentification
            },
                                function() {
                $scope.processing = false;
                if($scope.course.price > '0'){
                    //                    $scope.pay();
                    console.log("here");
                    $scope.togglePayViaModal();
                }
                else if($scope.course.price == '0'){
                    $scope.joinCourse();
                }
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
            $rootScope.loginModal();
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
                Courses.join.save({
                    payment_id: response.razorpay_payment_id,
                    cslug: $stateParams.course,
                    code:$scope.couponCode,
                    sid: $scope.slotIdentification
                }, function(data) {
                    $alert({
                        content: 'Your payment was a success!',
                        placement: 'right',
                        type: 'success',
                        duration: 5
                    });
                    $scope.showCourseJoinedTickMark = true;
                    $scope.course.joined = true;
                    $scope.processing = false;
                    $state.transitionTo($state.current, $stateParams, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });
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


    $scope.register = function(){
        console.log($scope.mop);
        Courses.join.save({
            payment_id: $scope.payment_id,
            cslug: $stateParams.course,
            code:$scope.couponCode,
            sid: $scope.slotIdentification,
            mop: $scope.mop
        }, function(data) {
            $alert({
                content: 'Your registration was a success!',
                placement: 'right',
                type: 'success',
                duration: 5
            });
            $scope.showCourseJoinedTickMark = true;
            $scope.course.joined = true;
            $scope.processing = false;
            $state.transitionTo($state.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
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

});