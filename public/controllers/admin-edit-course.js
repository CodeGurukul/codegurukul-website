angular.module('Codegurukul')
    .controller('AdminEditCourseCtrl', function($scope, $alert, $rootScope, Admin, $stateParams) {

    Admin.course.get({
        cslug: $stateParams.course

    }, function(data) {
        $scope.course = data;
        //        console.log(data);
        console.log($scope.course);

        for(var i=0; i< $scope.course.slots.length; i++){
            if($scope.course.slots[i].startDate){
                var stringDate = $scope.course.slots[i].startDate;
                $scope.course.slots[i].startDate = new Date(stringDate);
            }
        }
    });

    $scope.tabs =  [{
        title: 'Details',
        page: '../views/edit-course-partials/details.html'
    }, {
        title: 'Mentors',
        page: '../views/edit-course-partials/mentors.html'
    }, {
        title: 'Testimonials',
        page: '../views/edit-course-partials/testimonials.html'
    }, {
        title: 'Slots',
        page: '../views/edit-course-partials/slots.html'
    }, {
        title: 'Partners',
        page: '../views/edit-course-partials/partners.html'
    }, {
        title: 'Content',
        page: '../views/edit-course-partials/content.html'
    }, {
        title: 'Status',
        page: '../views/edit-course-partials/status.html'
    }];
    $scope.tabs.activeTab = 0;


});

angular.module('Codegurukul')
    .controller('AdminEditCourseDetailsCtrl', function($scope, $alert, $rootScope, Admin, $stateParams) {

    $scope.updateDetailsTab = function(description, shortDescription, price, tech, duration, inviteOnly, inviteMessage){
        Admin.update.save({
            cslug: $stateParams.course,
            type: 'det',
            description: description,
            shortDescription: shortDescription,
            price: price,
            tech: tech,
            duration: duration,
            inviteOnly: inviteOnly,
            inviteMessage: inviteMessage
        },function(){
            $alert({
                content: 'Course details updated succesfully',
                placement: 'right',
                type: 'success',
                duration: 5
            });
            Admin.course.get({
                cslug: $stateParams.course
            }, function(data) {
                $scope.course = data;
            });
        },function(err){
            $alert({
                content: err.data,
                placement: 'right',
                type: 'danger',
                duration: 5
            });
            Admin.course.get({
                cslug: $stateParams.course
            }, function(data) {
                $scope.course = data;
            });
        })
    }

});


angular.module('Codegurukul')
    .controller('AdminEditCourseMentorsCtrl', function($scope, $alert, $rootScope, Admin, $stateParams) {

    $scope.edit = false;
    $scope.addNewMentor = false;

    $scope.updateMentor = function(id, name, designation, description, facebook, linkedin){
        Admin.update.save({
            cslug: $stateParams.course,
            type: 'ment',
            mentorId: id,
            name: name,
            designation: designation,
            description: description,
            facebook: facebook,
            linkedin: linkedin
        },function(){
            $alert({
                content: 'Course mentor updated succesfully',
                placement: 'right',
                type: 'success',
                duration: 5
            });
            Admin.course.get({
                cslug: $stateParams.course
            }, function(data) {
                $scope.course = data;
            });
            $scope.addNewMentor = false;
            $scope.mentor.name = '';
            $scope.mentor.designation = '';
            $scope.mentor.description = '';
            $scope.mentor.facebook = '';
            $scope.mentor.linkedin = '';
            $scope.updateMentorForm.$setPristine(true);
        },function(err){
            $alert({
                content: err.data,
                placement: 'right',
                type: 'danger',
                duration: 5
            })
        })
    }

    $scope.deleteMentor = function(id){
        Admin.update.delete({
            cslug: $stateParams.course,
            type: 'ment',
            mentorId: id
        },function(){
            $alert({
                content: 'Course mentor deleted succesfully',
                placement: 'right',
                type: 'success',
                duration: 5
            });
            Admin.course.get({
                cslug: $stateParams.course
            }, function(data) {
                $scope.course = data;
            });
        },function(err){
            $alert({
                content: err.data,
                placement: 'right',
                type: 'danger',
                duration: 5
            })
        })
    }


});


