/**
 * Created by pathFinder on 2016-08-18.
 */
app.controller('RegisterCtrl', [
    '$scope',
    '$state',
    'terms',
    'auth',
    'sidebar',
    function($scope, $state, terms, auth, sidebar){
        $scope.terms = terms.terms;
        $scope.user = {
            agree: [],
            username: '',
            password: '',
            passwordCheck: '',
            name: '',
            email: '',
            phone: '',
            image: ''
        };
        $scope.error = {
            agree: [],
            username: '',
            password: '',
            passwordCheck: '',
            name: '',
            email: '',
            phone: '',
            image: ''
        };
        $scope.initForm = function(index) {
            if($scope.error[index]) {
                $scope.user[index] = $scope.error[index] = '';
            }
        };
        $scope.agreeAction = function(index){
            initAgree(index);
            $scope.error.agree[index] = false;
        };
        $(document).ready(function() {
            $.material.init();
            sidebar.getCafeList(auth.currentUser());
            initialize();
            initializeWizard();
        });
        var currentPage = 0;
        var validationCheck = [
            function(src, err, cb){
                initAgree(-1);
                var ret = true;
                for(var idx in $scope.user.agree) {
                    $scope.error.agree[idx] = !$scope.user.agree[idx];
                    ret &= $scope.user.agree[idx];
                }
                $scope.$apply();
                if(!ret) err(src);
                else cb(src);
                return ret;
            },
            function(src, err, cb){
                var ret = true;
                if($scope.user.username.trim().length == 0) {
                    $scope.error.username = "아이디를 반드시 입력하세요";
                    ret = false;
                }
                if($scope.user.password.trim().length == 0) {
                    $scope.error.password = "비밀번호를 반드시 입력하세요";
                    ret = false;
                }
                if($scope.user.password.trim() != $scope.user.passwordCheck.trim()) {
                    $scope.error.passwordCheck = "입력하신 비밀번호와 다릅니다.";
                    ret = false;
                }
                $scope.$apply();
                if(!ret) err(src);
                else cb(src);
                return ret;
            },
            function(src, err, cb) {
                var ret = true;
                if($scope.user.name.trim().length == 0) {
                    $scope.error.name = "이름을 반드시 입력하세요";
                    ret = false;
                }
                if($scope.user.email == undefined) {
                    $scope.error.email = "정상적인 이메일을 반드시 입력하세요";
                    ret = false;
                }
                if($scope.user.phone.trim().length == 0) {
                    $scope.error.phone = "전화번호를 반드시 입력하세요";
                    ret = false;
                }
                else if(!/\d{3}-\d{4}-\d{4}/.test($scope.user.phone.trim())) {
                    $scope.error.phone = "전화번호 양식이 맞지 않습니다.";
                    ret = false;
                }
                $scope.$apply();
                if(!ret) err(src);
                else cb(src);
                return ret;
            }
        ];
        function initAgree(index) {
            var agree = $(".agree");
            if($scope.user.agree.length == agree.length)
                return;
            $scope.user.agree.length = agree.length;
            $scope.user.agree.fill(false);
            if(index >= 0)
                $scope.user.agree[index] = true;
        }
        function initialize() {
            var lies = $("ul#progressbar li");
            lies.css("width", (100 / lies.length) + "%");
        }
        function initializeWizard() {
            var current_fs, next_fs, previous_fs;
            var left, opacity, scale;
            var animating;
            function toNextPage (src) {
                if(animating) return false;
                animating = true;

                currentPage++;

                current_fs = $(src).parent();
                next_fs = $(src).parent().next();

                $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

                next_fs.show();
                current_fs.animate({opacity: 0}, {
                    step: function(now, mx) {
                        scale = 1 - (1 - now) * 0.2;
                        left = (now * 50)+"%";
                        opacity = 1 - now;
                        current_fs.css({
                            'transform': 'scale('+ scale +')',
                            'position': 'absolute'
                        });
                        next_fs.css({'left': left, 'opacity': opacity});
                    },
                    duration: 800,
                    complete: function(){
                        current_fs.hide();
                        animating = false;
                    },
                    easing: 'easeInOutBack'
                });
            }
            function toPrevPage (src) {
                if(animating) return false;
                animating = true;

                currentPage--;

                current_fs = $(src).parent();
                previous_fs = $(src).parent().prev();

                $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

                previous_fs.show();
                current_fs.animate({opacity: 0}, {
                    step: function (now, mx) {
                        scale = 0.8 + (1 - now) * 0.2;
                        left = ((1 - now) * 50) + "%";
                        opacity = 1 - now;
                        current_fs.css({'left': left});
                        previous_fs.css({'transform': 'scale(' + scale + ')', 'opacity': opacity});
                    },
                    duration: 800,
                    complete: function () {
                        current_fs.hide();
                        animating = false;
                    },
                    easing: 'easeInOutBack'
                });
            }
            function register (src, err, cb) {
                auth.register($scope.user).error(err).then(function(){
                    cb(src);
                });
            }
            $(".next").click(function(){
                if(currentPage < 2) {
                    validationCheck[currentPage](this, function () {
                        console.log("validation error!");
                    }, toNextPage)
                }
                else {
                    validationCheck[currentPage](this, function () {
                        console.log("validation error!");
                    }, function(src) {
                        register(src, function() {
                            console.log("register error!");
                        }, toNextPage);
                    });
                }
            });
            $(".previous").click(function() {
                toPrevPage(this);
            });
            $(".submit").click(function(){
                $state.go('main');
            });
        }
    }
]);