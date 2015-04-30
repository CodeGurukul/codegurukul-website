angular.module('Codegurukul')
  .controller('ProgramCtrl', function($scope, $rootScope, $stateParams, Program, Courses, Pay, $alert, Email) {
    $scope.processing = false;
    Courses.getAll.get({
      cslug: $stateParams.course

    }, function(data) {
      $scope.course = data.course;
      $scope.course.joined = data.joined;
      console.log($scope.course.courseContent);

      if ($scope.course.date === "COMING SOON") {
        $scope.notifyButton = true;
        $scope.registerButton = false;
      } else {
        $scope.registerButton = true;
        $scope.notifyButton = false;
      }
    });

    $scope.loginModalShown = false;
    $scope.registerModalShown = false;
    $scope.registerModal = function() {
      $scope.registerModalShown = !$scope.registerModalShown;

    };

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
            $scope.course.joined = true;
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