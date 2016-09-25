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
                controller: 'DashBoardCtrl',
                onEnter: ['$state', 'auth', function($state, auth) {
                    if( !auth.isLoggedIn()) {
                        $state.go('login');
                    }
                }]
            })
            .state('userInfo', {
                url: '/info/user',
                templateUrl: '/template/info/user.html',
                controller: 'UserInfoCtrl',
                onEnter: ['$state', 'auth', function($state, auth) {
                    if( !auth.isLoggedIn()) {
                        $state.go('login');
                    }
                }],
                resolve: {
                    user: ['auth', function(auth) {
                        return auth.getUser(auth.currentUser()._id);
                    }]
                }
            })
            .state('cafeInfo', {
                url: '/info/cafe/{id}',
                templateUrl: '/template/info/cafe.html',
                controller: 'CafeInfoCtrl',
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
            .state('graph', {
                url: '/list/cafes/{id}/graph',
                templateUrl: '/template/list/graph.html',
                controller: 'ListGraphCtrl',
                onEnter: ['$state', 'auth', function($state, auth) {
                    if( !auth.isLoggedIn()) {
                        $state.go('login');
                    }
                }],
                resolve: {
                    cafe: ['$stateParams', 'cafes', function($stateParams, cafes){
                        return cafes.getCafe($stateParams.id);
                    }],
                    orders: ['$stateParams', 'cafes', function($stateParams, cafes){
                        return cafes.getAllOrders($stateParams.id);
                    }]
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: '/template/auth/login.html',
                controller: 'LoginCtrl',
                onEnter: ['$state', 'auth', function($state, auth) {
                    if( auth.isLoggedIn()) {
                        $state.go('main');
                    }
                }]
            })
            .state('register', {
                url: '/register',
                templateUrl: '/template/auth/register.html',
                controller: 'RegisterCtrl',
                onEnter: ['$state', 'auth', function($state, auth) {
                    if( auth.isLoggedIn()) {
                        $state.go('main');
                    }
                }]
            });
        $urlRouterProvider.otherwise('login');
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

app.controller('SideCtrl', [
    '$scope',
    'cafes',
    'auth',
    function($scope, cafes, auth){

        $(document).ready(function(){
            $("#cafe_list").empty();
            cafes.getUserCafe(auth.currentUser()._id, function(data){
                $scope.cafes = data.data;
                for(var i=0; i<$scope.cafes.length; i++)
                    addCafeList($scope.cafes[i]);
            }, function(data) {

            });
        });

        function getCafeHtml(cafe) {
            return  '<li>' +
                '<a href="#/main"><i class="fa fa-bar-chart-o fa-fw"></i>' + cafe.name + '<span class="fa arrow"></span></a>' +
                '<ul class="nav nav-second-level collapse" aria-expanded="false" style="height: 0px;">' +
                '<li><a href="#/info/cafe/' + cafe._id + '">카페 관리</a></li>' +
                '<li><a href="#/list/cafes/' + cafe._id + '/menu">메뉴 관리</a></li>' +
                '<li><a href="#/list/cafes/' + cafe._id + '/graph">주문 현황</a></li>' +
                '</ul>' +
                '</li>';
        }

        function addCafeList(cafe){
            var html = getCafeHtml(cafe);
            var cafe_list = $("#cafe_list");
            cafe_list.append(html);
            cafe_list.metisMenu();
        }
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











