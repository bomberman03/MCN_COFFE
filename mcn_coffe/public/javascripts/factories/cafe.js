/**
 * Created by pathFinder on 2016-07-12.
 */
app.factory('cafes', ['$http', function($http){
    var o = {
        cafes: [],
        orders: []
    };
    o.getAll = function(){
        return $http.get('/cafes').success(function(data){
            angular.copy(data, o.cafes);
        });
    };
    o.createCafe = function(cafe) {
        return $http.post('/cafes', cafe).success(function(data){
            console.log(data);
        });
    };
    o.deleteCafe = function(cafe, callback) {
        return $http.delete('/cafes/' + cafe._id).success(function(data){
            callback(data);
        });
    };
    o.createMenu = function(cafe_id, menu) {
        return $http.post('/cafes/' + cafe_id + '/menus', menu).success(function(data){
            for(var i=0; i<menu.options.length; i++){
                o.createMenuOption(data._id, menu.options[i]);
            }
        });
    };
    o.deleteMenu = function(cafe_id, menu){
        return $http.delete('/cafes/' + cafe_id + '/menus/' + menu._id).success(function(data){
        });
    };
    o.getCafe = function(cafe_id){
        return $http.get('/cafes/' + cafe_id).then(function(data){
            return data.data;
        });
    };
    o.getOrders = function(cafe_id){
        return $http.get('/cafes/' + cafe_id + '/orders').success(function(data){
            angular.copy(data, o.orders);
        });
    };
    o.getMenu = function(cafe, menu_id){
        return $http.get('/menus/' + menu_id).then(function(data){
            for(var i=0; i<cafe.menus.length; i++){
                if(cafe.menus[i]._id == menu_id) {
                    cafe.menus[i] = data.data;
                    break;
                }
            }
        });
    };
    o.postOrder = function(cafe, order){
        return $http.post('/cafes/' + cafe._id + '/orders', order).success(function(data){

        });
    };
    o.deleteOrder = function(order, next){
        return $http.delete('/orders/' + order._id).success(function(data){
            next(data.id);
        });
    };
    o.completeOrder = function(order, next){
        return $http.put('/orders/' + order._id + '/complete/').success(function(data){
            next(data);
        });
    };
    return o;
}]);