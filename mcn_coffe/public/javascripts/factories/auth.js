/**
 * Created by pathFinder on 2016-07-12.
 */
app.factory('auth', ['$http', '$window', function($http, $window){

    var auth = {};

    auth.requestUrl = '';

    auth.saveToken = function(token){
        $window.localStorage['mcn-coffee-token'] = token;
    };

    auth.getToken = function() {
        return $window.localStorage['mcn-coffee-token'];
    };

    auth.isLoggedIn = function() {
        var token = auth.getToken();

        if(token) {
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload.exp = Date.now() / 1000;
        } else {
            return false;
        }
    };

    auth.currentUser = function() {
        if(auth.isLoggedIn()) {
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload;
        }
    };

    auth.register = function(user) {
        return $http.post('/register', user).success(function(data) {
            auth.saveToken(data.token);
        });
    };

    auth.logIn = function(user) {
        return $http.post('/login', user).success(function(data) {
            auth.saveToken(data.token);
        });
    };

    auth.logOut = function() {
        $window.localStorage.removeItem('mcn-coffee-token');
    };

    auth.getUsers = function(){
        return $http.get('/users').then(function(data){
            return data.data;
        },function(data){
            return data.data;
        })
    };

    auth.getUser = function(user_id, cb, err) {
        return $http.get('/users/' + user_id).then(function(data){
            if(cb!=undefined) cb(data);
            return data.data;
        }, function(data){
            if(err!=undefined) err(data);
            return data.data;
        })
    };

    auth.updateUser = function(user_id, data, cb, err){
        return $http.put('/users/' + user_id, data).then(function(data){
            auth.saveToken(data.data.token);
            cb(data);
        }, function(data){
            err(data);
        });
    };

    auth.deleteUser = function(user, data, cb, err) {
        return $http({method: 'DELETE', url: '/users/' + user._id, data: data, headers: {"Content-Type": "application/json;charset=utf-8"}}).then(function(data){
            if(cb!=undefined) cb(data);
            auth.logOut();
        }, function(data){
            if(err!=undefined) err(data);
        });
    };

    return auth;
}]);