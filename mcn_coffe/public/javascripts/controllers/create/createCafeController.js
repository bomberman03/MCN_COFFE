/**
 * Created by pathFinder on 2016-08-11.
 */

app.controller('CreateCafeCtrl', [
    '$scope',
    'terms',
    'openApi',
    function($scope, terms, openApi){
        $scope.terms = terms.terms;
        $scope.currentPage = 0;
        $scope.cafe  = {
            agree: [],
            name: '',
            detail: '',
            phone: ''
        };
        $scope.error = {
            agree: [],
            name: '',
            detail: '',
            phone: ''
        };
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
            console.log($scope.cafe[index]);
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

                if(!validationCheck[$scope.currentPage]())
                    return animating = false;
                $scope.currentPage++;

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
                    },
                    //this comes from the custom easing plugin
                    easing: 'easeInOutBack'
                });
            });

            $(".previous").click(function(){
                if(animating) return false;
                animating = true;

                $scope.currentPage--;

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
            // T map
            var tMap = new Tmap.Map({
                div:'tMap',
                width:'100%',
                height:'400px',
                transitionEffect:"resize",
                animation:true
            });
            //경로 정보 로드
            function searchRoute(start, end){
                var routeFormat = new Tmap.Format.KML({extractStyles:true, extractAttributes:true});
                var urlStr = "https://apis.skplanetx.com/tmap/routes?version=1&format=xml";
                urlStr += "&startX=" + start.x;
                urlStr += "&startY="+ start.y;
                urlStr += "&endX="+ end.x;
                urlStr += "&endY="+ end.y;
                urlStr += "&appKey=b7224677-d5a3-3c7e-9a1c-33db6ad8e19e";
                console.log(urlStr);
                var prtcl = new Tmap.Protocol.HTTP({
                    url: urlStr,
                    format:routeFormat
                });
                var routeLayer = new Tmap.Layer.Vector("route", {protocol:prtcl, strategies:[new Tmap.Strategy.Fixed()]});
                routeLayer.events.register("featuresadded", routeLayer, onDrawnFeatures);
                tMap.addLayer(routeLayer);
            }
            //경로 그리기 후 해당영역으로 줌
            function onDrawnFeatures(e){
                tMap.zoomToExtent(this.getDataExtent());
            }
        }

        function initializePostCodify(){
            var start = {x:0, y:0};
            var end = {x:0, y:0};
            $(".postcodify_address").postcodifyPopUp({
                insertAddress: '.postcodify_address',
                beforeSelect: function(e){
                    var address = e.context.innerText;
                    openApi.getCoordinateByAddress(address, function(data){
                        var jsonData = JSON.parse(data);
                        var point  = jsonData.result.items[0].point;
                        openApi.convertCoordinate(point.x, point.y, function(data){
                            start.x = data.coordinate.lon;
                            start.y = data.coordinate.lat;
                            if($('.postcodify_details').val().length > 0)
                                searchRoute(start, end);
                            else {
                                var tLocation = new Tmap.LonLat(data.coordinate.lon, data.coordinate.lat);
                                tMap.setCenter(tLocation);
                            }
                        });
                    });
                }
            });
            $(".postcodify_details").postcodifyPopUp({
                insertAddress: '.postcodify_details',
                beforeSelect: function(e){
                    var address = e.context.innerText;
                    openApi.getCoordinateByAddress(address, function(data){
                        var jsonData = JSON.parse(data);
                        var point  = jsonData.result.items[0].point;
                        openApi.convertCoordinate(point.x, point.y, function(data){
                            end.x = data.coordinate.lon;
                            end.y = data.coordinate.lat;
                            if($('.postcodify_address').val().length > 0) {
                                searchRoute(start, end);
                            }
                            else {
                                var tLocation = new Tmap.LonLat(data.coordinate.lon, data.coordinate.lat);
                                tMap.setCenter(tLocation);
                            }
                        });
                    });
                }
            });
        }

        function initializeGoogleMap() {
            // google Map
            var directionsDisplay = new google.maps.DirectionsRenderer();
            var directionsService = new google.maps.DirectionsService();

            var mapProp = {
                center: new google.maps.LatLng(36.6144268, 127.4740712),
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var googleMap = new google.maps.Map(document.getElementById("googleMap"),mapProp);
            directionsDisplay.setMap(googleMap);

            var start = new google.maps.LatLng(36.6144268, 127.4740712);
            var end  = new google.maps.LatLng(36.3518898, 127.3782516);

            var request = {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.TRANSIT
            };

            directionsService.route(request, function(result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(result);
                }
            });
        }

        function initializeNaverMap() {
            // naver Map
            var mapOptions = {
                mapTypeControl: true,
                mapTypeControlOptions: {
                    style: naver.maps.MapTypeControlStyle.BUTTON,
                    position: naver.maps.Position.TOP_RIGHT
                },
                zoomControl: true,
                zoomControlOptions: {
                    style: naver.maps.ZoomControlStyle.SMALL,
                    position: naver.maps.Position.RIGHT_CENTER
                },
                scaleControl: true,
                scaleControlOptions: {
                    position: naver.maps.Position.BOTTOM_RIGHT
                },
                logoControl: true,
                logoControlOptions: {
                    position: naver.maps.Position.TOP_LEFT
                },
                mapDataControl: true,
                mapDataControlOptions: {
                    position: naver.maps.Position.BOTTOM_LEFT
                },
                center: new naver.maps.LatLng(40.577280, 77.544221),
                zoom: 10
            };

            var map = new naver.maps.Map('map', mapOptions);

            var marker = new naver.maps.Marker({
                position: new naver.maps.LatLng(37.3595704, 127.105399),
                map: map
            });

            naver.maps.Event.addListener(map, 'click', function(e) {
                marker.setPosition(e.latlng);
            });
        }

    }
]);