angular.module('Codegurukul')
    .controller('AdminEditCourseTestimonialsCtrl', function($scope, $alert, $rootScope, Admin, $stateParams) {

    $scope.edit = false;
    $scope.addNewTestimonial = false;

    $scope.updateTestimonial = function(id, name, description){
        Admin.update.save({
            cslug: $stateParams.course,
            type: 'test',
            testimonialId: id,
            name: name,
            description: description
        },function(){
            $alert({
                content: 'Course testimonial updated succesfully',
                placement: 'right',
                type: 'success',
                duration: 5
            });
            Admin.course.get({
                cslug: $stateParams.course
            }, function(data) {
                $scope.course = data;
            });
            $scope.addNewTestimonial = false;
            $scope.testimonial.name = '';
            $scope.testimonial.description = '';
            $scope.updateTestimonialForm.$setPristine(true);
        },function(err){
            $alert({
                content: err.data,
                placement: 'right',
                type: 'danger',
                duration: 5
            })
        })
    }



    $scope.deleteTestimonial = function(id){
        Admin.update.delete({
            cslug: $stateParams.course,
            type: 'test',
            testimonialId: id
        },function(){
            $alert({
                content: 'Course testimonial deleted succesfully',
                placement: 'right',
                type: 'success',
                duration: 5
            });
            Admin.course.get({
                cslug: $stateParams.course
            }, function(data) {
                $scope.course = data;
            });
        },function(err){
            $alert({
                content: err.data,
                placement: 'right',
                type: 'danger',
                duration: 5
            })
        })
    }


});


angular.module('Codegurukul')
    .controller('AdminEditCoursePartnersCtrl', function($scope, $alert, $rootScope, Admin, $stateParams) {

    $scope.edit = false;
    $scope.addNewPartner = false;

    $scope.updatePartner = function(id, name, link){
        Admin.update.save({
            cslug: $stateParams.course,
            type: 'part',
            partnerId: id,
            name: name,
            link: link
        },function(){
            $alert({
                content: 'Course partner updated succesfully',
                placement: 'right',
                type: 'success',
                duration: 5
            });
            Admin.course.get({
                cslug: $stateParams.course
            }, function(data) {
                $scope.course = data;
            });
            $scope.addNewPartner = false;
            $scope.partner.name = '';
            $scope.partner.link = '';
            $scope.updatePartnerForm.$setPristine(true);
        },function(err){
            $alert({
                content: err.data,
                placement: 'right',
                type: 'danger',
                duration: 5
            })
        })
    };


    $scope.deletePartner = function(id){
        Admin.update.delete({
            cslug: $stateParams.course,
            type: 'part',
            partnerId: id
        },function(){
            $alert({
                content: 'Course partner deleted succesfully',
                placement: 'right',
                type: 'success',
                duration: 5
            });
            Admin.course.get({
                cslug: $stateParams.course
            }, function(data) {
                $scope.course = data;
            });
        },function(err){
            $alert({
                content: err.data,
                placement: 'right',
                type: 'danger',
                duration: 5
            })
        })
    }


});


angular.module('Codegurukul')
    .controller('AdminEditCourseSlotsCtrl', function($scope, $alert, $rootScope, Admin, $stateParams) {

    $scope.currentDate = new Date();
    $scope.edit = false;
    $scope.addNewSlot = false;


    $scope.updateSlot = function(id, city, location, batchSize, startDate, status){

        Admin.update.save({
            cslug: $stateParams.course,
            type: 'slot',
            slotId: id,
            city: city,
            location: location,
            batchSize: batchSize,
            startDate: startDate,
            status: status
        },function(){
            $alert({
                content: 'Course slot updated succesfully',
                placement: 'right',
                type: 'success',
                duration: 5
            });
            Admin.course.get({
                cslug: $stateParams.course
            }, function(data) {
                $scope.course = data;
                for(var i=0; i< $scope.course.slots.length; i++){
                    if($scope.course.slots[i].startDate){
                        var stringDate = $scope.course.slots[i].startDate;
                        $scope.course.slots[i].startDate = new Date(stringDate);
                    }
                }
            });
            $scope.addNewSlot = false;
            $scope.slot.city = '';
            $scope.slot.location = '';
            $scope.slot.batchSize = '';
            $scope.slot.startDate = '';
            $scope.slot.status = '';
            $scope.updateSlotForm.$setPristine(true);
        },function(err){
            $alert({
                content: err.data,
                placement: 'right',
                type: 'danger',
                duration: 5
            })
        })
    }

    $scope.deleteSlot = function(id){
        console.log($stateParams.course+" "+id);
        Admin.update.delete({
            cslug: $stateParams.course,
            type: 'slot',
            slotId: id
        },function(){
            $alert({
                content: 'Course slot deleted succesfully',
                placement: 'right',
                type: 'success',
                duration: 5
            });
            Admin.course.get({
                cslug: $stateParams.course
            }, function(data) {
                $scope.course = data;
                for(var i=0; i< $scope.course.slots.length; i++){
                    if($scope.course.slots[i].startDate){
                        var stringDate = $scope.course.slots[i].startDate;
                        $scope.course.slots[i].startDate = new Date(stringDate);
                    }
                }
            });
        },function(err){
            $alert({
                content: err.data,
                placement: 'right',
                type: 'danger',
                duration: 5
            })
        })
    }

});


