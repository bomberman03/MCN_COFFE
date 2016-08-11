/**
 * Created by pathfinder on 16. 4. 6.
 */
var app = angular.module('mcnCoffee', ['ui.router']);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('main', {
                url: '/main',
                templateUrl: '/template/admin.html'
            })
            .state('cafe', {
                url: '/create/cafe',
                templateUrl: '/template/create/cafe.html',
                controller: 'CreateCafeCtrl',
                resolve: {
                    postPromise: ['cafes', function(cafes){
                        return cafes.getAll();
                    }]
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: '/template/login.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth', function($state, auth) {
                    if( auth.isLoggedIn()) {
                        $state.go('main');
                    }
                }]
            })
            .state('register', {
                url: '/register',
                templateUrl: '/template/register.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth', function($state, auth) {
                    if( auth.isLoggedIn()) {
                        $state.go('main');
                    }
                }]
            })
            .state('form.profile', {
                url: '/profile',
                templateUrl: 'form-profile.html'
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











