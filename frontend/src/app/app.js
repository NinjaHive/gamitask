'use strict';

angular.module('triAngular', [
    // inject angular modules
    'ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngMaterial',
    // inject extra 3rd party angular modules
    'ui.router', 'pascalprecht.translate', 'LocalStorageModule', 'googlechart', 'chart.js', 'linkify', 'ui.calendar', 'angularMoment', 'textAngular', 'uiGmapgoogle-maps', 'hljs',
    // inject our own triangular modules
    'triAngularIntroduction', 'triAngularUI', 'triAngularAuthentication', 'triAngularDashboards', 'triAngularEmail', 'triAngularMenuLevels', 'triAngularElements', 'triAngularForms', 'triAngularCharts', 'triAngularMaps', 'triAngularExtras', 'triAngularTodo', 'triAngularCalendar'
])
.constant('APP', {
    name: 'GamiTask',
    logo: 'assets/images/logo.png',
    version: '1.0.0',
    languages: [{
        name: 'LANGUAGES.ENGLISH',
        key: 'en'
    }, {
        name: 'LANGUAGES.FRENCH',
        key: 'fr'
    }],
    defaultSkin: 'cyan-cloud'
})
.constant('API_CONFIG', {
    'url': 'http://triangular-api.oxygenna.com/',
    'serverUrl': "http://glacial-savannah-5405.herokuapp.com/"
})
/**
 *  SETUP TRANSLATIONS
 */
.config(function ($stateProvider, $urlRouterProvider, $translateProvider, $translatePartialLoaderProvider, localStorageServiceProvider, APP) {
    /**
     *  each module loads its own translation file - making it easier to create translations
     *  also translations are not loaded when they aren't needed
     *  each module will have a il8n folder that will contain its translations
     */
    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: '{part}/il8n/{lang}.json'
    });

    $translatePartialLoaderProvider.addPart('app');

    // make sure all values used in translate are sanitized for security
    $translateProvider.useSanitizeValueStrategy('sanitize');

    // cache translation files to save load on server
    $translateProvider.useLoaderCache(true);

    // get languages set in APP constant
    var languageKeys = [];
    for (var lang in APP.languages) {
        languageKeys.push(APP.languages[lang].key);
    }
    /**
     *  try to detect the users language by checking the following
     *      navigator.language
     *      navigator.browserLanguage
     *      navigator.systemLanguage
     *      navigator.userLanguage
     */
    $translateProvider
    .registerAvailableLanguageKeys(languageKeys, {
        'en_US': 'en',
        'en_UK': 'en'
    })
    .use('en');

    // store the users language preference in a cookie
    $translateProvider.useLocalStorage();

    // setup public states & routes
    $stateProvider
    .state('admin-panel', {
        abstract: true,
        templateUrl: 'app/layouts/admin-panel/admin-panel.tmpl.html',
        data: {
            toolbar: {
                extraClass: '',
                background: false,
                shrink: true
            },
        }
    })

    .state('admin-panel.default', {
        abstract: true,
        views: {
            sidebarLeft: {
                templateUrl: 'components/sidebar-left/sidebar-left.tmpl.html',
                controller: 'SidebarLeftController'
            },
            sidebarRight: {
                templateUrl: 'components/sidebar-right/sidebar-right.tmpl.html',
                controller: 'SidebarRightController'
            },
            toolbar: {
                templateUrl: 'components/toolbars/default.tmpl.html',
                controller: 'DefaultToolbarController'
            },
            content: {
                template: '<div id="admin-panel-content-view" flex ui-view></div>'
            }
        },
    })

    .state('admin-panel-no-scroll', {
        abstract: true,
        templateUrl: 'app/layouts/no-scroll/no-scroll.tmpl.html',
        data: {
            toolbar: {
                extraClass: '',
                background: false,
                shrink: true
            },
        }
    })

    .state('admin-panel-no-scroll.default', {
        abstract: true,
        views: {
            sidebarLeft: {
                templateUrl: 'components/sidebar-left/sidebar-left.tmpl.html',
                controller: 'SidebarLeftController'
            },
            sidebarRight: {
                templateUrl: 'components/sidebar-right/sidebar-right.tmpl.html',
                controller: 'SidebarRightController'
            },
            toolbar: {
                templateUrl: 'components/toolbars/default.tmpl.html',
                controller: 'DefaultToolbarController'
            },
            content: {
                template: '<div flex ui-view layout="column"></div>'
            }
        },
    })

    .state('404', {
        url: '/404',
        templateUrl: '404.tmpl.html',
        controller: function ($scope, $state, APP) {
            $scope.app = APP;

            $scope.goHome = function () {
                $state.go('admin-panel.default.dashboard-analytics');
            };
        }
    })

    .state('500', {
        url: '/500',
        templateUrl: '500.tmpl.html',
        controller: function ($scope, $state, APP) {
            $scope.app = APP;

            $scope.goHome = function () {
                $state.go('admin-panel.default.dashboard-analytics');
            };
        }
    });

    // set default routes when no path specified
    //$urlRouterProvider.when('', '/dashboards/analytics');
    //$urlRouterProvider.when('/', '/dashboards/analytics');
    $urlRouterProvider.when('', '/login');
    $urlRouterProvider.when('/', '/login');

    // always goto 404 if route not found
    $urlRouterProvider.otherwise('/404');

    // set prefix for local storage
    localStorageServiceProvider
    .setPrefix('triAngular')
    .setStorageType('sessionStorage');
})
/**
 *  PALETTES & THEMES & SKINS oh my.....
 */
