/**
 * Created by pathFinder on 2016-08-15.
 */
/**
 * Created by pathFinder on 2016-08-11.
 */

app.controller('ListMenuCtrl', [
    'cafes',
    'cafe',
    '$scope',
    '$timeout',
    function(cafes, cafe, $scope, $timeout){
        $scope.cafe = cafe;
        $scope.menus = [];
        $scope.categories = ['전체'];
        $scope.category_filter = "전체";
        $scope.search_term = '';
        $scope.selectedMenu = undefined;
        $scope.selectedOption = undefined;
        $scope.selectedSubOption = undefined;
        $scope.serverResponse = undefined;
        for(var i=0; i<$scope.menus.length; i++) {
            if($scope.menus[i]["time"] == undefined)
                $scope.menus[i]["time"] = 0;
            if($scope.menus[i]["prob"] == undefined)
                $scope.menus[i]["prob"] = 0.0;
            for(var j=0; j<$scope.menus[i].options.length; j++) {
                if($scope.menus[i].options[j]["prob"] == undefined)
                    $scope.menus[i].options[j]["prob"] = 0.0;
                for(var k=0; k<$scope.menus[i].options[j].length; k++) {
                    if($scope.menus[i].options[j].options[k]["prob"] == undefined)
                        $scope.menus[i].options[j].options[k]["prob"] = 0.0;
                }
            }
        }

        $scope.makeQuery = function() {
            var search_term  = $("#search_term").val();
            $scope.menus.length = 0;
            for(var idx in $scope.cafe.menus) {
                var menu = $scope.cafe.menus[idx];
                if($scope.category_filter == "전체" || $scope.category_filter == menu.category) {
                    if(menu.name.match(search_term) == null)
                        continue;
                    $scope.menus.push(menu);
                }
            }
            initializeAccordion();
        };

        $scope.selectFilter = function(category){
            $scope.category_filter = category;
            $scope.makeQuery();
        };

        $scope.changeState = function(state) {
            if(curState == state)
                return;
            if(curState != "waitResponse" && curState != "serverResponse") {
                prevState.push(curState);
            }
            var prev = curState;
            curState = state;
            for(var i=0; i<buttons[prev].length; i++)
                hideButton(buttons[prev][i]);
            hideForm(forms[prev][0], function() {
                showForm(forms[curState][0], function() {
                    for(var i=0; i<buttons[curState].length; i++) {
                        showButton(buttons[curState][i]);
                    }
                });
            });
        };

        $scope.prevState = function() {
            if(isNetworking) return;
            if(prevState.length == 0)
                return;
            var state = prevState.pop();
            if(state == "selectOption")
                $scope.selectedSubOption = undefined;
            if(state == "selectMenu")
                $scope.selectedOption = undefined;
            $scope.changeState(state);
        };

        $scope.selectMenu = function(index) {
            if(isNetworking) return;
            $scope.selectedOption = $scope.selectedSubOption = undefined;
            if(index != undefined) {
                if($scope.selectedMenu == $scope.menus[index]) {
                    $scope.selectedMenu = undefined;
                    $scope.changeState("selectNone");
                }
                else {
                    $scope.selectedMenu = $scope.menus[index];
                    $scope.changeState("selectMenu");
                }
            } else {
                $scope.selectedMenu = {
                    id: undefined,
                    category: "",
                    name: "",
                    detail: "",
                    cost: 0,
                    image: "",
                    options: []
                };
                $scope.changeState("createMenu");
            }
        };

        $scope.selectOption = function(index) {
            if(isNetworking) return;
            $scope.selectedSubOption = undefined;
            if(index != undefined) {
                $scope.selectedMenu = this.$parent.menu;
                if ($scope.selectedOption == $scope.selectedMenu.options[index]) {
                    $scope.selectedOption = undefined;
                    $scope.changeState("selectMenu");
                }
                else {
                    $scope.selectedOption = $scope.selectedMenu.options[index];
                    $scope.changeState("selectOption");
                }
            } else {
                $scope.selectedOption = {
                    name: "",
                    detail: "",
                    cost: 0,
                    options: []
                };
                $scope.changeState("appendOption");
            }
        };

        $scope.selectSubOption = function(index) {
            if(isNetworking) return;
            if(index != undefined) {
                $scope.selectedMenu = this.$parent.$parent.menu;
                $scope.selectedOption = this.$parent.option;
                if ($scope.selectedSubOption == $scope.selectedOption.options[index]) {
                    $scope.selectedSubOption = undefined;
                    $scope.changeState("selectOption");
                } else {
                    $scope.selectedSubOption = $scope.selectedOption.options[index];
                    $scope.changeState("selectSubOption");
                }
            } else {
                $scope.selectedSubOption = {
                    name: "",
                    detail: "",
                    cost:0
                };
                $scope.changeState("appendSubOption");
            }
        };

        $scope.requestDelete = function(){
            if(isNetworking) return;
            isNetworking = true;
            if(curState == "modifyMenu") {
                if($scope.selectedMenu._id == undefined) {
                    isNetworking = false;
                    $("input").prop("disabled",false);
                    $scope.changeState("serverResponse");
                }
                else
                    deleteMenu(function(data){
                        $timeout(function() {
                            // anything you want can go here and will safely be run on the next digest.
                            $scope.serverResponse = "요청이 정상적으로 처리되었습니다.";
                            deleteMenuView($scope.selectedMenu);
                        });
                        isNetworking = false;
                        $("input").prop("disabled",false);
                        $scope.changeState("serverResponse");
                    }, function(data) {
                        $timeout(function() {
                            // anything you want can go here and will safely be run on the next digest.
                            $scope.serverResponse = "예상치 못한 오류가 발생했습니다.";
                        });
                        isNetworking = false;
                        $("input").prop("disabled",false);
                        $scope.changeState("serverResponse");
                    });
            }
            if(curState == 'modifyOption') {
                if($scope.selectedOption.order == undefined) {
                    isNetworking = false;
                    $("input").prop("disabled",false);
                    $scope.changeState("serverResponse");
                }
                else
                    deleteOption(function(data){
                        $timeout(function() {
                            // anything you want can go here and will safely be run on the next digest.
                            $scope.serverResponse = "요청이 정상적으로 처리되었습니다.";
                            updateMenuView(data.data);
                        });
                        isNetworking = false;
                        $("input").prop("disabled",false);
                        $scope.changeState("serverResponse");
                    }, function(data){
                        $timeout(function() {
                            // anything you want can go here and will safely be run on the next digest.
                            $scope.serverResponse = "예상치 못한 오류가 발생했습니다.";
                        });
                        isNetworking = false;
                        $("input").prop("disabled",false);
                        $scope.changeState("serverResponse");
                    });
            }
            if(curState == 'modifySubOption') {
                if($scope.selectedSubOption.order == undefined){
                    isNetworking = false;
                    $("input").prop("disabled",false);
                    $scope.changeState("serverResponse");
                }
                else
                    deleteSubOption(function(data){
                        $timeout(function() {
                            // anything you want can go here and will safely be run on the next digest.
                            $scope.serverResponse = "요청이 정상적으로 처리되었습니다.";
                            updateMenuView(data.data);
                        });
                        isNetworking = false;
                        $("input").prop("disabled",false);
                        $scope.changeState("serverResponse");
                    }, function(data){
                        $timeout(function() {
                            // anything you want can go here and will safely be run on the next digest.
                            $scope.serverResponse = "예상치 못한 오류가 발생했습니다.";
                        });
                        isNetworking = false;
                        $("input").prop("disabled",false);
                        $scope.changeState("serverResponse");
                    });
            }
            $("input").prop("disabled",true);
            $scope.changeState("waitResponse");
        };

        $scope.requestPost = function(){
            if(isNetworking) return;
            isNetworking = true;
            if(curState == "modifyMenu" || curState == "createMenu") {
                if($scope.selectedMenu._id == undefined)
                    createMenu(function(data){
                        $timeout(function() {
                            // anything you want can go here and will safely be run on the next digest.
                            $scope.serverResponse = "요청이 정상적으로 처리되었습니다.";
                            var newMenu = data.data;
                            $scope.cafe.menus.push(newMenu);
                            $scope.menus = [newMenu].concat($scope.menus);
                        });
                        isNetworking = false;
                        $("input").prop("disabled",false);
                        $scope.changeState("serverResponse");
                    }, function(data){
                        $timeout(function() {
                            // anything you want can go here and will safely be run on the next digest.
                            $scope.serverResponse = "예상치 못한 오류가 발생했습니다.";
                        });
                        isNetworking = false;
                        $("input").prop("disabled",false);
                        $scope.changeState("serverResponse");
                    });
                else
                    updateMenu(function(data){
                        $timeout(function() {
                            // anything you want can go here and will safely be run on the next digest.
                            $scope.serverResponse = "요청이 정상적으로 처리되었습니다.";
                            updateMenuView(data.data);
                        });
                        isNetworking = false;
                        $("input").prop("disabled",false);
                        $scope.changeState("serverResponse");
                    }, function(data) {
                        $timeout(function() {
                            // anything you want can go here and will safely be run on the next digest.
                            $scope.serverResponse = "예상치 못한 오류가 발생했습니다.";
                        });
                        isNetworking = false;
                        $("input").prop("disabled",false);
                        $scope.changeState("serverResponse");
                    });
            }
            if(curState == 'modifyOption' || curState == 'appendOption') {
                if($scope.selectedOption.order == undefined)
                    appendOption(function(data){
                        $timeout(function() {
                            // anything you want can go here and will safely be run on the next digest.
                            $scope.serverResponse = "요청이 정상적으로 처리되었습니다.";
                            updateMenuView(data.data);
                        });
                        isNetworking = false;
                        $("input").prop("disabled",false);
                        $scope.changeState("serverResponse");
                    }, function(data){
                        $timeout(function() {
                            // anything you want can go here and will safely be run on the next digest.
                            $scope.serverResponse = "예상치 못한 오류가 발생했습니다.";
                        });
                        isNetworking = false;
                        $("input").prop("disabled",false);
                        $scope.changeState("serverResponse");
                    });
                else
                    updateOption(function(data){
                        $timeout(function() {
                            // anything you want can go here and will safely be run on the next digest.
                            $scope.serverResponse = "요청이 정상적으로 처리되었습니다.";
                            updateMenuView(data.data);
                        });
                        isNetworking = false;
                        $("input").prop("disabled",false);
                        $scope.changeState("serverResponse");
                    }, function(data){
                        $timeout(function() {
                            // anything you want can go here and will safely be run on the next digest.
                            $scope.serverResponse = "예상치 못한 오류가 발생했습니다.";
                        });
                        isNetworking = false;
                        $("input").prop("disabled",false);
                        $scope.changeState("serverResponse");
                    });
            }
            if(curState == 'modifySubOption' || curState == 'appendSubOption') {
                if($scope.selectedSubOption.order == undefined)
                    appendSubOption(function(data){
                        $timeout(function() {
                            // anything you want can go here and will safely be run on the next digest.
                            $scope.serverResponse = "요청이 정상적으로 처리되었습니다.";
                            updateMenuView(data.data);
                        });
                        isNetworking = false;
                        $("input").prop("disabled",false);
                        $scope.changeState("serverResponse");
                    }, function(data){
                        $timeout(function() {
                            // anything you want can go here and will safely be run on the next digest.
                            $scope.serverResponse = "예상치 못한 오류가 발생했습니다.";
                        });
                        isNetworking = false;
                        $("input").prop("disabled",false);
                        $scope.changeState("serverResponse");
                    });
                else
                    updateSubOption(function(data){
                        $timeout(function() {
                            // anything you want can go here and will safely be run on the next digest.
                            $scope.serverResponse = "요청이 정상적으로 처리되었습니다.";
                            updateMenuView(data.data);
                        });
                        isNetworking = false;
                        $("input").prop("disabled",false);
                        $scope.changeState("serverResponse");
                    }, function(data){
                        $timeout(function() {
                            // anything you want can go here and will safely be run on the next digest.
                            $scope.serverResponse = "예상치 못한 오류가 발생했습니다.";
                        });
                        isNetworking = false;
                        $("input").prop("disabled",false);
                        $scope.changeState("serverResponse");
                    });
            }
            $("input").prop("disabled",true);
            $scope.changeState("waitResponse");
        };

        $(document).ready(function(e) {
            $.material.init();
            $('[data-toggle="tooltip"]').tooltip();
            initialize();
            initializeInputForm();
            setTimeout(initializeAccordion, 100);
        });

        var isNetworking = false;
        var states = [
            "selectNone",
            "selectMenu",
            "createMenu",
            "modifyMenu",
            "appendOption",
            "selectOption",
            "modifyOption",
            "appendSubOption",
            "selectSubOption",
            "modifySubOption",
            "waitResponse",
            "serverResponse"
        ];
        var prevState = [];
        var curState = states[0];
        var forms = {
            selectNone: [],
            selectMenu: [$(".select-form")],
            createMenu: [$('.menu-form')],
            modifyMenu: [$(".menu-form")],
            appendOption: [$(".option-form")],
            selectOption: [$(".select-form")],
            modifyOption: [$(".option-form")],
            appendSubOption: [$(".sub-option-form")],
            selectSubOption: [$(".select-form")],
            modifySubOption: [$(".sub-option-form")],
            waitResponse: [$(".loading-form")],
            serverResponse: [$(".response-form")]
        };
        var buttons = {
            selectNone: [$("#create")],
            selectMenu: [$("#modify_menu"), $("#append_option")],
            createMenu: [$("#request")],
            modifyMenu: [$("#request"), $("#delete")],
            appendOption: [$("#request")],
            selectOption: [$("#modify_option"), $("#append_sub_option")],
            modifyOption: [$("#request"), $("#delete")],
            appendSubOption: [$("#request")],
            selectSubOption: [$("#modify_sub_option")],
            modifySubOption: [$("#request"), $("#delete")],
            waitResponse: [],
            serverResponse: [$("#confirm")]
        };

        function deleteMenu(cb, err) {
            cafes.deleteMenu(cafe._id, $scope.selectedMenu._id, cb, err);
        }

        function deleteOption(cb, err) {
            cafes.deleteOption($scope.selectedMenu._id, $scope.selectedOption.order, cb, err);
        }

        function deleteSubOption(cb, err) {
            cafes.deleteSubOption($scope.selectedMenu._id, $scope.selectedOption.order, $scope.selectedSubOption.order, cb, err);
        }

        function deleteMenuView(deletedMenu) {
            for(var i=0; i<$scope.menus.length; i++) {
                if(deletedMenu._id == $scope.menus[i]._id) {
                    $scope.menus.splice(i,1);
                    break;
                }
            }
            for(var i=0; i<$scope.cafe.menus.length; i++) {
                if(deletedMenu._id == $scope.cafe.menus[i]._id) {
                    $scope.cafe.menus.splice(i,1);
                }
            }
        }

        function updateMenuView(updatedMenu) {
            for(var i=0; i<$scope.menus.length; i++) {
                if(updatedMenu._id == $scope.menus[i]._id) {
                    $scope.menus[i] = updatedMenu;
                    break;
                }
            }
            for(var i=0; i<$scope.cafe.menus.length; i++) {
                if(updatedMenu._id == $scope.cafe.menus[i]._id) {
                    $scope.cafe.menus[i] = updatedMenu;
                }
            }
        }

        function createMenu(cb, err){
            cafes.createMenu(cafe._id, $scope.selectedMenu, cb, err);
        }

        function updateMenu(cb, err) {
            cafes.updateMenu($scope.selectedMenu._id, $scope.selectedMenu, cb, err);
        }

        function appendOption(cb, err) {
            cafes.appendOption($scope.selectedMenu._id, $scope.selectedOption, cb, err);
        }

        function updateOption(cb, err) {
            cafes.updateOption($scope.selectedMenu._id, $scope.selectedOption.order, $scope.selectedOption, cb, err);
        }

        function appendSubOption(cb, err) {
            cafes.appendSubOption($scope.selectedMenu._id, $scope.selectedOption.order, $scope.selectedSubOption, cb, err);
        }

        function updateSubOption(cb, err) {
            cafes.updateSubOption($scope.selectedMenu._id, $scope.selectedOption.order, $scope.selectedSubOption.order, $scope.selectedSubOption, cb, err);
        }

        function showButton(button) {
            if(button == undefined) return;
            if(button.hasClass("ground"))
                button.removeClass("ground");
        }

        function hideButton(button) {
            if(button == undefined) return;
            if(!button.hasClass("ground"))
                button.addClass("ground");
        }

        function showForm(container, cb) {
            if(container == undefined) {
                cb();
                return;
            }
            if (!container.is( ":visible" )){
                container.slideDown( 300 , cb);
            } 
        }

        function hideForm(container, cb) {
            if(container == undefined) {
                cb();
                return;
            }
            if (container.is( ":visible" )){
                container.slideUp( 300 , cb);
            }
        }

        function initialize() {
            for(var idx in $scope.cafe.menus) {
                var menu = $scope.cafe.menus[idx];
                if($scope.categories.indexOf(menu.category) == -1) {
                    $scope.categories.push(menu.category);
                }
                $scope.menus.push(menu);
            }
        }

        function initializeAccordion() {
            var accordionsMenu = $('.cd-accordion-menu');
            if( accordionsMenu.length > 0 ) {
                accordionsMenu.each(function(){
                    var accordion = $(this);
                    accordion.on('change', 'input[type="checkbox"]', function(){
                        var checkbox = $(this);
                        ( checkbox.prop('checked') ) ? checkbox.siblings('ul').attr('style', 'display:none;').slideDown(300) : checkbox.siblings('ul').attr('style', 'display:block;').slideUp(300);
                    });
                });
            }
        }

        function initializeInputForm() {
            $('#menu_img').change(function (evt) {
                var tgt = evt.target || window.event.srcElement,
                    files = tgt.files;
                // FileReader support
                if (FileReader && files && files.length) {
                    var fr = new FileReader();
                    fr.onload = function () {
                        document.getElementById("menu_img_preview").src = fr.result;
                    };
                    fr.readAsDataURL(files[0]);
                }
                else {
                    // not supported
                }
            });
            $(".menu-form .touch").click(function(){
                $('#menu_img').trigger("click");
            });
        }
    }
]);

