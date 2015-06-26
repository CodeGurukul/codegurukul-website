angular.module('Codegurukul')
    .controller('AdminCoursesCtrl', function($scope, $alert, $rootScope, Admin, $state) {

    Admin.default.query(function(data) {
        $scope.courses = data;
//        console.log($scope.courses);

    });
    
    $scope.goToAllUsers = function(){
        $state.go('admin-all-users');
    };
    
        $scope.sortType = 'name';
        $scope.sortUser = 'profile.fullname';
        $scope.sortReverse = false;
        $scope.searchCourse = '';
        $scope.searchUser = '';

    $scope.createCourseModalShown = false;

    $scope.createCourseModal = function(){
        $scope.createCourseModalShown = !$scope.createCourseModalShown;
    }


    //    $scope.courseName = "";
    $scope.createCourse = function(courseName){
        Admin.create.save({
            name: courseName
        },function(data){
            $alert({
                content: 'Course successfully created.',
                placement: 'right',
                type: 'success',
                duration: 5
            });
            $scope.createCourseModal();
            $state.reload();
        },function(error){
            $alert({
                content: 'There was an error. Please try again later.',
                placement: 'right',
                type: 'danger',
                duration: 5
            });
        });
    };

});

angular.module('Codegurukul')
    .controller('AdminUsersCtrl', function($scope, $alert, $rootScope, Admin, $state) {

    Admin.users.query(function(data) {
        $scope.users = data;
        console.log($scope.users);
    })
    
    $scope.goToAllCourses = function(){
        $state.go('admin-all-courses');
    };


});