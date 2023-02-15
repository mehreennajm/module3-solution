(function () {
  'use strict';
  
  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .constant('ApiBasePath', " https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json")
  .directive('foundItems', foundItemsDirective);
  
  function foundItemsDirective() {
    var ddo = {
      templateUrl: 'items.html',
      scope: {
        items: '<',
        onRemove: '&'
      },
      controller: foundItemsDirectiveController,
      controllerAs: 'list',
      bindToController: true
    };
  
    return ddo;
  }
  
  function foundItemsDirectiveController() {
    var list = this;
  }
  
  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var narrow = this;
    narrow.searchTerm="";
    narrow.found_items=[];
  
    narrow.searchMenu=function(searchTerm){
      var promise = MenuSearchService.getMatchedMenuItems()
      promise.then(function (response) {
        var found =[];
        var menu=response.data.menu_items
        for (var item in menu){
          if (menu[item].name.includes(searchTerm)) {
            if (found.includes(menu[item].name)==false)
              found.push(menu[item])
          }
        }
        narrow.found_items=found
        console.log(item);
        console.log(narrow.found_items);
      })
      .catch(function (error) {
        console.log(error);
      })
  
    }
  
    narrow.removeItem=function(itemIndex){
      narrow.found_items.splice(itemIndex, 1);
    }
  }
  
  
  MenuSearchService.$inject = ['$http','ApiBasePath'];
  function MenuSearchService($http, ApiBasePath) {
    var search = this;
    var found=[];
    var item="";
  
    search.getMatchedMenuItems = function () {
      var response = $http({
        method: "GET",
        url: ApiBasePath
      });
  
      return response
    };
  
  
  }
  
  })();