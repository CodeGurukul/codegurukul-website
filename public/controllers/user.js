angular.module('Codegurukul')
    .controller('UserCtrl', function($scope, User, $stateParams, $alert, $location, $state) {
    $scope.all = false;
    $scope.edit = false;
    console.log($stateParams.uslug);
    User.default.get({
        uslug: $stateParams.uslug
    }, 
                     function(data){
        $scope.user = data;
        console.log($scope.user);
    });

    $scope.allBadges = function () {
        Badges.default.get(function(data){
            $scope.user.temp = data;
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

    };
});