'use strict';

/**
 @toc

 @param {Object} scope (attrs that must be defined on the scope (i.e. in the controller) - they can't just be defined in the partial html).

 @param {Object} attrs REMEMBER: use snake-case when setting these on the partial! i.e. my-attr='1' NOT myAttr='1'

 //end: usage
 */

/* global Rickshaw */
window.Rickshaw = require('rickshaw');

angular.module('angular-rickshaw', [])
    .directive('rickshaw', ['$compile', function($compile) {
      return {
        restrict: 'EA',
        scope: {
          options: '=rickshawOptions',
          series: '=rickshawSeries',
          features: '=rickshawFeatures'
        },
        replace: true,
        template: '<div class="rickshaw_wrapper"></div>',
        link: function(scope, element) {
          function getSettings(el) {
            var settings = angular.copy(scope.options);
            settings.element = el;
            settings.series = scope.series;
            return settings;
          }

          var graph;

          function update() {
            var mainEl = angular.element(element);
            mainEl.empty();
            var graphEl = $compile('<div></div>')(scope);
            mainEl.append(graphEl);
            var settings = getSettings(graphEl[0]);
            graph = new Rickshaw.Graph(settings);

            if (scope.features && scope.features.hover) {
              var hoverConfig = {
                graph: graph
              };
              hoverConfig.xFormatter = scope.features.hover.xFormatter;
              hoverConfig.yFormatter = scope.features.hover.yFormatter;
              hoverConfig.formatter = scope.features.hover.formatter;
              var hoverDetail = new Rickshaw.Graph.HoverDetail(hoverConfig);
            }
            if (scope.features && scope.features.palette) {
              var palette = new Rickshaw.Color.Palette({scheme: scope.features.palette});
              for (var i = 0; i < settings.series.length; i++) {
                settings.series[i].color = palette.color();
              }
            }

            graph.render();

            if (scope.features && scope.features.xAxis) {
              var xAxisConfig = {
                graph: graph
              };
              var xAxis = {};

              if (scope.features.xAxis.element) {
                xAxisConfig.element = scope.features.xAxis.element;
              } else {
                var xAxisEl = $compile('<div class="rickshaw_x_axis"></div>')(scope);
                mainEl.append(xAxisEl);
                xAxisConfig.element = xAxisEl[0];
              }

              if (scope.features.xAxis.width) {
                xAxisConfig.width = scope.features.xAxis.width;
              }

              if (scope.features.xAxis.height) {
                xAxisConfig.height = scope.features.xAxis.height;
              }

              if (scope.features.xAxis.orientation) {
                xAxisConfig.orientation = scope.features.xAxis.orientation;
              }

              if (scope.features.xAxis.timeUnit) {
                var time = new Rickshaw.Fixtures.Time();
                xAxisConfig.timeUnit = time.unit(scope.features.xAxis.timeUnit);
                xAxis = new Rickshaw.Graph.Axis.Time(xAxisConfig);
              }

              if (scope.features.xAxis.tickValues) {
                xAxisConfig.tickValues = scope.features.xAxis.tickValues;
              }

              if (scope.features.xAxis.tickFormat) {
                if (typeof scope.features.xAxis.tickFormat === 'function'){
                  xAxisConfig.tickFormat = scope.features.xAxis.tickFormat;
                }
                else {
                  xAxisConfig.tickFormat = Rickshaw.Fixtures.Number[scope.features.xAxis.tickFormat];
                }

                xAxis = new Rickshaw.Graph.Axis.X(xAxisConfig);
              }

              xAxis.render();
            }
            if (scope.features && scope.features.yAxis) {
              var yAxisConfig = {
                graph: graph
              };

              if (scope.features.yAxis.element) {
                yAxisConfig.element = scope.features.yAxis.element;
              } else {
                var yAxisEl = $compile('<div class="rickshaw_y_axis"></div>')(scope);
                mainEl.append(yAxisEl);
                yAxisConfig.element = yAxisEl[0];
              }

              if (scope.features.yAxis.width) {
                yAxisConfig.width = scope.features.yAxis.width;
              }

              if (scope.features.yAxis.height) {
                yAxisConfig.height = scope.features.yAxis.height;
              }

              if (scope.features.yAxis.orientation) {
                yAxisConfig.orientation = scope.features.yAxis.orientation;
              }

              if (scope.features.yAxis.tickValues) {
                yAxisConfig.tickValues = scope.features.yAxis.tickValues;
              }

              if (scope.features.yAxis.tickFormat) {
                if (typeof scope.features.yAxis.tickFormat === 'function'){
                  yAxisConfig.tickFormat = scope.features.yAxis.tickFormat;
                }
                else {
                  yAxisConfig.tickFormat = Rickshaw.Fixtures.Number[scope.features.yAxis.tickFormat];
                }
              }

              var yAxis = new Rickshaw.Graph.Axis.Y(yAxisConfig);
              yAxis.render();
            }

            if (scope.features && scope.features.legend) {
              var legendEl = $compile('<div class="rickshaw_legend"></div>')(scope);
              mainEl.append(legendEl);

              var legend = new Rickshaw.Graph.Legend({
                graph: graph,
                element: legendEl[0]
              });
              if (scope.features.legend.toggle) {
                var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
                  graph: graph,
                  legend: legend
                });
              }
              if (scope.features.legend.highlight) {
                var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
                  graph: graph,
                  legend: legend
                });
              }
            }
          }

          scope.$watchCollection('[options, series, features]', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
              update();
            }
          });

          update();
        }
      };
    }]);
