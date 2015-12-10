/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');
  // Sets app default base URL
  app.baseUrl = '/';
  if (window.location.port === '') {  // if production
    // Uncomment app.baseURL below and
    // set app.baseURL to '/your-pathname/' if running from folder in production
    app.baseUrl = '/polymer-practice/';
  }

  app.displayInstalledToast = function() {
    // Check to make sure caching is actually enabled—it won't be in the dev environment.
    if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
      Polymer.dom(document).querySelector('#caching-complete').show();
    }
  };

  app.searches = [];
  var colorArray = [
                    '#7BB5E1',
                    '#8379A7',
                    '#2B9A77',
                    '#C758A5',
                    '#EDBA32',
                    '#8F6456',
                    '#D25441',
                    '#73215F',
                    '#0065BA'
                  ];

  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function getRandomColor() {
    var color = colorArray.splice(randomIntFromInterval(0, colorArray.length - 1), 1);
    return color[0];
  }

  app.setMap = function() {
    var input = document.getElementById('mapSearchInput');
    window.google.maps.event.clearInstanceListeners(input);
    input.setAttribute('placeholder', 'Search...');
    input.value = '';
    input.focus();
    var searchBoxOptions = {
      bounds: new window.google.maps.Circle({center: app.userLocation[0], radius: 30}).getBounds()
    };
    var searchBox = new window.google.maps.places.SearchBox(input, searchBoxOptions);

    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();
      // var resultLimitInput = document.querySelector('#maxResultsInput input');
      // resultLimitInput.value = Math.round(resultLimitInput.value);
      // if (resultLimitInput.value === 0) {
      //   resultLimitInput.value = 1;
      // }
      if (places.length === 0) {
        app.$.toast.text = 'no results found';
        app.$.toast.show();
        return false;
      }
      var color = getRandomColor();
      var icon = {
          path: 'M19.39,1.562c-2.505-1.238-5.94-0.477-8.377' +
          ',1.643C8.576,1.085,5.141,0.323,2.636,1.562' +
          'C-0.357,3.039-0.88,6.782,1.474,9.924l1.962,' +
          '2.065l0.402,0.425l7.174,7.56l7.174-7.56l0.' +
          '402-0.425l1.963-2.065 C22.906,6.782,22.383,3.039,19.39,1.562z',
          fillColor: color,
          strokeColor: '#fff',
          fillOpacity: 1,
          strokeOpacity: 0.5,
          anchor: new window.google.maps.Point(11, 11)
        };
      function removeSearch(item) {
        var allSearches = app.searches;
        allSearches.splice(allSearches.indexOf(item), 1);
        app.searches = [];
        app.searches = allSearches;
        colorArray.push(color);
      }
      var newPlaces = places.map(function(place) {
        // Create a marker for each place.
        var marker = new window.google.maps.Marker({
          title: place.name,
          position: place.geometry.location,
          icon: icon,
          animation: window.google.maps.Animation.DROP
        });
        place.marker = marker;
        place.latitude = place.geometry.location.lat();
        place.longitude = place.geometry.location.lng();
        return place;
      });

      var searchObj = {
        handleRemove: removeSearch,
        searchTerm: input.value,
        results: newPlaces,
        color: color
      };
      app.searches = app.searches.concat(searchObj);
      input.value = '';
      if (!colorArray.length) {
        input.disabled = true;
      }
    });
  };

  app.setLocationSearchbox = function() {
    var map = document.querySelector('google-map');
    var input = document.getElementById('mapSearchInput');
    window.google.maps.event.clearInstanceListeners(input);
    input.setAttribute('placeholder', 'Set location...');
    input.setAttribute('style', '');
    input.value = '';
    input.focus();
    app.userLocation = [];
    var userLocationSearchBox = new window.google.maps.places.SearchBox(input);
    userLocationSearchBox.addListener('places_changed', function() {
      var places = userLocationSearchBox.getPlaces();
      if (places.length === 0) {
        app.$.toast.text = 'no results found';
        app.$.toast.show();
        return;
      }
      var pos = places[0].geometry.location;
      map.latitude = pos.lat();
      map.longitude = pos.lng();
      app.userLocation = [{lat: map.latitude, lng: map.longitude}];
      app.setMap();
      // redo past searches
      // redoSearchResults();
    });
  };

  app.centerMap = function() {
    var map = document.querySelector('google-map');
    var pos = app.userLocation[0];
    map.latitude = pos.lat;
    map.longitude = pos.lng;
    map.zoom = 15;
  };
  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    var paperDrawerPanel = document.querySelector('#paperDrawerPanel');
    paperDrawerPanel.forceNarrow = true;
    if (window.innerWidth > 600 || document.body.clientWidth > 600) {
      paperDrawerPanel.openDrawer();
    }
    var map = document.querySelector('google-map');
    map.singleInfoWindow = true;
    map.fitToMarkers = true;
    map.addEventListener('google-map-ready', function() {
      map.clickEvents = true;
      map.additionalMapOptions = {mapTypeControl: false};

      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          map.latitude = pos.lat;
          map.longitude = pos.lng;
          app.userLocation = [pos];
          app.setMap();
        }, function() {
          app.setLocationSearchbox();
        });

      } else {
        // Browser doesn't support Geolocation
        app.setLocationSearchbox();
      }
    });
  });

})(document);
