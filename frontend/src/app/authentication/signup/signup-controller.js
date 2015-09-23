'use strict';

/**
 * @ngdoc function
 * @name SignupController
 * @module triAngularAuthentication
 * @kind function
 *
 * @description
 *
 * Handles sending of signup info to api and response
 */

angular
    .module('triAngularAuthentication')
    .controller('SignupController', ["$scope", "$rootScope", "$state", "$mdToast", "$http", "$filter", "API_CONFIG", "auth.service", "AUTH_EVENTS",

function ($scope, $rootScope, $state, $mdToast, $http, $filter, API_CONFIG, AuthService, AUTH_EVENTS) {
    $scope.user = {
        first_name: 'Ahmed',
        last_name: 'Mahmoud',
        email: 'm.ahmed@company.com',
        password: '123456789',
        confirm: '123456789'
    };

    $scope.signupClick = function () {
        $scope.showLoading = true;
        $http({
            method: 'POST',
            url: API_CONFIG.serverUrl + 'register',
            data: $scope.user
        }).
        success(function (data) {
            $scope.showLoading = false;
            $mdToast.show(
                $mdToast.simple()
                .content($filter('translate')('SIGNUP.MESSAGES.SUCCESSFULLY'))
                .position('bottom right')
                //.action($filter('translate')('SIGNUP.MESSAGES.LOGIN_NOW'))
                .highlightAction(true)
                .hideDelay(0)
            ).then(function () {

            });
            AuthService.setCredentials($scope.user.email, $scope.user.password, data.data.user, data.data.token);
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        }).
        error(function () {
            $scope.showLoading = false;
            $mdToast.show(
                $mdToast.simple()
                .content($filter('translate')('SIGNUP.MESSAGES.NO_SIGNUP'))
                .position('bottom right')
                .hideDelay(5000)
            );
        });
    }
}
    ]);