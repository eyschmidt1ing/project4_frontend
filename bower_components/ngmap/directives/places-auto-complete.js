/**
 * @ngdoc directive
 * @name places-auto-complete
 * @param Attr2MapOptions {service} convert html attribute to Gogole map api options
 * @description
 *   Provides address auto complete feature to an input element
 *   Requires: input tag
 *   Restrict To: Attribute
 *
 * @attr {AutoCompleteOptions}
 *   [Any AutocompleteOptions](https://developers.google.com/maps/documentation/javascript/3.exp/reference#AutocompleteOptions)
 *
 * @example
 * Example:
 *   <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBLZCoHtlBHXnz1j6iNOmh7H4b2t1Njryc?libraries=places"></script>
 *   <input places-auto-complete types="['geocode']" on-place-changed="myCallback(place)" component-restrictions="{country:'au'}"/>
 */
/* global google */
(function() {
  'use strict';

  var placesAutoComplete = function(Attr2MapOptions, $timeout) {
    var parser = Attr2MapOptions;

    var linkFunc = function(scope, element, attrs, ngModelCtrl) {
      if (attrs.placesAutoComplete ==='false') {
        return false;
      }
      var filtered = parser.filter(attrs);
      var options = parser.getOptions(filtered, {scope: scope});
      var events = parser.getEvents(scope, filtered);
      var autocomplete = new google.maps.places.Autocomplete(element[0], options);
      for (var eventName in events) {
        google.maps.event.addListener(autocomplete, eventName, events[eventName]);
      }

      var updateModel = function() {
        $timeout(function(){
          ngModelCtrl && ngModelCtrl.$setViewValue(element.val());
        },100);
      };
      google.maps.event.addListener(autocomplete, 'place_changed', updateModel);
      element[0].addEventListener('change', updateModel);

      attrs.$observe('types', function(val) {
        if (val) {
          var optionValue = parser.toOptionValue(val, {key: 'types'});
          autocomplete.setTypes(optionValue);
        }
      });
	  
	  attrs.$observe('componentRestrictions', function (val) {
		 if (val) {
		   autocomplete.setComponentRestrictions(scope.$eval(val));
		 }
	   });
    };
	
    return {
      restrict: 'A',
      require: '?ngModel',
      link: linkFunc
    };
  };

  placesAutoComplete.$inject = ['Attr2MapOptions', '$timeout'];
  angular.module('ngMap').directive('placesAutoComplete', placesAutoComplete);
})();
