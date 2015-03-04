// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

angular.module('todo', ['ionic'])
/**
 * The Tables factory handles saving and loading tables
 * from local storage, and also lets us save and load the
 * last active table index.
 */
.factory('Tables', function() {
  return {
    all: function() {
      var tableString = window.localStorage['tables'];
      if(tableString) {
        return angular.fromJson(tableString);
      }
      return [];
    },
    save: function(tables) {
      window.localStorage['tables'] = angular.toJson(tables);
    },
    newTable: function(tableTitle) {
      // Add a new table
      return {
        title: tableTitle,
        guests: []
      };
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveTable']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveTable'] = index;
    }
  }
})

.controller('TodoCtrl', function($scope, $timeout, $ionicModal, Tables, $ionicSideMenuDelegate) {

  // A utility function for creating a new table
  // with the given tableTitle
  var createTable = function(tableTitle) {
    var newTable = Tables.newTable(tableTitle);
    $scope.tables.push(newTable);
    Tables.save($scope.tables);
    $scope.selectTable(newTable, $scope.tables.length-1);
  }


  // Load or initialize tables
  $scope.tables = Tables.all();

  // Grab the last active, or the first table
  $scope.activeTable = $scope.tables[Tables.getLastActiveIndex()];

  // Called to create a new table
  $scope.newTable = function() {
    var tableTitle = prompt('Όνομα ή Αριθμός Τραπεζιού');
    if(tableTitle) {
      createTable(tableTitle);
    }
  };

  // Called to select the given table
  $scope.selectTable = function(table, index) {
    $scope.activeTable = table;
    Tables.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };

  // Create our modal
  $ionicModal.fromTemplateUrl('new-guest.html', function(modal) {
    $scope.guestModal = modal;
  }, {
    scope: $scope
  });

  $scope.createGuest = function(guest) {
    if(!$scope.activeTable || !guest) {
      return;
    }
    $scope.activeTable.guests.push({
      name: guest.name,
      surname: guest.surname
    });
    $scope.guestModal.hide();

    // Inefficient, but save all the tables
    Tables.save($scope.tables);

    guest.name = "";
  };

  $scope.removeGuest = function(activeTable, guest) {
    $scope.activeTable.guests.splice($scope.activeTable.guests.indexOf(guest), 1);
    Tables.save($scope.tables);
  }

  $scope.newGuest = function() {
    $scope.guestModal.show();
  };

  $scope.closeNewGuest = function() {
    $scope.guestModal.hide();
  }

  $scope.toggleTables = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };


  // Try to create the first table, make sure to defer
  // this by using $timeout so everything is initialized
  // properly
  $timeout(function() {
    if($scope.tables.length == 0) {
      while(true) {
        var tableTitle = prompt('Your first table title:');
        if(tableTitle) {
          createTable(tableTitle);
          break;
        }
      }
    }
  });

});
