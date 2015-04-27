angular.module('Codegurukul')
    .controller('ProgramCtrl', function($scope, $rootScope, $stateParams, Program, Courses, Pay, $alert) {

    $scope.notifyButton = '';
    $scope.registerButton = '';

    Courses.getAll.get({
      cslug: $stateParams.course

    }, function(data){
      $scope.course = data.course;
      $scope.course.joined = data.joined;
      console.log($scope.course.courseContent);
      
      if($scope.course.date === "COMING SOON"){
        $scope.notifyButton = true;
        $scope.registerButton = false;
      }
      else{
        $scope.registerButton = true;
        $scope.notifyButton = false;
      }
    });

    $scope.loginModalShown = false;
    $scope.registerModalShown = false;
    $scope.registerModal = function(){
      $scope.registerModalShown = !$scope.registerModalShown;

    };

    $scope.joinCourse = function () {
      if ($scope.course.joined) {
        $alert({
          content: "You have already joined the event.",
          placement: 'right',
          type: 'success',
          duration: 5
        });
        return;
      };
      Courses.join.update(
        {cslug: $stateParams.course},
        function (data) {
          console.log("SUCCESS!!");
          $alert({
            content: "You successfuly joined the course.",
            placement: 'right',
            type: 'success',
            duration: 5
          });
          $scope.course.joined = true;
        },
        function(error) {
          console.log(error);
          $alert({
            content: error.data,
            placement: 'right',
            type: 'danger',
            duration: 5
          });
        }
      );
    };

    $scope.pay = function(){
      if($rootScope.currentUser){
        $scope.options = {
            "key": "rzp_test_RYIGbvgxqTBJha",
            "amount": $scope.course.price,
            "name": "Bit Brothers Tech Pvt. Ltd.",
            "description": $scope.course.slug,
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
                    // joinCourse();
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