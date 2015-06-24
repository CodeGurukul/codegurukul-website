angular.module('Codegurukul')
    .factory('User', function($resource) {
    var User = {
        default: $resource('/api/user/:uslug', {
            uslug: '@uslug'
        },{
            'update': { method:'PUT' }
        }),
        resendEmail: $resource('/api/auth/signup/resend'),
        verify: $resource('/api/auth/signup/verification'),
        invoiceGen: $resource('/api/user/:uslug/invoicePdf')
    }
    return User;
});

