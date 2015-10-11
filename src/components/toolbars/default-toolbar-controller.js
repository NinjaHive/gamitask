'use strict';

/**
 * @ngdoc function
 * @name EmailToolbarController
 * @module triAngularEmail
 * @kind function
 *
 * @description
 *
 * Handles all actions for email toolbar
 */

angular.module('triAngular')
.controller('DefaultToolbarController', ['$scope', '$translate', '$state', '$location', '$element', '$mdUtil', '$mdSidenav', '$timeout', 'SideMenu', 'APP', 'auth.service',
    function ($scope, $translate, $state, $location, $element, $mdUtil, $mdSidenav, $timeout, SideMenu, APP, AuthService) {
        $scope.menu = SideMenu.getMenu();

        $scope.toolbarTypeClass = function () {
            return $scope.extraClass;
        };

        $scope.$on('$stateChangeStart', initToolbar);

        function initToolbar() {
            $element.css('background-image', '');

            if ($state.current.data !== undefined) {
                if ($state.current.data.toolbar !== undefined) {
                    if ($state.current.data.toolbar.extraClass !== false) {
                        $scope.extraClass = $state.current.data.toolbar.extraClass;
                    }

                    if ($state.current.data.toolbar.background) {
                        $element.css('background-image', 'url(' + $state.current.data.toolbar.background + ')');
                    }
                }
            }
        }

        initToolbar();

        $scope.switchLanguage = function (languageCode) {
            $translate.use(languageCode).then(function () {
            });
        };

        $scope.openSideNav = function (navID) {
            $mdUtil.debounce(function () {
                $mdSidenav(navID).toggle();
            }, 300)();
        };

        $scope.toggleNotificationsTab = function (tab) {
            $scope.$parent.$broadcast('triSwitchNotificationTab', tab);
            $scope.openSideNav('notifications');
        };

        $scope.profile = function () {
            $state.go('admin-panel.default.profile');
        };

        $scope.logout = function () {
            AuthService.clearCredentials();
            $location.path('/login');
        };

        $scope.$on('newMailNotification', function () {
            $scope.emailNew = true;
        });

        // until we can get languages from angular-translate use APP constant
        $scope.languages = APP.languages;
    }]);