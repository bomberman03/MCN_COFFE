/**
 * Created by blood_000 on 2016-09-07.
 */
app.controller('UserInfoCtrl', [
    '$scope',
    'auth',
    'user',
    '$timeout',
    '$state',
    function($scope, auth, user, $timeout, $state){
        $scope.user = user;
        $scope.isNetworking = false;
        $scope.baseResponse = "";
        $scope.deleteConfirm = "";

        $scope.updateUserBase = function(){
            if($scope.isNetworking) return;
            $timeout(function() {
                $scope.baseResponse = "";
                $scope.isNetworking = true;
            });
            var data = {
                name: $scope.user.name,
                email: $scope.user.email,
                phone: $scope.user.phone
            };
            auth.updateUser($scope.user._id, data, function(data){
                $timeout(function() {
                    $scope.isNetworking = false;
                    $scope.baseResponse = "요청이 정상적으로 처리되었습니다.";
                });
            },function(data){
                $timeout(function() {
                    $scope.isNetworking = false;
                    $scope.baseResponse = "알수 없는 오류가 발생했습니다.";
                });
            });
        };

        $scope.deleteUser = function () {
            if($scope.isNetworking) return;
            $timeout(function() {
                $scope.deleteResponse = "";
                $scope.isNetworking = true;
            });
            var data = {
                confirm: $scope.deleteConfirm
            };
            auth.deleteUser($scope.user, data, function(data){
                $timeout(function() {
                    $scope.isNetworking = false;
                    $scope.deleteResponse = "요청이 정상적으로 처리되었습니다.";
                });
            }, function(data){
                $timeout(function() {
                    $scope.isNetworking = false;
                    $scope.deleteResponse = "알수 없는 오류가 발생했습니다.";
                });
            });
        };

        $(document).ready(function(){
            $.material.init();
        });
    }
]);