.config(function ($mdThemingProvider, triThemingProvider, triSkinsProvider, APP) {
    /**
     *  PALETTES
     */
    $mdThemingProvider.definePalette('white', {
        '50': 'ffffff',
        '100': 'ffffff',
        '200': 'ffffff',
        '300': 'ffffff',
        '400': 'ffffff',
        '500': 'ffffff',
        '600': 'ffffff',
        '700': 'ffffff',
        '800': 'ffffff',
        '900': 'ffffff',
        'A100': 'ffffff',
        'A200': 'ffffff',
        'A400': 'ffffff',
        'A700': 'ffffff',
        'contrastDefaultColor': 'dark',    // whether, by default, text (contrast)
    });

    $mdThemingProvider.definePalette('black', {
        '50': 'e1e1e1',
        '100': 'b6b6b6',
        '200': '8c8c8c',
        '300': '646464',
        '400': '4d4d4d',
        '500': '3a3a3a',
        '600': '2f2f2f',
        '700': '232323',
        '800': '1a1a1a',
        '900': '121212',
        'A100': 'ffffff',
        'A200': 'ffffff',
        'A400': 'ffffff',
        'A700': 'ffffff',
        'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
    });

    /**
     *  SKINS
     */

    // CYAN CLOUD SKIN
    triThemingProvider.theme('cyan')
    .primaryPalette('cyan')
    .accentPalette('amber')
    .warnPalette('deep-orange');

    triThemingProvider.theme('white-cyan')
    .primaryPalette('white')
    .accentPalette('cyan', {
        'default': '500'
    })
    .warnPalette('deep-orange');

    triSkinsProvider.skin('cyan-cloud', 'Cyan Cloud')
    .sidebarTheme('cyan')
    .toolbarTheme('white-cyan')
    .logoTheme('cyan')
    .contentTheme('cyan');

    // RED DWARF SKIN
    triThemingProvider.theme('red')
    .primaryPalette('red')
    .accentPalette('amber')
    .warnPalette('purple');

    triThemingProvider.theme('white-red')
    .primaryPalette('white')
    .accentPalette('red', {
        'default': '500'
    })
    .warnPalette('purple');

    triSkinsProvider.skin('red-dwarf', 'Red Dwarf')
    .sidebarTheme('red')
    .toolbarTheme('white-red')
    .logoTheme('red')
    .contentTheme('red');

    // PLUMB PURPLE SKIN
    triThemingProvider.theme('purple')
    .primaryPalette('purple')
    .accentPalette('deep-orange')
    .warnPalette('amber');

    triThemingProvider.theme('white-purple')
    .primaryPalette('white')
    .accentPalette('purple', {
        'default': '400'
    })
    .warnPalette('deep-orange');

    triSkinsProvider.skin('plumb-purple', 'Plumb Purple')
    .sidebarTheme('purple')
    .toolbarTheme('white-purple')
    .logoTheme('purple')
    .contentTheme('purple');

    // DARK KNIGHT SKIN
    triThemingProvider.theme('dark')
    .primaryPalette('black')
    .accentPalette('amber')
    .warnPalette('deep-orange')
    .dark();

    triSkinsProvider.skin('dark-knight', 'Dark Knight')
    .sidebarTheme('dark')
    .toolbarTheme('dark')
    .logoTheme('dark')
    .contentTheme('dark');

    // BATTLESHIP GREY SKIN
    triThemingProvider.theme('blue-grey')
    .primaryPalette('blue-grey')
    .accentPalette('amber')
    .warnPalette('orange');

    triThemingProvider.theme('white-blue-grey')
    .primaryPalette('white')
    .accentPalette('blue-grey', {
        'default': '400'
    })
    .warnPalette('orange');

    triSkinsProvider.skin('battleship-grey', 'Battleship Grey')
    .sidebarTheme('blue-grey')
    .toolbarTheme('white-blue-grey')
    .logoTheme('blue-grey')
    .contentTheme('blue-grey');

    // ZESTY ORANGE SKIN
    triThemingProvider.theme('orange')
    .primaryPalette('orange', {
        'default': '800'
    })
    .accentPalette('lime')
    .warnPalette('amber');

    triThemingProvider.theme('white-orange')
    .primaryPalette('white')
    .accentPalette('orange', {
        'default': '500'
    })
    .warnPalette('lime');

    triSkinsProvider.skin('zesty-orange', 'Zesty Orange')
    .sidebarTheme('orange')
    .toolbarTheme('white-orange')
    .logoTheme('orange')
    .contentTheme('orange');


    // INDIGO ISLAND SKIN
    triThemingProvider.theme('indigo')
    .primaryPalette('indigo', {
        'default': '600'
    })
    .accentPalette('red')
    .warnPalette('lime');

    triSkinsProvider.skin('indigo-island', 'Indigo Island')
    .sidebarTheme('indigo')
    .toolbarTheme('indigo')
    .logoTheme('indigo')
    .contentTheme('indigo');

    // KERMIT GREEN SKIN
    triThemingProvider.theme('light-green')
    .primaryPalette('light-green', {
        'default': '400'
    })
    .accentPalette('amber')
    .warnPalette('deep-orange');

    triThemingProvider.theme('white-light-green')
    .primaryPalette('white')
    .accentPalette('light-green', {
        'default': '400'
    })
    .warnPalette('deep-orange');

    triSkinsProvider.skin('kermit-green', 'Kermit Green')
    .sidebarTheme('light-green')
    .toolbarTheme('white-light-green')
    .logoTheme('light-green')
    .contentTheme('light-green');


    /**
     *  FOR DEMO PURPOSES ALLOW SKIN TO BE SAVED IN A COOKIE
     *  This overrides any skin set in a call to triSkinsProvider.setSkin if there is a cookie
     *  REMOVE LINE BELOW FOR PRODUCTION SITE
     */
    triSkinsProvider.useSkinCookie(true);

    /**
     *  SET DEFAULT SKIN
     */
    triSkinsProvider.setSkin(APP.defaultSkin);
})
.config(function (ChartJsProvider) {
    // Configure all charts to use material design colors
    ChartJsProvider.setOptions({
        colours: [
            '#4285F4',    // blue
            '#DB4437',    // red
            '#F4B400',    // yellow
            '#0F9D58',    // green
            '#AB47BC',    // purple
            '#00ACC1',    // light blue
            '#FF7043',    // orange
            '#9E9D24',    // browny yellow
            '#5C6BC0'     // dark blue
        ],
        responsive: true,
    });
})
     .constant('AUTH_EVENTS', {
         loginSuccess: 'auth-login-success',
         loginFailed: 'auth-login-failed',
         logoutSuccess: 'auth-logout-success',
         sessionTimeout: 'auth-session-timeout',
         notAuthenticated: 'auth-not-authenticated',
         notAuthorized: 'auth-not-authorized',
         changeRoute: 'auth-change-route'
     })
    .constant('USER_ROLES', [
        'Anomynous',
        'Admin',
        'Player'
    ])



