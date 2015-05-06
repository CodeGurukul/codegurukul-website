angular.module('Codegurukul')
    .controller('UserCtrl', function($scope, User, $stateParams, $alert, $location, $state, Badges) {
    $scope.all = false;
    $scope.edit = false;
    $scope.progressModal = false;

    $scope.toggleProgressModal = function(){
        $scope.progressModal = !$scope.progressModal;
    }

//    console.log($stateParams.uslug);
    User.default.get({
        uslug: $stateParams.uslug
    }, 
                     function(data){
        $scope.user = data;
//        console.log($scope.user);


        $scope.progressData = 1;

        if ($scope.user.profile.fullname)
            $scope.progressData++;
        if ($scope.user.profile.website)
            $scope.progressData++;
        if ($scope.user.profile.facebook && $scope.user.profile.twitter)
            $scope.progressData++;
        if ($scope.user.profile.google && $scope.user.profile.github)
            $scope.progressData++;
        if ($scope.user.profile.organization)
            $scope.progressData++;
        if ($scope.user.profile.college && $scope.user.profile.branch)
            $scope.progressData++;
        if ($scope.user.profile.gender && $scope.user.profile.dob && $scope.user.profile.location)
            $scope.progressData++;
        if ($scope.user.profile.experience)
            $scope.progressData++;
        if ($scope.user.profile.skills)
            $scope.progressData++;

        $scope.progressData = $scope.progressData * 10;
        if($scope.progressData != 100)
            $scope.progressModal = true;
        if ($scope.progressData == 100)
            $scope.progressModal = false;
        if ($stateParams.slug != $scope.user.profile.slug)
            $scope.progressModal = false;

    });

    $scope.allBadges = function () {
        $scope.all = true;
        Badges.default.query(
            function(badges){
                $scope.badges = badges;
//                console.log($scope.badges);
            });
    }

    $scope.filterLocked = function (badge) {
        if ($scope.all) return true;
        return !badge.locked;
    }


    
    
    
    $scope.skill = [String];

    $scope.update = function() {
        User.default.update({
            uslug: $stateParams.uslug
        },{
            fullname: $scope.user.profile.fullname,
            location: $scope.user.profile.location,
            email: $scope.user.email,
            website: $scope.user.profile.website,
            facebook: $scope.user.profile.facebook,
            twitter: $scope.user.profile.twitter,
            google: $scope.user.profile.google,
            github: $scope.user.profile.github,
            organization: $scope.user.profile.organization,
            college: $scope.user.profile.college,
            branch: $scope.user.profile.branch,
            experience: $scope.user.profile.experience,
            gender: $scope.user.profile.gender,
            skills: $scope.user.profile.skills,
            dob : $scope.user.profile.dob
        },
                            function(data){
            $alert({
                content: 'Your profile was successfuly updated.',
                placement: 'right',
                type: 'success',
                duration: 5
            });
            $state.transitionTo($state.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        },
                            function(data){
            $alert({
                content: 'There was an error please try again later.',
                placement: 'right',
                type: 'danger',
                duration: 5
            });
        });

    };  //update function ends


});