!function(e){"use strict";var s=e.querySelector("#app");s.baseUrl="/",""===window.location.port&&(s.baseUrl="/polymer-practice/"),s.displayInstalledToast=function(){Polymer.dom(e).querySelector("platinum-sw-cache").disabled||Polymer.dom(e).querySelector("#caching-complete").show()},s.addEventListener("dom-change",function(){var a=e.querySelector("#paperDrawerPanel");a.forceNarrow=!0,console.log("Our app is ready to rock!");var o=e.querySelector("google-map");s.searches=[{searchTerm:"bars",results:["dasd","asd","asd","sdasd"],color:"#7BB5E1"},{searchTerm:"Offline support with the Platinum Service Worker Elements",results:["dasd","asd","asd"],color:"#8379A7"},{searchTerm:"shops",results:["dasd","asd","asd","sdasd"],color:"#2B9A77"},{searchTerm:"Cheesecake Factory",results:["dasd","asd","asd"],color:"#C758A5"},{searchTerm:"church",results:["dasd","asd","asd","sdasd"],color:"#EDBA32"},{searchTerm:"junkyards",results:["dasd","asd","asd"],color:"#8F6456"},{searchTerm:"Computer Shops",results:["dasd","asd","asd","sdasd"],color:"#D25441"},{searchTerm:"Clothing stores",results:["dasd","asd","asd"],color:"#73215F"},{searchTerm:"Clock Factory",results:["dasd","asd","asd"],color:"#0065BA"}],o.additionalMapOptions={mapTypeControl:!1},o.addEventListener("google-map-ready",function(){console.log("Map loaded!")}),navigator.geolocation&&navigator.geolocation.getCurrentPosition(function(e){var a={lat:e.coords.latitude,lng:e.coords.longitude};o.latitude=a.lat,o.longitude=a.lng,s.userLocation=[a]},function(){})}),window.addEventListener("WebComponentsReady",function(){})}(document);