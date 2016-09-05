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
    function(cafes, cafe, $scope){
        $scope.cafe = cafe;
        $scope.menus = [];
        $scope.categories = ['전체'];
        $scope.category_filter = "전체";
        $scope.search_term = '';
        $scope.selectedMenu = undefined;
        $scope.selectedOption = undefined;
        $scope.selectedSubOption = undefined;

        $scope.selectFilter = function(category){
            $scope.category_filter = category;
        };

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

        $scope.changeState = function(state)
        {
            if(curState == state)
                return;
            for(var i=0; i<buttons[curState].length; i++)
                hideButton(buttons[curState][i]);
            hideForm(forms[curState][0], function() {
                curState = state;
                showForm(forms[curState][0], function() {
                    for(var i=0; i<buttons[curState].length; i++)
                        showButton(buttons[curState][i]);
                });
            });
        };

        $scope.selectMenu = function(index) {
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
            }
            else {
                $scope.selectedMenu = {
                    id: undefined,
                    category: "",
                    name: "",
                    detail: "",
                    cost: 0,
                    image: "",
                    options: []
                };
                $scope.changeState("modifyMenu");
            }
        };

        $scope.selectOption = function(index) {
            if($scope.selectedMenu == undefined)
                return;
            if($scope.selectedOption == $scope.selectedMenu.options[index])
                return;
            $scope.selectedOption = $scope.selectedMenu.options[index];
            $scope.selectedSubOption = undefined;
            $scope.changeState("selectOption");
        };

        $scope.selectSubOption = function(index) {
            if($scope.selectedMenu == undefined)
                return;
            if($scope.selectedOption == undefined)
                return;
            if($scope.selectedSubOption == $scope.selectedOption.options[index])
                return;
            $scope.selectedSubOption = $scope.selectedOption.options[index];
            $scope.changeState("selectSubOption");
        };

        var states = [
            "selectNone",
            "selectMenu",
            "modifyMenu",
            "appendOption",
            "selectOption",
            "modifyOption",
            "appendSubOption",
            "selectSubOption",
            "modifySubOption"
        ];

        var curState = states[0];

        var forms = {
            selectNone: [],
            selectMenu: [$(".select-form")],
            modifyMenu: [$(".menu-form")],
            appendOption: [$(".option-form")],
            selectOption: [$(".select-form")],
            modifyOption: [$(".option-form")],
            appendSubOption: [$(".sub-option-form")],
            selectSubOption: [$(".select-form")],
            modifySubOption: [$(".sub-option-form")]
        };

        var buttons = {
            selectNone: [$("#create")],
            selectMenu : [$("#modify_menu"), $("#append_option")],
            modifyMenu: [$("#request")],
            appendOption: [$("#request")],
            selectOption: [$("#modify_option"), $("#append_sub_option")],
            modifyOption: [$("#request")],
            appendSubOption: [$("#request")],
            selectSubOption: [$("#modify_sub_option")],
            modifySubOption: [$("#request")]
        };

        $(document).ready(function(e){
            $.material.init();
            $('[data-toggle="tooltip"]').tooltip();
            initialize();
            initializeInputForm();
            setTimeout(initializeAccordion, 100);
        });

        function showButton(button)
        {
            console.log("showButton");
            console.log(button);
            if(button == undefined) return;
            if(button.hasClass("ground"))
                button.removeClass("ground");
        }

        function hideButton(button)
        {
            console.log("hideButton");
            console.log(button);
            if(button == undefined) return;
            if(!button.hasClass("ground"))
                button.addClass("ground");
        }

        function showForm(container, cb)
        {
            console.log("showForm");
            console.log(container);
            if(container == undefined) {
                cb();
                return;
            }
            if (!container.is( ":visible" )){
                container.slideDown( 300 , cb);
            }
        }

        function hideForm(container, cb)
        {
            console.log("hideForm");
            console.log(container);
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