angular.module('Codegurukul')
    .controller('AdminEditCourseContentCtrl', function($scope, $alert, $rootScope, Admin, $stateParams) {

    $scope.updateContent = function(id, title, description, duration, difficulty){
        Admin.update.save({
            cslug: $stateParams.course,
            type: 'cont',
            contentId: id,
            title: title,
            description: description,
            duration: duration,
            difficulty: difficulty
        },function(){
            $alert({
                content: 'Course module updated succesfully',
                placement: 'right',
                type: 'success',
                duration: 5
            });
            Admin.course.get({
                cslug: $stateParams.course
            }, function(data) {
                $scope.course = data;
            });
        },function(err){
            $alert({
                content: err.data,
                placement: 'right',
                type: 'danger',
                duration: 5
            })
        })
    }


    $scope.deleteModule = function(id){
        Admin.update.delete({
            cslug: $stateParams.course,
            type: 'cont',
            contentId: id
        },function(){
            $alert({
                content: 'Course module deleted succesfully',
                placement: 'right',
                type: 'success',
                duration: 5
            });
            Admin.course.get({
                cslug: $stateParams.course
            }, function(data) {
                $scope.course = data;
            });
        },function(err){
            $alert({
                content: err.data,
                placement: 'right',
                type: 'danger',
                duration: 5
            })
        })
    }


});


angular.module('Codegurukul')
    .controller('AdminEditCourseStatusCtrl', function($scope, $alert, $rootScope, Admin, $stateParams, $state) {

    $scope.showStatusError = false;

    $scope.updateStatus = function(status){
        Admin.course.get({
            cslug: $stateParams.course
        }, function(data) {
            $scope.course = data;
        });
        if(status == 'published'){
            if($scope.course.description && $scope.course.shortDescription && $scope.course.price && $scope.course.tech && $scope.course.duration && $scope.course.slots.length!='0'){
                Admin.update.save({
                    cslug: $stateParams.course,
                    type: 'stat',
                    status: status
                },function(){
                    $alert({
                        content: 'Course status updated succesfully',
                        placement: 'right',
                        type: 'success',
                        duration: 5
                    })
                },function(err){
                    $alert({
                        content: err.data,
                        placement: 'right',
                        type: 'danger',
                        duration: 5
                    })
                }) 
            }
            else{
                $scope.showStatusError = true;
            }
        }
        else if(status == 'unpublished'){
            Admin.update.save({
                cslug: $stateParams.course,
                type: 'stat',
                status: status
            },function(){
                $alert({
                    content: 'Course status updated succesfully',
                    placement: 'right',
                    type: 'success',
                    duration: 5
                })
            },function(err){
                $alert({
                    content: err.data,
                    placement: 'right',
                    type: 'danger',
                    duration: 5
                })
            }) 
        }


    }

    $scope.deleteCourse = function(id){
        Admin.update.delete({
            cslug: $stateParams.course,
            type: 'course'
        },function(){
            $alert({
                content: 'Course deleted succesfully',
                placement: 'right',
                type: 'success',
                duration: 5
            });
            $state.go('admin-all-courses');
        },function(err){
            $alert({
                content: err.data,
                placement: 'right',
                type: 'danger',
                duration: 5
            })
        })
    }


});