angular.module("triAngularAuthentication")
.factory('auth.service', ['$http', '$rootScope', '$cookieStore', 'AUTH_EVENTS', 'API_CONFIG',
function ($http, $rootScope, $cookieStore, AUTH_EVENTS, API_CONFIG) {
    var authService = {};

    //Login Method
    authService.login = function (credentials) {
        return $http({
            method: "POST",
            url: API_CONFIG.serverUrl + "login",
            data: credentials
        })
       .then(function (res) {
           if (res.data.data) {
               authService.setCredentials(credentials.email, credentials.password, res.data.data.user, res.data.data.token);
               $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
           }
           else
               $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, res.data.errorMessage);
       }, function (res) {
           $rootScope.$broadcast(AUTH_EVENTS.loginFailed, res);
       });
    };
    //SetCredentials
    authService.setCredentials = function (email, password, userInfo, token) {

        $rootScope.globals = {
            currentUser: {
                userInfo: userInfo,
                token: token
            }
        };

        $http.defaults.headers.common['Authorization'] = 'Basic ' + token; // jshint ignore:line
        $cookieStore.put('globals', $rootScope.globals);
    }

    authService.clearCredentials = function () {
        $rootScope.globals = {};
        $cookieStore.remove('globals');
        $http.defaults.headers.common.Authorization = 'Basic ';
    }

    authService.isAuthenticated = function () {
        return  $cookieStore.get('globals').currentUser.userInfo;
    };

    authService.isAuthorized = function (authorizedRoles) {
        return (authService.isAuthenticated() &&
          authorizedRoles.indexOf($rootScope.globals.currentUser.userInfo.role) !== -1);
    };

    return authService;
}]);
/*.factory('AuthInterceptor', ['$rootScope', '$q', 'AUTH_EVENTS',
    function ($rootScope, $q, AUTH_EVENTS) {
        return {
            responseError: function (response) {
                $rootScope.$broadcast({
                    401: AUTH_EVENTS.notAuthenticated,
                    403: AUTH_EVENTS.notAuthorized,
                    419: AUTH_EVENTS.sessionTimeout,
                    440: AUTH_EVENTS.sessionTimeout
                }[response.status], response);
                return $q.reject(response);
            }
        };
    }])
    */