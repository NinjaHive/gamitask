'use strict';

/**
 * @ngdoc function
 * @name LoginCtrl
 * @module triAngularAuthentication
 * @kind function
 *
 * @description
 *
 * Handles login form submission and response
 */


angular
    .module('triAngularAuthentication')
    .controller('LoginController', ['$scope', 'auth.service', function ($scope, authService) {
        $scope.socialLogins = [{
            icon: 'fa fa-twitter',
            color: '#5bc0de',
            url: '#'
        }, {
            icon: 'fa fa-facebook',
            color: '#337ab7',
            url: '#'
        }, {
            icon: 'fa fa-google-plus',
            color: '#e05d6f',
            url: '#'
        }, {
            icon: 'fa fa-linkedin',
            color: '#337ab7',
            url: '#'
        }];
        // create blank user variable for login form
        $scope.user = {
            email: 'test@company.com',
            password: 'demo'
        };
        // controller to handle login check
        $scope.loginClick = function () {
            $scope.showLoading = true;
            var credentials = {};
            credentials.email = $scope.user.email;
            credentials.password = Base64.encode($scope.user.password);
            authService.login(credentials).then(function () {
                $scope.showLoading = false;
            });
            // $state.go('admin-panel.default.introduction');
        };
    }]);

