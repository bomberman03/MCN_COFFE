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
                templateUrl: '/template/main.html',
                controller: 'MainCtrl',
                resolve: {
                    postPromise: ['cafes', function(cafes){
                        return cafes.getAll();
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
            })
            .state('orders', {
                url: '/cafes/{id}/orders',
                templateUrl: '/template/orders.html',
                controller: 'OrderCtrl',
                onEnter: ['$stateParams', '$state', 'auth', function($stateParams, $state, auth) {
                    if(!auth.isLoggedIn()) {
                        auth.requestUrl = '#/cafes/' + $stateParams.id  + '/orders';
                        $state.go('login');
                    }
                }],
                resolve: {
                    cafe: ['$stateParams', 'cafes', function($stateParams, cafes){
                        return cafes.getCafe($stateParams.id);
                    }],
                    postPromise: ['$stateParams', 'cafes', function($stateParams, cafes){
                        return cafes.getOrders($stateParams.id);
                    }]
                }
            })
            .state('cafes', {
                url: '/cafes/{id}',
                templateUrl: '/template/cafes.html',
                controller: 'CafeCtrl',
                resolve: {
                    cafe: ['$stateParams', 'cafes', function($stateParams, cafes){
                        return cafes.getCafe($stateParams.id);
                    }]
                }
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











