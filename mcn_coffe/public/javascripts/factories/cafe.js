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
    o.createMenuOption = function(menu_id, option) {
        return $http.post('/menus/' + menu_id + '/options', option).success(function(data){
            for(var i=0; i<option.options.length; i++){
                o.createOptionOption(data._id, option.options[i]);
            }
        });
    };
    o.createOptionOption = function(option_id, option) {
        return $http.post('/options/' + option_id + '/options', option).success(function(data){
        })
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
                    for(var j=0; j<cafe.menus[i].options.length; j++){
                        o.getOption(cafe.menus[i], cafe.menus[i].options[j]._id);
                    }
                    break;
                }
            }
        });
    };
    o.getOption = function(menu, option_id){
        return $http.get('/options/' + option_id).then(function(data){
            for(var i=0; i<menu.options.length; i++){
                if(menu.options[i]._id == option_id){
                    menu.options[i] = data.data;
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
    o.postImage = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('type', 'image');
        fd.append('avatar', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).success(function(data){
            console.log(data);
        })
    };
    return o;
}]);