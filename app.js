(function () {
    'use strict';
  
    angular.module('NarrowItDownApp', [])
      .controller('NarrowItDownController', NarrowItDownController)
      .service('MenuSearchService', MenuSearchService)
      .directive('foundItems', foundItemsDirective)
      .constant('ApiBasePath', 'https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json');
  
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
      var ctrl = this;
      ctrl.searchTerm = '';
      ctrl.foundItems = [];
  
      ctrl.narrowItDown = function () {
        MenuSearchService.getMatchedMenuItems(ctrl.searchTerm)
          .then(function (result) {
            ctrl.foundItems = result;
          });
      };
  
      ctrl.removeItem = function (index) {
        ctrl.foundItems.splice(index, 1);
      };
    }
  
    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService($http, ApiBasePath) {
      var service = this;
  
      service.getMatchedMenuItems = function (searchTerm) {
        return $http({
          method: 'GET',
          url: ApiBasePath
        }).then(function (result) {
          var menuItems = result.data.menu_items;
          var foundItems = [];
  
          for (var i = 0; i < menuItems.length; i++) {
            var item = menuItems[i];
            if (item.description.indexOf(searchTerm) !== -1) {
              foundItems.push(item);
            }
          }
  
          return foundItems;
        });
      };
    }
  
    function foundItemsDirective() {
      var ddo = {
        restrict: 'E',
        templateUrl: 'items.html',
        scope: {
          found: '<',
          onRemove: '&'
        },
        controller: foundItemsDirectiveController,
        controllerAs: 'ctrl',
        bindToController: true
      };
  
      return ddo;
    }
  
    function foundItemsDirectiveController() {
      var ctrl = this;
    }
  
  })();
  