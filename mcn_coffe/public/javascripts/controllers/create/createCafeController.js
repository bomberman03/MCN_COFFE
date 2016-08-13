/**
 * Created by pathFinder on 2016-08-11.
 */

app.controller('CreateCafeCtrl', [
    '$scope',
    'terms',
    'openApi',
    function($scope, terms, openApi){
        $scope.terms = terms.terms;
        $scope.cafe  = {
            agree: [],
            name: '',
            detail: '',
            phone: '',
            address: '',
            detailAddress: '',
            locationConfirm: false
        };
        $scope.error = {
            agree: [],
            name: '',
            detail: '',
            phone: '',
            address: '',
            detailAddress: '',
            locationConfirm: false
        };
        var currentPage = 0;
        var tMap;
        var markerLayer;
        var marker;
        var validationCheck = [
            function(){
                initAgree(-1);
                var ret = true;
                for(var idx in $scope.cafe.agree) {
                    $scope.error.agree[idx] = !$scope.cafe.agree[idx];
                    ret &= $scope.cafe.agree[idx];
                }
                $scope.$apply();
                return ret;
            },
            function(){
                var ret = true;
                if($scope.cafe.name.trim().length == 0) { // 카페 이름 검사
                    $scope.error.name = "카페의 이름을 반드시 입력하세요";
                    ret = false;
                }
                if($scope.cafe.detail.trim().length == 0) { // 카페 설명 검사
                    $scope.error.detail = "카페에 대한 설명을 반드시 입력하세요";
                    ret = false;
                }
                if($scope.cafe.phone.trim().length == 0) { // 카페 전화번호 검사
                    $scope.error.phone = "카페 전화번호를 반드시 입력하세요";
                    ret = false
                }
                $scope.$apply();
                return ret;
            },
            function(){

            }
        ];

        $(document).ready(function() {
            $.material.init();
            initializeWizard();
            initializeTMap();
            initializePostCodify();
        });

        function initAgree(index) {
            var agree = $(".agree");
            if($scope.cafe.agree.length == agree.length)
                return;
            $scope.cafe.agree.length = agree.length;
            $scope.cafe.agree.fill(false);
            if(index >= 0)
                $scope.cafe.agree[index] = true;
        }

        $scope.agreeAction = function(index){
            initAgree(index);
            $scope.error.agree[index] = false;
        };

        $scope.initForm = function(index) {
            if($scope.error[index])
                $scope.cafe[index] = $scope.error[index] = '';
        };

        $scope.createCafe = function() {
            if($scope.name == '' || $scope.detail == '') return;
            cafes.createCafe({
                name: $scope.name,
                detail: $scope.detail
            });
            $scope.name = '';
            $scope.detail = '';
        };

        function initializeWizard() {
            //jQuery time
            var current_fs, next_fs, previous_fs; //fieldsets
            var left, opacity, scale; //fieldset properties which we will animate
            var animating; //flag to prevent quick multi-click glitches

            $(".next").click(function(){
                if(animating) return false;
                animating = true;

                if(!validationCheck[currentPage]())
                    return animating = false;
                currentPage++;

                current_fs = $(this).parent();
                next_fs = $(this).parent().next();

                //activate next step on progressbar using the index of next_fs
                $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

                //show the next fieldset
                next_fs.show();
                //hide the current fieldset with style
                current_fs.animate({opacity: 0}, {
                    step: function(now, mx) {
                        //as the opacity of current_fs reduces to 0 - stored in "now"
                        //1. scale current_fs down to 80%
                        scale = 1 - (1 - now) * 0.2;
                        //2. bring next_fs from the right(50%)
                        left = (now * 50)+"%";
                        //3. increase opacity of next_fs to 1 as it moves in
                        opacity = 1 - now;
                        current_fs.css({
                            'transform': 'scale('+scale+')',
                            'position': 'absolute'
                        });
                        next_fs.css({'left': left, 'opacity': opacity});
                    },
                    duration: 800,
                    complete: function(){
                        current_fs.hide();
                        animating = false;
                        tMap.updateSize();
                    },
                    //this comes from the custom easing plugin
                    easing: 'easeInOutBack'
                });
            });

            $(".previous").click(function(){
                if(animating) return false;
                animating = true;

                currentPage--;

                current_fs = $(this).parent();
                previous_fs = $(this).parent().prev();

                //de-activate current step on progressbar
                $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

                //show the previous fieldset
                previous_fs.show();
                //hide the current fieldset with style
                current_fs.animate({opacity: 0}, {
                    step: function(now, mx) {
                        //as the opacity of current_fs reduces to 0 - stored in "now"
                        //1. scale previous_fs from 80% to 100%
                        scale = 0.8 + (1 - now) * 0.2;
                        //2. take current_fs to the right(50%) - from 0%
                        left = ((1-now) * 50)+"%";
                        //3. increase opacity of previous_fs to 1 as it moves in
                        opacity = 1 - now;
                        current_fs.css({'left': left});
                        previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
                    },
                    duration: 800,
                    complete: function(){
                        current_fs.hide();
                        animating = false;
                        tMap.updateSize();
                    },
                    //this comes from the custom easing plugin
                    easing: 'easeInOutBack'
                });
            });

            $(".submit").click(function(){
                return false;
            });
        }

        function initializeTMap() {
            tMap = new Tmap.Map({
                div:'tMap',
                width:'100%',
                height:'400px',
                transitionEffect:"resize",
                animation:true
            });
            markerLayer = new Tmap.Layer.Markers();
            tMap.addLayer(markerLayer);
            tMap.events.register("click", tMap, onClickMap);
            function calculateOffset(){
                var sb_margin_left = $("#page-wrapper").css("margin-left");
                var sb_padding_left = $("#page-wrapper").css("padding-left");
                var margin_left = $('#tMap').parent().css('margin-left');
                var padding_left = $('#tMap').parent().css('padding-left');
                sb_margin_left = sb_margin_left.substr(0, sb_margin_left.length - 2) * 1;
                sb_padding_left = sb_padding_left.substr(0, sb_padding_left.length -2) * 1;
                margin_left = margin_left.substr(0, margin_left.length - 2) * 1;
                padding_left = padding_left.substr(0, padding_left.length - 2) * 1;
                var xOffset = sb_margin_left + sb_padding_left + margin_left + padding_left;
                var yOffset = 249;
                if(sb_margin_left == 0) {
                    var sb_height = $(".sidebar").height();
                    yOffset += (sb_height + 50);
                }
                return {
                    x: xOffset,
                    y: yOffset
                };
            }
            function onClickMap(evt){
                var offset = calculateOffset();
                var pixel = new Tmap.Pixel(evt.clientX - offset.x , evt.clientY - offset.y);
                var location = tMap.getLonLatFromPixel(pixel);
                moveMarker(location);
                location = {
                    latitude: location.lat,
                    longitude: location.lon
                };
                var method = {
                    from: 'EPSG3857',
                    to: 'WGS84GEO'
                };
                openApi.convertCoordinate(location, method, function(data){
                    var location = {
                        latitude: data.coordinate.lat,
                        longitude: data.coordinate.lon
                    };
                    openApi.getAddressByCoordinate(location, function(data) {
                        var jsonData = JSON.parse(data);
                        var result = jsonData.result;
                        if(result.total > 0) {
                            var items = result.items;
                            for (var idx in items){
                                if(items[idx].isRoadAddress) {
                                    $(".postcodify_address").val(items[idx].address);
                                    break;
                                }
                            }
                        }
                    });
                });
            }
        }

        function moveMarker(location) {
            var size = new Tmap.Size(24,38);
            var offset = new Tmap.Pixel(-(size.w/2), -(size.h));
            var icon = new Tmap.Icon('https://developers.skplanetx.com/upload/tmap/marker/pin_b_m_a.png', size, offset);
            markerLayer.removeMarker(marker);
            marker = new Tmap.Marker(location, icon);
            markerLayer.addMarker(marker);
        }

        function initializePostCodify(){
            $(".postcodify_address").postcodifyPopUp({
                insertAddress: '.postcodify_address',
                beforeSelect: function(e){
                    var address = e.context.innerText;
                    address = address.substr(0, address.indexOf('('));
                    // address = address.substring(address.indexOf('(') + 1, address.indexOf(')'));
                    openApi.getCoordinateByAddress(address, function(data){
                        var jsonData = JSON.parse(data);
                        var point  = jsonData.result.items[0].point;
                        var location  = {
                            latitude: point.y,
                            longitude: point.x
                        };
                        var method = {
                            from: 'WGS84GEO',
                            to: 'EPSG3857'
                        };
                        openApi.convertCoordinate(location, method, function(data){
                            var tLocation = new Tmap.LonLat(data.coordinate.lon, data.coordinate.lat);
                            tMap.setCenter(tLocation);
                            moveMarker(tLocation);
                            $scope.cafe.address  = address;
                        });
                    });
                }
            });
        }
    }
]);

