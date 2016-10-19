// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('run', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('main', function ($scope, $ionicModal, $http) {
  var map;
  var formMap;
  var currentLocation;
  var api = "http://maps.googleapis.com/maps/api/geocode/json?latlng=";
  $ionicModal.fromTemplateUrl('schRun.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
      $scope.newTaskModal = modal;
      $scope.run = {};
      // $scope.newTaskModal.show();
      initMap();
  });
  //add marker for current user location
  function addCurrentLocMarker(pos){
    var marker = new google.maps.Marker({
    map: map,
    animation: google.maps.Animation.BOUNCE,
    position: pos
    // icon: "assets/icon/running1.png"
  });
    //content
    var address = ($scope.run.address)?$scope.run.address.data.results[0].address_components[1].long_name.toString():"address not found";
  var content = "<h3>Scheduled Run</h3></br><h4>Time:"+$scope.run.time+"</br>Miles:"+$scope.run.miles+"</br>Address:"+address+"</h4>";          
 
  bindInfoClick(marker, content);
  }
  //bind click event and show text on marker on map
  function bindInfoClick(marker, content){
    //adding info 
    var info = new google.maps.InfoWindow({
      content: content
    });
   
    //adding click
    google.maps.event.addListener(marker, 'click', function(){
      info.open(map, marker);
    });
 
  }
  $scope.createRun = function(){
    addCurrentLocMarker(currentLocation);
    $scope.newTaskModal.hide();
  }
  $scope.closeRunModal = function(){
    $scope.newTaskModal.hide();
  }
  function initMap(){
    var options = { enableHighAccuracy: true };
    navigator.geolocation.getCurrentPosition(function(position) {
      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        clickableIcons:false
      });
      

      google.maps.event.addListener(map, "click", function(event){
          $scope.newTaskModal.show();
          formMap = new google.maps.Map(document.getElementById('formMap'), {
            zoom: 16,
            center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            clickableIcons:false
          });
          google.maps.event.addListener(formMap, "click", function(event){
            currentLocation = event.latLng;
            var url = api+currentLocation.lat()+","+currentLocation.lng();
            $http.get(url).then(function(data){
              $scope.run.address = data;
            },function(){
              $scope.run.address = null;
            })
          });
      });
    },function(err) {
      console.log(err);
    },options);
  }
});
