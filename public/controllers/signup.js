angular.module('Codegurukul')
    .controller('SignupCtrl', function($scope, Auth, $location,  $alert, $rootScope){

    // Look for referral code in url
    $scope.urlRefCode = $location.search();

    if($scope.urlRefCode.referralCode){
        $scope.cookieFunction = true;
    }
    else{
        $scope.cookieFunction = false;
    }

    // If referral code is found save it as a cookie
    if($scope.cookieFunction == true){
        function setCookie(name, value, expires) {	
            document.cookie = name + "=" + escape(value) + "; path=/" + ((expires == null) ? "" : "; expires=" + expires.toGMTString()); 
        } 
        //set new date object	
        var exp = new Date();
        //set expiry to 30 days
        exp.setTime(exp.getTime() + (1000 * 60 * 60 * 24 * 30));  
        setCookie('referralCode',$scope.urlRefCode.referralCode,exp)
    };

    //Search and Retrieve cookie
    function getCookie (name) {
        var dc = document.cookie;
        var cname = name + "=";

        if (dc.length > 0) {
            begin = dc.indexOf(cname);
            if (begin != -1) {
                begin += cname.length;
                end = dc.indexOf(";",[begin]);
                if (end == -1) 
                    end = dc.length;
                return unescape(dc.substring(begin, end));
            } 
        }	
        return null;	
    }
    $rootScope.cookieVal = getCookie ('referralCode');
    $scope.courseLead = getCookie ('lead');
    

    
    if($rootScope.cookieVal){
        $scope.extReferalCode = $rootScope.cookieVal;
    }
    $scope.signup = function() {
        $rootScope.emailForVerification = $scope.email;
        Auth.signup({
            fullname: $scope.fullname,
            username: $scope.username,
            email: $scope.email,
            password: $scope.password,
            type: $scope.type,
            college: $scope.college,
            stream: $scope.stream,
            year: $scope.year,
            organization: $scope.organization,
            workDesc: $scope.workDesc,
            mobile: $scope.mobile,
            extReferalCode: $scope.extReferalCode,
            lead: $scope.courseLead
        });
    };
    //    $scope.pageClass = 'fadeZoom';



});