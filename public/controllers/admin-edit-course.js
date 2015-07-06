angular.module('Codegurukul')
  .controller('AdminEditCourseCtrl', function($scope, $alert, $rootScope, Admin, $stateParams, $state, $window, FileUploader) {

  Admin.course.get({
    cslug: $stateParams.course

  }, function(data) {
    $scope.course = data;
    //        console.log(data);
    console.log($scope.course);

    for (var i = 0; i < $scope.course.slots.length; i++) {
      if ($scope.course.slots[i].startDate) {
        var stringDate = $scope.course.slots[i].startDate;
        $scope.course.slots[i].startDate = new Date(stringDate);
      }
    }
  });

  $scope.tabs = [{
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

  $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
    $rootScope.previousState = from.name;
    $rootScope.previousCourseParams = fromParams.course;
    $rootScope.previousSlotParams = fromParams.slot;
  });

  $rootScope.previousPage = function() {
    $state.go($rootScope.previousState, {
      course: $rootScope.previousCourseParams,
      slot: $rootScope.previousSlotParams
    });
  }

  $scope.upload = false;

  var uploader = $scope.uploader = new FileUploader({
    url: '/api/admin/courses/' + $stateParams.course + '/image',
    method: 'PUT',
    headers: {
      Authorization: $window.localStorage.token
    }
  });

  /*angular-file-upload start*/

  // FILTERS

  uploader.filters.push({
    name: 'imageFilter',
    fn: function(item /*{File|FileLikeObject}*/ , options) {
      var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
      if ('|jpg|png|jpeg|bmp|gif|'.indexOf(type) == -1) {
        $alert({
          content: 'Please select an image file.',
          placement: 'right',
          type: 'danger',
          duration: 5
        });
        return false;
      };
      if (item.size > 1000000) {
        $alert({
          content: 'Image cannot be more than 1MB',
          placement: 'right',
          type: 'danger',
          duration: 5
        });
        return false;
      }
      return true;
    }
  });

  uploader.filters.push({
    name: 'singleFileFilter',
    fn: function(item /*{File|FileLikeObject}*/ , options) {
      if (this.queue.length == 1) {
        this.clearQueue();
      }
      return true;
    }
  });

  uploader.onBeforeUploadItem = function(item) {
    formData = [{
      cslug: $stateParams.course,
      type: 'course',
      imageType: "thumb"
    }];
    Array.prototype.push.apply(item.formData, formData);
  };
  uploader.onSuccessItem = function(fileItem, response, status, headers) {
    $alert({
      content: "Course image was successfuly updated.",
      placement: 'right',
      type: 'success',
      duration: 5
    });
    uploader.clearQueue();
    $scope.upload = false;
    Admin.course.get({
      cslug: $stateParams.course
    }, function(data) {
      $scope.course = data;
    });
  };
  uploader.onErrorItem = function(fileItem, response, status, headers) {
    console.log(response);
    console.log(fileItem);
    console.log(status);
    console.log(headers);
    $alert({
      content: "There was an error please try again later.",
      placement: 'right',
      type: 'danger',
      duration: 5
    });
    uploader.clearQueue();
  };

  /*angular-file-upload end*/


  $scope.deleteCourseImage = function(){
    Admin.image.delete({
      cslug: $stateParams.course,
      type: 'course',
      imageType: 'thumb'
    }, function() {
      $alert({
        content: 'Course image deleted succesfully',
        placement: 'right',
        type: 'success',
        duration: 5
      });
      $scope.deleteModalShown = false;
      Admin.course.get({
        cslug: $stateParams.course
      }, function(data) {
        $scope.course = data;
      });
    }, function(err) {
      $alert({
        content: err.data,
        placement: 'right',
        type: 'danger',
        duration: 5
      })
    })
  }

  $scope.deleteModalShown = false;

  $scope.closeConfirmDelete = function(){
    $scope.deleteModalShown = false;
  }

  $scope.confirmDelete = function(modalInfo){
    $scope.modalInfo = modalInfo;
    $scope.deleteModalShown = !$scope.deleteModalShown
  }

  $scope.delete = function(){
    if($scope.modalInfo == 'course image'){
      $scope.deleteCourseImage();
    }
    else{
      $alert({
        content: 'There was an error. Please try again later',
        placement: 'right',
        type: 'danger',
        duration: 5
      })
    }
  }


});

