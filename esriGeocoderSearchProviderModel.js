"use strict";

/*global require*/
var inherit = require("terriajs/lib/Core/inherit");
var SearchProviderViewModel = require("terriajs/lib/viewModels/SearchProviderViewModel");
var SearchResultViewModel = require("terriajs/lib/viewModels/SearchResultViewModel");
var zoomRectangleFromPoint = require("terriajs/lib/Map/zoomRectangleFromPoint");

var defaultValue = require("terriajs-cesium/Source/Core/defaultValue").default;
var defined = require("terriajs-cesium/Source/Core/defined").default;
var loadJson = require("terriajs/lib/Core/loadJson");
// import i18next from "i18next";

var serviceBaseUrl = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer';

/**
 * Search provider that uses the Data61 Elastic Search GNAF service to look up addresses.
 *
 * @param options.terria Terria instance
 * @param [options.flightDurationSeconds] The number of seconds for the flight animation when zooming to new results.
 * @constructor
 */
var EsriSearchProviderViewModel = function (options) {
  SearchProviderViewModel.call(this);

  options = defaultValue(options, defaultValue.EMPTY_OBJECT);
  this.terria = options.terria;

  // this.name = i18next.t("viewModels.searchAddresses");
  this.name = 'searchAddresses';
  this._geocodeInProgress = undefined;
  this.flightDurationSeconds = defaultValue(options.flightDurationSeconds, 1.5);
};

inherit(SearchProviderViewModel, EsriSearchProviderViewModel);

EsriSearchProviderViewModel.prototype.search = function (searchText) {
  if (!defined(searchText) || /^\s*$/.test(searchText)) {
    this.isSearching = false;
    this.searchResults.removeAll();
    return;
  }

  this.isSearching = true;
  this.searchResults.removeAll();
  this.searchMessage = undefined;

  this.terria.analytics.logEvent("search", "gazetteer", searchText);

  // If there is already a search in progress, cancel it.
  if (defined(this._geocodeInProgress)) {
    this._geocodeInProgress.cancel = true;
    this._geocodeInProgress = undefined;
  }

  var url = serviceBaseUrl + '/singleLine?';
  url += `text=${searchText}`;
  url += `&outFields=*`;
  url += '&maxSuggestions=5';
  url += '&f=json';

  if (this.terria.corsProxy.shouldUseProxy(url)) {
    url = this.terria.corsProxy.getURL(url);
  }

  var promise = loadJson(url);

  var that = this;
  var geocodeInProgress = (this._geocodeInProgress = promise
    .then(function (response) {
      if (geocodeInProgress.cancel) {
        return;
      }
      that.isSearching = false;

      console.debug('response', response);

      if (
        defined(response.suggestions) &&
        response.suggestions.length > 0
      ) {
        response.suggestions.forEach(function (suggestion) {
          that.searchResults.push(
            new SearchResultViewModel({
              name: suggestion.text,
              isImportant: true,
              clickAction: () => createZoomToFunction(that, suggestion, that.flightDurationSeconds),
              location: {
                latitude: 0,
                longitude: 0
              }
            })
          );
        });
      } else {
        // that.searchMessage = i18next.t("viewModels.searchNoPlaceNames");
        that.searchMessage = 'searchNoPlaceNames';
      }

      that.isSearching = false;
    })
    .otherwise(function () {
      if (geocodeInProgress.cancel) {
        return;
      }

      that.isSearching = false;
      // that.searchMessage = i18next.t("viewModels.searchErrorOccurred");
      that.searchMessage = 'searchErrorOccurred';
    }));

  return geocodeInProgress;
};

function createZoomToFunction(context, suggestion, duration) {
  var url = serviceBaseUrl + '/findAddressCandidates?';
  url += `&forStorage=false`;
  url += `&outFields=*`;
  url += '&maxLocations=5';
  url += '&singleLine=' + suggestion.text;
  url += '&magicKey=' + suggestion.magicKey;
  url += '&f=json';

  if (context.terria.corsProxy.shouldUseProxy(url)) {
    url = context.terria.corsProxy.getURL(url);
  }

  loadJson(url)
    .then((response) => {
      if (
        defined(response.candidates) &&
        response.candidates.length > 0
      ) {

        var rectangle = zoomRectangleFromPoint(
          response.candidates[0].location.y,
          response.candidates[0].location.x,
          0.01
        );

        context.terria.currentViewer.zoomTo(rectangle, duration);

      } else {
        console.warn('no results from findAddressCandidates??');
      }
    })
    .otherwise(() => {
      console.warn('findAddressCandidates failed??');
    });

}

module.exports = EsriSearchProviderViewModel;
