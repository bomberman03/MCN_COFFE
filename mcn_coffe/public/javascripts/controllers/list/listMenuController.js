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

        $scope.toggleMenuForm = function() {
            var container = $(".menu-form");
            var create =  $("#create");
            var update = $("#update");
            if (container.is( ":visible" )){
                if(!update.hasClass("ground"))
                    update.addClass("ground");
                container.slideUp( 500 ,function(){
                    if(create.hasClass("ground"))
                        create.removeClass("ground");
                });
            } else {
                if(!create.hasClass("ground"))
                    create.addClass("ground");
                container.slideDown( 500 ,function(){
                    if(update.hasClass("ground"))
                        update.removeClass("ground");
                });
            }
        };

        $scope.openSelectForm = function() {
            showForm($(".select-form"));
        };

        $scope.closeSelectForm = function() {
            closeForm($(".select-form"));
        };

        $scope.selectMenu = function(index) {
            if(index != undefined) {
                $scope.selectedMenu = $scope.menus[index];
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
            }
            $scope.selectedOption = $scope.selectedSubOption = undefined;
            $scope.toggleMenuForm();
        };

        $scope.selectOption = function(index) {
            if($scope.selectedMenu == undefined)
                return;
            if($scope.selectedOption == $scope.selectedMenu.options[index])
                return;
            $scope.selectedOption = $scope.selectedMenu.options[index];
            $scope.selectedSubOption = undefined;
        };

        $scope.selectSubOption = function(index) {
            if($scope.selectedMenu == undefined)
                return;
            if($scope.selectedOption == undefined)
                return;
            if($scope.selectedSubOption == $scope.selectedOption.options[index])
                return;
            $scope.selectedSubOption = $scope.selectedOption.options[index];
        };

        var forms = {
            selectNone: [],
            selectMenu: [$(".select-form")],
            modifyMenu: [$(".menu-form")],
            appendOption: [$(".option-form")],
            selectOption: [$(".select-form")],
            modifyOption: []
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

        function showForm(container)
        {
            if (!container.is( ":visible" )){
                container.slideDown( 300 ,function(){

                });
            } else {
                console.log("already open");
            }
        }

        function closeForm(container)
        {
            if (container.is( ":visible" )){
                container.slideUp( 300 ,function(){

                });
            } else {
                console.log("already closed");
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