angular.module('Codegurukul')
  .controller('AdminEditCourseDetailsCtrl', function($scope, $alert, $rootScope, Admin, $stateParams, $window, FileUploader) {


  $scope.updateDetailsTab = function(description, shortDescription, price, tech, duration, inviteOnly, inviteMessage) {
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
    }, function() {
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
    }, function(err) {
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
  .controller('AdminEditCourseMentorsCtrl', function($scope, $alert, $rootScope, Admin, $stateParams, FileUploader, $window) {

  $scope.uploadImage = false;
  $scope.uploadSignature = false;


  var uploader = $scope.uploader = new FileUploader({
    url: '/api/admin/courses/' + $stateParams.course + '/image',
    method: 'PUT',
    headers: {
      Authorization: $window.localStorage.token
    }
  });

  /*angular-file-upload start*/

  // FILTERS

  uploader.filters.push({
    name: 'imageFilter',
    fn: function(item /*{File|FileLikeObject}*/ , options) {
      var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
      if ('|jpg|png|jpeg|bmp|gif|'.indexOf(type) == -1) {
        $alert({
          content: 'Please select an image file.',
          placement: 'right',
          type: 'danger',
          duration: 5
        });
        return false;
      };
      if (item.size > 1000000) {
        $alert({
          content: 'Image cannot be more than 1MB',
          placement: 'right',
          type: 'danger',
          duration: 5
        });
        return false;
      }
      return true;
    }
  });

  uploader.filters.push({
    name: 'singleFileFilter',
    fn: function(item /*{File|FileLikeObject}*/ , options) {
      if (this.queue.length == 1) {
        this.clearQueue();
      }
      return true;
    }
  });

  $scope.sendData = function(id, type) {
    $scope.mentorIdForImage = id;
    $scope.mentorimageType = type;
  }

  uploader.onBeforeUploadItem = function(item) {
    formData = [{
      mentorId: $scope.mentorIdForImage,
      type: 'ment',
      imageType: $scope.mentorimageType
    }];
    Array.prototype.push.apply(item.formData, formData);
  };
  uploader.onSuccessItem = function(fileItem, response, status, headers) {
    $alert({
      content: "Image successfuly updated.",
      placement: 'right',
      type: 'success',
      duration: 5
    });
    uploader.clearQueue();
    $scope.uploadImage = false;
    $scope.uploadSignature = false;
    Admin.course.get({
      cslug: $stateParams.course
    }, function(data) {
      $scope.course = data;
    });
  };
  uploader.onErrorItem = function(fileItem, response, status, headers) {
    console.log(response);
    console.log(fileItem);
    console.log(status);
    console.log(headers);
    $alert({
      content: "There was an error please try again later.",
      placement: 'right',
      type: 'danger',
      duration: 5
    });
    uploader.clearQueue();
  };

  // CALLBACKS

  /*angular-file-upload end*/

  $scope.edit = false;
  $scope.addNewMentor = false;

  $scope.updateMentor = function(id, name, designation, description, facebook, linkedin) {
    Admin.update.save({
      cslug: $stateParams.course,
      type: 'ment',
      mentorId: id,
      name: name,
      designation: designation,
      description: description,
      facebook: facebook,
      linkedin: linkedin
    }, function() {
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
    }, function(err) {
      $alert({
        content: err.data,
        placement: 'right',
        type: 'danger',
        duration: 5
      })
    })
  }

  $scope.deleteMentor = function(id) {
    Admin.update.delete({
      cslug: $stateParams.course,
      type: 'ment',
      mentorId: $scope.mentorIdToDelete
    }, function() {
      $alert({
        content: 'Course mentor deleted succesfully',
        placement: 'right',
        type: 'success',
        duration: 5
      });
      $scope.deleteModalShown = false;
      Admin.course.get({
        cslug: $stateParams.course
      }, function(data) {
        $scope.course = data;
      });
    }, function(err) {
      $alert({
        content: err.data,
        placement: 'right',
        type: 'danger',
        duration: 5
      })
    })
  }


  $scope.deleteMentorImage = function(){
    Admin.image.delete({
      cslug: $stateParams.course,
      type: 'ment',
      mentorId: $scope.mentorIdToDelete,
      imageType: 'dp'
    }, function() {
      $alert({
        content: 'Mentor image deleted succesfully',
        placement: 'right',
        type: 'success',
        duration: 5
      });
      $scope.deleteModalShown = false;
      Admin.course.get({
        cslug: $stateParams.course
      }, function(data) {
        $scope.course = data;
      });
    }, function(err) {
      $alert({
        content: err.data,
        placement: 'right',
        type: 'danger',
        duration: 5
      })
    })
  }

  $scope.deleteMentorSignature = function(){
    Admin.image.delete({
      cslug: $stateParams.course,
      type: 'ment',
      mentorId: $scope.mentorIdToDelete,
      imageType: 'sig'
    }, function() {
      $alert({
        content: 'Mentor image deleted succesfully',
        placement: 'right',
        type: 'success',
        duration: 5
      });
      $scope.deleteModalShown = false;
      Admin.course.get({
        cslug: $stateParams.course
      }, function(data) {
        $scope.course = data;
      });
    }, function(err) {
      $alert({
        content: err.data,
        placement: 'right',
        type: 'danger',
        duration: 5
      })
    })
  }

  $scope.deleteModalShown = false;

  $scope.closeConfirmDelete = function(){
    $scope.deleteModalShown = false;
  }

  $scope.confirmDelete = function(id, modalInfo, imageType){
    $scope.modalInfo = modalInfo;
    $scope.mentorIdToDelete = id;
    $scope.mentorImageToDelete = imageType;
    $scope.deleteModalShown = !$scope.deleteModalShown
  }

  $scope.delete = function(){
    if($scope.modalInfo == 'mentor image'){
      $scope.deleteMentorImage();
    }
    else if($scope.modalInfo == 'mentor signature'){
      $scope.deleteMentorSignature();
    }
    else if($scope.modalInfo == 'mentor'){
      $scope.deleteMentor();
    }
    else{
      $alert({
        content: 'There was an error. Please try again later',
        placement: 'right',
        type: 'danger',
        duration: 5
      })
    }
  }



});


angular.module('Codegurukul')
  .controller('AdminEditCourseTestimonialsCtrl', function($scope, $alert, $rootScope, Admin, $stateParams, $window, FileUploader, $state) {

  //  $scope.showImageHelpInfo = false;
  $scope.upload = false;

  var uploader = $scope.uploader = new FileUploader({
    url: '/api/admin/courses/' + $stateParams.course + '/image',
    method: 'PUT',
    headers: {
      Authorization: $window.localStorage.token
    }
  });

  /*angular-file-upload start*/

  // FILTERS

  uploader.filters.push({
    name: 'imageFilter',
    fn: function(item /*{File|FileLikeObject}*/ , options) {
      var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
      if ('|jpg|png|jpeg|bmp|gif|'.indexOf(type) == -1) {
        $alert({
          content: 'Please select an image file.',
          placement: 'right',
          type: 'danger',
          duration: 5
        });
        return false;
      };
      if (item.size > 1000000) {
        $alert({
          content: 'Image cannot be more than 1MB',
          placement: 'right',
          type: 'danger',
          duration: 5
        });
        return false;
      }
      return true;
    }
  });

  uploader.filters.push({
    name: 'singleFileFilter',
    fn: function(item /*{File|FileLikeObject}*/ , options) {
      if (this.queue.length == 1) {
        this.clearQueue();
      }
      return true;
    }
  });

  $scope.sendData = function(id) {
    $scope.testimonialIdForImage = id;
  }

  uploader.onBeforeUploadItem = function(item) {
    formData = [{
      cslug: $stateParams.course,
      testimonialId: $scope.testimonialIdForImage,
      type: 'test'
    }];
    Array.prototype.push.apply(item.formData, formData);
  };
  uploader.onSuccessItem = function(fileItem, response, status, headers) {
    $alert({
      content: "Testimonial image was successfuly updated.",
      placement: 'right',
      type: 'success',
      duration: 5
    });
    uploader.clearQueue();
    Admin.course.get({
      cslug: $stateParams.course
    }, function(data) {
      $scope.course = data;
    });
  };
  uploader.onErrorItem = function(fileItem, response, status, headers) {
    console.log(response);
    console.log(fileItem);
    console.log(status);
    console.log(headers);
    $alert({
      content: "There was an error please try again later.",
      placement: 'right',
      type: 'danger',
      duration: 5
    });
    uploader.clearQueue();
  };

  /*angular-file-upload end*/

  $scope.edit = false;
  $scope.addNewTestimonial = false;

  $scope.updateTestimonial = function(id, name, description) {
    Admin.update.save({
      cslug: $stateParams.course,
      type: 'test',
      testimonialId: id,
      name: name,
      description: description
    }, function() {
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
      $scope.showImageHelpInfo = false;
      $scope.addNewTestimonial = false;
      $scope.testimonial.name = '';
      $scope.testimonial.description = '';
      $scope.updateTestimonialForm.$setPristine(true);
    }, function(err) {
      $alert({
        content: err.data,
        placement: 'right',
        type: 'danger',
        duration: 5
      })
    })
  }



  $scope.deleteTestimonial = function(id) {
    Admin.update.delete({
      cslug: $stateParams.course,
      type: 'test',
      testimonialId: $scope.testimonialIdToDelete
    }, function() {
      $alert({
        content: 'Course testimonial deleted succesfully',
        placement: 'right',
        type: 'success',
        duration: 5
      });
      $scope.deleteModalShown = false;
      Admin.course.get({
        cslug: $stateParams.course
      }, function(data) {
        $scope.course = data;
      });
    }, function(err) {
      $alert({
        content: err.data,
        placement: 'right',
        type: 'danger',
        duration: 5
      })
    })
  }


  $scope.deleteTestimonialImage = function(){
    Admin.image.delete({
      cslug: $stateParams.course,
      type: 'test',
      testimonialId: $scope.testimonialIdToDelete
    }, function() {
      $alert({
        content: 'Testimonial image deleted succesfully',
        placement: 'right',
        type: 'success',
        duration: 5
      });
      $scope.deleteModalShown = false;
      Admin.course.get({
        cslug: $stateParams.course
      }, function(data) {
        $scope.course = data;
      });
    }, function(err) {
      $alert({
        content: err.data,
        placement: 'right',
        type: 'danger',
        duration: 5
      })
    })
  }

  $scope.deleteModalShown = false;

  $scope.closeConfirmDelete = function(){
    $scope.deleteModalShown = false;
  }

  $scope.confirmDelete = function(id, modalInfo){
    $scope.modalInfo = modalInfo;
    $scope.testimonialIdToDelete = id;
    $scope.deleteModalShown = !$scope.deleteModalShown
  }

  $scope.delete = function(){
    if($scope.modalInfo == 'testimonial image'){
      $scope.deleteTestimonialImage();
    }
    else if($scope.modalInfo == 'testimonial'){
      $scope.deleteTestimonial();
    }
    else{
      $alert({
        content: 'There was an error. Please try again later',
        placement: 'right',
        type: 'danger',
        duration: 5
      })
    }
  }


});


angular.module('Codegurukul')
  .controller('AdminEditCoursePartnersCtrl', function($scope, $alert, $rootScope, Admin, $stateParams, $window, FileUploader) {

  $scope.upload = false;

  var uploader = $scope.uploader = new FileUploader({
    url: '/api/admin/courses/' + $stateParams.course + '/image',
    method: 'PUT',
    headers: {
      Authorization: $window.localStorage.token
    }
  });

  /*angular-file-upload start*/

  // FILTERS

  uploader.filters.push({
    name: 'imageFilter',
    fn: function(item /*{File|FileLikeObject}*/ , options) {
      var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
      if ('|jpg|png|jpeg|bmp|gif|'.indexOf(type) == -1) {
        $alert({
          content: 'Please select an image file.',
          placement: 'right',
          type: 'danger',
          duration: 5
        });
        return false;
      };
      if (item.size > 1000000) {
        $alert({
          content: 'Image cannot be more than 1MB',
          placement: 'right',
          type: 'danger',
          duration: 5
        });
        return false;
      }
      return true;
    }
  });

  uploader.filters.push({
    name: 'singleFileFilter',
    fn: function(item /*{File|FileLikeObject}*/ , options) {
      if (this.queue.length == 1) {
        this.clearQueue();
      }
      return true;
    }
  });

  $scope.sendData = function(id) {
    $scope.testimonialIdForImage = id; 
  }

  uploader.onBeforeUploadItem = function(item) {
    formData = [{
      cslug: $stateParams.course,
      partnerId: $scope.testimonialIdForImage,
      type: 'part'
    }];
    Array.prototype.push.apply(item.formData, formData);
  };
  uploader.onSuccessItem = function(fileItem, response, status, headers) {
    $alert({
      content: "Partner image was successfuly updated.",
      placement: 'right',
      type: 'success',
      duration: 5
    });
    uploader.clearQueue();
    Admin.course.get({
      cslug: $stateParams.course
    }, function(data) {
      $scope.course = data;
    });
  };
  uploader.onErrorItem = function(fileItem, response, status, headers) {
    console.log(response);
    console.log(fileItem);
    console.log(status);
    console.log(headers);
    $alert({
      content: "There was an error please try again later.",
      placement: 'right',
      type: 'danger',
      duration: 5
    });
    uploader.clearQueue();
  };

  /*angular-file-upload end*/


  $scope.edit = false;
  $scope.addNewPartner = false;

  $scope.updatePartner = function(id, name, link) {
    Admin.update.save({
      cslug: $stateParams.course,
      type: 'part',
      partnerId: id,
      name: name,
      link: link
    }, function() {
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
    }, function(err) {
      $alert({
        content: err.data,
        placement: 'right',
        type: 'danger',
        duration: 5
      })
    })
  };


  $scope.deletePartner = function() {
    Admin.update.delete({
      cslug: $stateParams.course,
      type: 'part',
      partnerId: $scope.partnerIdToDelete
    }, function() {
      $alert({
        content: 'Course partner deleted succesfully',
        placement: 'right',
        type: 'success',
        duration: 5
      });
      $scope.deleteModalShown = false;
      Admin.course.get({
        cslug: $stateParams.course
      }, function(data) {
        $scope.course = data;
      });
    }, function(err) {
      $alert({
        content: err.data,
        placement: 'right',
        type: 'danger',
        duration: 5
      })
    })
  }

  $scope.deletePartnerImage = function(){
    Admin.image.delete({
      cslug: $stateParams.course,
      type: 'part',
      partnerId: $scope.partnerIdToDelete
    }, function() {
      $alert({
        content: 'Partner image deleted succesfully',
        placement: 'right',
        type: 'success',
        duration: 5
      });
      $scope.deleteModalShown = false;
      Admin.course.get({
        cslug: $stateParams.course
      }, function(data) {
        $scope.course = data;
      });
    }, function(err) {
      $alert({
        content: err.data,
        placement: 'right',
        type: 'danger',
        duration: 5
      })
    })
  }

  $scope.deleteModalShown = false;

  $scope.closeConfirmDelete = function(){
    $scope.deleteModalShown = false;
  }

  $scope.confirmDelete = function(id, modalInfo){
    $scope.modalInfo = modalInfo;
    $scope.partnerIdToDelete = id;
    $scope.deleteModalShown = !$scope.deleteModalShown
  }

  $scope.delete = function(){
    if($scope.modalInfo == 'partner image'){
      $scope.deletePartnerImage();
    }
    else if($scope.modalInfo == 'partner'){
      $scope.deletePartner();
    }
    else{
      $alert({
        content: 'There was an error. Please try again later',
        placement: 'right',
        type: 'danger',
        duration: 5
      })
    }
  }

});


angular.module('Codegurukul')
  .controller('AdminEditCourseSlotsCtrl', function($scope, $alert, $rootScope, Admin, $stateParams) {

  console.log("pre-validation "+$scope.currentDate);
  $scope.validation = false;

  $scope.change = function(){
    $scope.validation = true;
    console.log("here");
    if($scope.validation == true){
      $scope.dateCheck = new Date();
      $scope.currentDate = $scope.dateCheck;
      console.log("validation "+$scope.currentDate);
    }
  }


  //  $scope.validation = function(){
  //    $scope.dateCheck = new Date();
  //    $scope.currentDate = $scope.dateCheck;
  //    console.log("validation "+$scope.currentDate);
  //  }


  $scope.edit = false;
  $scope.addNewSlot = false;


  $scope.updateSlot = function(id, city, location, batchSize, startDate, status) {

    Admin.update.save({
      cslug: $stateParams.course,
      type: 'slot',
      slotId: id,
      city: city,
      location: location,
      batchSize: batchSize,
      startDate: startDate,
      status: status
    }, function() {
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
        for (var i = 0; i < $scope.course.slots.length; i++) {
          if ($scope.course.slots[i].startDate) {
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
    }, function(err) {
      $alert({
        content: err.data,
        placement: 'right',
        type: 'danger',
        duration: 5
      })
    })
  }

  $scope.deleteSlot = function(id) {
    console.log($stateParams.course + " " + id);
    Admin.update.delete({
      cslug: $stateParams.course,
      type: 'slot',
      slotId: id
    }, function() {
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
        for (var i = 0; i < $scope.course.slots.length; i++) {
          if ($scope.course.slots[i].startDate) {
            var stringDate = $scope.course.slots[i].startDate;
            $scope.course.slots[i].startDate = new Date(stringDate);
          }
        }
      });
    }, function(err) {
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

  $scope.addNewModule = false;

  $scope.updateContent = function(id, title, description, duration, difficulty) {
    Admin.update.save({
      cslug: $stateParams.course,
      type: 'cont',
      contentId: id,
      title: title,
      description: description,
      duration: duration,
      difficulty: difficulty
    }, function() {
      $alert({
        content: 'Course module updated succesfully',
        placement: 'right',
        type: 'success',
        duration: 5
      });
      $scope.addNewModule = false;
      Admin.course.get({
        cslug: $stateParams.course
      }, function(data) {
        $scope.course = data;
      });
    }, function(err) {
      $alert({
        content: err.data,
        placement: 'right',
        type: 'danger',
        duration: 5
      })
    })
  }


  $scope.deleteModule = function(id) {
    Admin.update.delete({
      cslug: $stateParams.course,
      type: 'cont',
      contentId: $scope.contentIdToDelete
    }, function() {
      $alert({
        content: 'Course module deleted succesfully',
        placement: 'right',
        type: 'success',
        duration: 5
      });
      $scope.deleteModalShown = false;
      Admin.course.get({
        cslug: $stateParams.course
      }, function(data) {
        $scope.course = data;
      });
    }, function(err) {
      $alert({
        content: err.data,
        placement: 'right',
        type: 'danger',
        duration: 5
      })
    })
  }

  $scope.deleteModalShown = false;

  $scope.closeConfirmDelete = function(){
    $scope.deleteModalShown = false;
  }

  $scope.confirmDelete = function(id){
    $scope.contentIdToDelete = id;
    $scope.deleteModalShown = !$scope.deleteModalShown
  }


});


angular.module('Codegurukul')
  .controller('AdminEditCourseStatusCtrl', function($scope, $alert, $rootScope, Admin, $stateParams, $state) {

  $scope.showStatusError = false;

  $scope.updateStatus = function(status) {
    Admin.course.get({
      cslug: $stateParams.course
    }, function(data) {
      $scope.course = data;
    });
    if (status == 'published') {
      if ($scope.course.description && $scope.course.shortDescription && $scope.course.price && $scope.course.tech && $scope.course.duration && $scope.course.slots.length != '0') {
        Admin.update.save({
          cslug: $stateParams.course,
          type: 'stat',
          status: status
        }, function() {
          $alert({
            content: 'Course status updated succesfully',
            placement: 'right',
            type: 'success',
            duration: 5
          })
        }, function(err) {
          $alert({
            content: err.data,
            placement: 'right',
            type: 'danger',
            duration: 5
          })
        })
      } else {
        $scope.showStatusError = true;
      }
    } else if (status == 'unpublished') {
      $scope.showStatusError = false;
      Admin.update.save({
        cslug: $stateParams.course,
        type: 'stat',
        status: status
      }, function() {
        $alert({
          content: 'Course status updated succesfully',
          placement: 'right',
          type: 'success',
          duration: 5
        })
      }, function(err) {
        $alert({
          content: err.data,
          placement: 'right',
          type: 'danger',
          duration: 5
        })
      })
    }


  }

  $scope.deleteCourse = function(id) {
    Admin.update.delete({
      cslug: $stateParams.course,
      type: 'course'
    }, function() {
      $alert({
        content: 'Course deleted succesfully',
        placement: 'right',
        type: 'success',
        duration: 5
      });
      $state.go('admin-all-courses');
    }, function(err) {
      $alert({
        content: err.data,
        placement: 'right',
        type: 'danger',
        duration: 5
      })
    })
  }


});