.run(['$rootScope', '$window', '$state', '$location', '$cookieStore', '$timeout', '$http', 'AUTH_EVENTS', 'auth.service',
function ($rootScope, $window, $state, $location, $cookieStore, $timeout, $http, AUTH_EVENTS, AuthService) {
    // keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        $location.path('/dashboards/analytics');
    }

    //Assigning Event Listener to AUTH_Events
    $rootScope.$on('auth-login-success', function (event, arg) {
        $state.go('admin-panel.default.dashboard-analytics');
        //$scope.showToast('bottom right', $filter('translate')(AUTH_HANDLING.SESSION_TIMEOUT))
    });
    $rootScope.$on('auth-session-timeout', function (event, arg) {
        //$scope.showToast('bottom right', $filter('translate')(AUTH_HANDLING.SESSION_TIMEOUT))
    });
    $rootScope.$on('auth-not-authenticated', function (event, arg) {
        $rootScope.notAuthenticated = true;
        $rootScope.invalidUsernamePassword = true;
        $timeout(function () {
            $rootScope.invalidUsernamePassword = false;
            $rootScope.notAuthenticated = false;
        }, 3000)
        
        $rootScope.safeApply();
    });
    $rootScope.$on('auth-not-authorized', function (event, arg) {
        //$scope.showToast('bottom right', $filter('translate')(AUTH_HANDLING.NOT_AUTHORIZED))
    });
    // add a class to the body if we are on windows
    if ($window.navigator.platform.indexOf('Win') !== -1) {
        $rootScope.bodyClasses = ['os-windows'];
    }
    $rootScope.$on('$stateChangeStart', function (event, next, current) {
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $.inArray($location.path(), ['/login', '/signup']) === -1;
        if (restrictedPage && !AuthService.isAuthenticated()) {
            event.preventDefault();
            $location.path('/login');
        }
    });
    $rootScope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof (fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };
}])
// setup google charts to use material charts
.value('googleChartApiConfig', {
    version: '1.1',
    optionalSettings: {
        packages: ['line', 'bar', 'geochart', 'scatter'],
        language: 'en'
    }
});
