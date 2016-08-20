/**
 * Created by pathfinder on 16. 4. 6.
 */
var app = angular.module('mcnCoffee', ['ui.router', 'ngSanitize']);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('main', {
                url: '/main',
                templateUrl: '/template/admin.html',
                onEnter: ['$state', 'auth', function($state, auth) {
                    if( !auth.isLoggedIn()) {
                        $state.go('login');
                    }
                }]
            })
            .state('cafe', {
                url: '/create/cafe',
                templateUrl: '/template/create/cafe.html',
                controller: 'CreateCafeCtrl',
                onEnter: ['$state', 'auth', function($state, auth) {
                    if( !auth.isLoggedIn()) {
                        $state.go('login');
                    }
                }]
            })
            .state('menu', {
                url: '/list/cafes/{id}/menu',
                templateUrl: '/template/list/menu.html',
                controller: 'ListMenuCtrl',
                onEnter: ['$state', 'auth', function($state, auth) {
                    if( !auth.isLoggedIn()) {
                        $state.go('login');
                    }
                }],
                resolve: {
                    cafe: ['$stateParams', 'cafes', function($stateParams, cafes){
                        return cafes.getCafe($stateParams.id);
                    }]
                }
            })
            .state('option', {
                url: '/list/cafes/{id}/option',
                templateUrl: '/template/list/option.html',
                controller: 'ListOptionCtrl',
                resolve: {
                    options: ['$stateParams', 'cafes', function($stateParams, cafes){
                        return cafes.getCafeOption($stateParams.id);
                    }]
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: '/template/login.html',
                controller: 'LoginCtrl',
                onEnter: ['$state', 'auth', function($state, auth) {
                    if( auth.isLoggedIn()) {
                        $state.go('main');
                    }
                }]
            })
            .state('register', {
                url: '/register',
                templateUrl: '/template/register.html',
                controller: 'RegisterCtrl',
                onEnter: ['$state', 'auth', function($state, auth) {
                    if( auth.isLoggedIn()) {
                        $state.go('main');
                    }
                }]
            });
        $urlRouterProvider.otherwise('main');
    }]);

app.controller('NavCtrl', [
    '$scope',
    'auth',
    function($scope, auth){
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUser = auth.currentUser;
        $scope.logOut = auth.logOut;
    }
]);

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);











