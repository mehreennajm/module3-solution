(function () {
  'use strict';
  
  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .constant('ApiBasePath', "https://coursera-jhu-default-rtdb.firebaseio.com")
  .directive('foundItems', FoundItemsDirective);
  
  function FoundItemsDirective() {
      var ddo = {
          templateUrl: 'foundItems.html',
          scope: {
              items: '<',
              onRemove: '&'
          }
      };

      return ddo;
  }

  
  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var narrowCtrl = this;
    narrowCtrl.searchTerm = '';
    narrowCtrl.found = [];

    narrowCtrl.search = function () {
      narrowCtrl.found = [];
      if (narrowCtrl.searchTerm.trim() != "") {
          var promise = MenuSearchService.getMatchedMenuItems(narrowCtrl.searchTerm);
          promise.then(function (result) {
              narrowCtrl.found = result;
              console.log(result);
          })
          .catch(function (error) {
              console.log("Oh no! Something went terribly wrong: " + error);
          });
      }
    }

    narrowCtrl.remove = function (index) {
      narrowCtrl.found.splice(index, 1);
    }
  
  }
  
  
  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  function MenuSearchService($http, ApiBasePath) {
    var service = this;
  
    service.getMatchedMenuItems = function (searchTerm) {
      var response = $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      });
  
      return response.then(function (result) {
          //console.log('http response:');
          //console.log(result);
          var foundItems = [];
          var data = result.data;
          for (var category in data) {
              //console.log(data[category]);
              foundItems.push(
                  data[category].menu_items.filter(
                      item => item.description.toLowerCase().includes(searchTerm.toLowerCase())
                  )
              );
          }
          return foundItems.flat();
      });
    };
  
  }
  
  })();
  