/**
 * Created by pathfinder on 16. 4. 6.
 */
var app = angular.module('mcnCoffee', ['ui.router']);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/home.html',
                controller: 'MainCtrl'
            })
            .state('cafes', {
                url: '/cafes/{id}',
                templateUrl: '/cafes.html',
                controller: 'CafesCtrl',
            });

        $urlRouterProvider.otherwise('home');
    }]);

app.factory('cafes', [ function(){
    var option_dummy = [
        { name: 'shot', cost:500 },
        { name: 'cream', cost:300 },
    ]
    var menu_dummy = [
        { name: 'Affogato', cost:3000, thumbnail: '/images/coffee1.png', wait:5 },
        { name: 'Americano', cost:2000, thumbnail: '/images/coffee2.png', wait:14 },
        { name: 'Bicerin', cost:4000, thumbnail: '/images/coffee3.png', wait:3 },
        { name: 'Café Bombón', cost:5000, thumbnail: '/images/coffee4.png', wait:23 },
        { name: 'Café au lait', cost:100000, thumbnail: '/images/coffee5.png', wait:8 }
    ];
    var o = {
        cafes: [
            { name: 'Dazzle', thumbnail: '/images/cafe1.jpg', menus: menu_dummy },
            { name: 'CoffeBubble', thumbnail: '/images/cafe2.jpg', menus: menu_dummy },
            { name: 'StarBucks', thumbnail: '/images/cafe3.jpg', menus: menu_dummy },
            { name: 'Angelinous', thumbnail: '/images/cafe4.jpg', menus: menu_dummy },
            { name: 'CoolCafe', thumbnail: '/images/cafe5.jpg', menus: menu_dummy }
        ]
    };
    return o;
}]);

app.controller('MainCtrl', [
    '$scope',
    'cafes',
    function($scope, cafes){
        $scope.cafes = cafes.cafes;
    }
]);

app.controller('CafesCtrl', [
    '$scope',
    '$stateParams',
    'cafes',
    function($scope, $stateParams, cafes){
        $scope.cafe = cafes.cafes[$stateParams.id];
    }
]);

