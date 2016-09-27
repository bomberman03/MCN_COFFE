/**
 * Created by pathFinder on 2016-08-18.
 */
/**
 * Created by pathFinder on 2016-07-12.
 */
app.controller('LoginCtrl', [
    '$scope',
    '$state',
    'auth',
    'sidebar',
    function($scope, $state, auth, sidebar){
        $scope.user = {
            username: '',
            password: ''
        };
        $scope.error = {
            username: '',
            password: ''
        };
        $scope.response = '';
        $scope.initForm = function(index) {
            if($scope.error[index]) {
                $scope.cafe[index] = $scope.error[index] = '';
            }
        };
        $scope.logIn = function(){
            if(!validationCheck())
                return;
            auth.logIn($scope.user).error(function(error){
                $scope.response = error.message;
            }).then(function(){
                if(auth.requestUrl.trim().length == 0)
                    $state.go('main');
                else {
                    var tmp = auth.requestUrl;
                    auth.requestUrl = '';
                    location.href = tmp;
                }
            });
        };
        $(document).ready(function() {
            $.material.init();
            sidebar.removeCafeList();
        });
        function validationCheck() {
            var ret = true;
            if($scope.user.username.trim() == 0) {
                $scope.error.username = "아이디를 반드시 입력하세요";
                ret = false;
            }
            if($scope.user.password.trim() == 0) {
                $scope.error.password = "비밀번호를 반드시 입력하세요";
                ret = false;
            }
            if(!$scope.$$phase)
                $scope.$apply();
            return ret;
        }
        function safeApply(scope, fn) {
            (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
        }
    }
]);