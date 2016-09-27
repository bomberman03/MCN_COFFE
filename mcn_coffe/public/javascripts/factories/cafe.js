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
            console.log(data);
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
    o.getCafesByDistance = function(latitude, longitude, dist, cb, err){
        return $http.get('/cafes?latitude='+latitude+'&longitude='+longitude+'&dist='+dist).then(function(data){
            cb(data);
        },function(data){
            err(data);
        })
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
    o.updateMenu = function(menu_id, update, cb, err){
        return $http.put('/menus/' + menu_id, update).then(function(data){
            cb(data);
        }, function(data){
            err(data);
        });
    };
    o.deleteMenu = function(cafe_id, menu_id, cb, err){
        return $http.delete('/cafes/' + cafe_id + '/menus/' + menu_id).then(function(data){
            cb(data);
        }, function(data) {
            err(data);
        });
    };
    o.appendOption = function(menu_id, option, cb, err) {
        return $http.post('/menus/' + menu_id, option).then(function(data){
            cb(data);
        }, function(data){
            err(data);
        });
    };
    o.updateOption = function(menu_id, order, update, cb, err) {
        return $http.put('/menus/' + menu_id + '/' + order, update).then(function(data){
            cb(data);
        }, function(data){
            err(data);
        });
    };
    o.deleteOption = function(menu_id, order, cb, err) {
        return $http.delete('/menus/' + menu_id + '/' + order).then(function(data){
            cb(data);
        }, function(data){
            err(data);
        });
    };
    o.appendSubOption = function(menu_id, order, subOption, cb, err) {
        return $http.post('/menus/' + menu_id + '/' + order, subOption).then(function(data){
            cb(data);
        }, function(data){
            err(data);
        });
    };
    o.updateSubOption = function(menu_id, order, sub_order, update, cb, err) {
        return $http.put('/menus/' + menu_id + '/' + order + '/' + sub_order, update).then(function(data){
            cb(data);
        }, function(data){
            err(data);
        });
    };
    o.deleteSubOption = function(menu_id, order, sub_order, cb, err){
        return $http.delete('/menus/' + menu_id + '/' + order + '/' + sub_order).then(function(data){
            cb(data);
        }, function(data){
            err(data);
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
    o.getAllOrders = function(cafe_id, cb, err) {
        return $http.get('/cafes/' + cafe_id + "/orders/statistic").then(function(data){
            if(cb != undefined) cb(data);
            return data.data;
        }, function(data){
            if(err != undefined) err(data);
            return data.data;
        })
    };
    o.getWaitOrders = function(cafe_id, cb, err) {
        return $http.get('/cafes/' + cafe_id + "/orders/wait").then(function(data){
            if(cb != undefined) cb(data);
            return data.data;
        }, function(data){
            if(err != undefined) err(data);
            return data.data;
        })
    };
    o.getOrdersBetween = function(cafe_id, start, finish, cb, err) {
        return $http.get('/cafes/' + cafe_id + "/orders/between?start_time=" + start + "&finish_time=" + finish).then(function(data){
            if(cb != undefined) cb(data);
            return data.data;
        }, function(data){
            if(err != undefined) err(data);
            return data.data;
        })
    };
    o.getMenu = function(menu_id, cb, err){
        return $http.get('/menus/' + menu_id).then(function(data){
            cb(data);
        }, function(data){
            err(data);
        });
    };
    o.postOrder = function(cafe, order, cb, err){
        return $http.post('/cafes/' + cafe._id + '/orders', order).then(function(data){
            cb(data);
        }, function(data){
            err(data);
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
    o.cancelOrder = function(order, next) {
        return $http.put('/orders/' + order._id + '/cancel/').success(function(data){
            next(data._id);
        });
    };
    return o;
}]);