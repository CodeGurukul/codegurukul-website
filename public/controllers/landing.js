angular.module('Codegurukul')
    .controller('LandingCtrl', function($scope, $rootScope, Courses, $stateParams, $location, Email, $alert) {

//    Courses.getAll.get({
//        cslug: "web-internship-program"
//    }, function(data) {
//        $scope.course = data.course;
//    });

//    function getCookie (name) {
//        var dc = document.cookie;
//        var cname = name + "=";
//
//        if (dc.length > 0) {
//            begin = dc.indexOf(cname);
//            if (begin != -1) {
//                begin += cname.length;
//                end = dc.indexOf(";",[begin]);
//                if (end == -1) 
//                    end = dc.length;
//                return unescape(dc.substring(begin, end));
//            } 
//        }	
//        return null;	
//    }
//    $scope.visited = getCookie ('visited');
//    console.log($scope.visited);
//
//    //    $scope.visited = false;
//    $scope.newsletterModalShown = false;
//
//    $scope.newsletterModal = function(){
//        $scope.newsletterModalShown = !$scope.newsletterModalShown;
//    }
//
//    if(!$scope.visited){
//        $scope.newsletterModalShown = true;
//        function setCookie(name, value, expires) {	
//            document.cookie = name + "=" + escape(value) + "; path=/" + ((expires == null) ? "" : "; expires=" + expires.toGMTString()); 
//        } 
//        //set new date object	
//        var exp = new Date();
//        //set expiry to 30 days
//        exp.setTime(exp.getTime() + (1000 * 60 * 60 * 24 * 30)); 
//
//        setCookie('visited','true',exp);
//    }
//

    $scope.processing = false;

    $scope.newsletter = function(){
        $scope.processing = true;
        Email.newsletter.save({
            email: $scope.email
        },function(data){
            $alert({
                content: 'You have successfully signed up for our newsletter.',
                placement: 'right',
                type: 'success',
                duration: 5
            });
            $scope.processing = false;
        },function(error){
            $alert({
                content: 'There was an error. Please try again later.',
                placement: 'right',
                type: 'danger',
                duration: 5
            });
            $scope.processing = false;
        })
    }
});