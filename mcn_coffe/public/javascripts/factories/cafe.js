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
    o.getUserCafe = function(user_id, cb, err){
        return $http.get('/cafes?user=' + user_id).then(function(data){
            cb(data);
        }, function(data) {
            err(data.data);
        });
    };
    o.createCafe = function(cafe, cb, err) {
        return $http.post('/cafes', cafe).then(function(data){
            cb(data);
        }, function(data){
            err(data);
        });
    };
    o.updateCafe = function(cafe_id, data, cb, err){
        return $http.put('/cafes/' + cafe_id, data).then(function(data){
            cb(data);
        }, function(data){
            err(data);
        });
    };
    o.deleteCafe = function(cafe, data, cb, err) {
        return $http({method: 'DELETE', url: '/cafes/' + cafe._id, data: data, headers: {"Content-Type": "application/json;charset=utf-8"}}).then(function(data){
            cb(data);
        }, function(data){
            err(data);
        });
    };
    o.createMenu = function(cafe_id, menu, cb, err) {
        return $http.post('/cafes/' + cafe_id + '/menus', menu).then(function(data){
            cb(data);
        }, function(data){
            err(data);
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