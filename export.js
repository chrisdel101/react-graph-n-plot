'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var PropTypes = _interopDefault(require('prop-types'));

var gridStyles = function gridStyles(props) {
  return {
    graphContainer: {
      display: 'flex',
      position: 'relative',
      bottom: '0px'
    },
    graph: {
      display: 'grid',
      border: '1px solid black',
      gridGap: '1px',
      backgroundColor: 'black',
      gridTemplateRows: 'repeat(' + props.setGraphSize.y + ', 10px)',
      gridTemplateColumns: 'repeat(' + props.setGraphSize.x + ', 10px)'
    }
  };
};
var cellStyles = {
  cell: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff'
  }
};
var pointStyles = {
  'point-marker:before': {
    content: "'●'",
    'font-size': '10px'
  },
  'point-marker': {
    position: 'absolute',
    bottom: '0px'
  }
};
var bodyStyles = {
  body: {
    margin: 0,
    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale'
  }
};
var styles = {
  bodyStyles: bodyStyles,
  cellStyles: cellStyles,
  gridStyles: gridStyles,
  pointStyles: pointStyles
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var Cell = function (_React$Component) {
  inherits(Cell, _React$Component);

  function Cell(props) {
    classCallCheck(this, Cell);

    var _this = possibleConstructorReturn(this, (Cell.__proto__ || Object.getPrototypeOf(Cell)).call(this, props));

    _this.state = {
      allColored: false
    };
    _this.CellMarkup = _this.CellMarkup.bind(_this);
    return _this;
  }

  createClass(Cell, [{
    key: 'renderCells',
    value: function renderCells(i) {
      var _this2 = this;

      if (this.props.toRender) {
        var toRender = this.props.toRender;

        return toRender.map(function (obj, i) {
          var result = void 0;
          switch (_this2.props.type) {
            case 'all':
              result = _this2.allColorsAddLogic(i);
              break;
            default:
              // on first render just run markup
              result = React__default.createElement(_this2.CellMarkup, { key: i, id: i });
              break;
          }
          return result;
        });
      }
    }
  }, {
    key: 'allColorsAddLogic',
    value: function allColorsAddLogic(i) {
      var allColorCellObj = this.props.allColorCellObj;
      // key object key with i

      return React__default.createElement(this.CellMarkup, { key: i, id: i, color: allColorCellObj[i] });
    }
  }, {
    key: 'addColor',
    value: function addColor(cellObj) {
      if (cellObj) {
        return {
          backgroundColor: cellObj.color
        };
      } else {
        return styles.cellStyles.cell;
      }
    }
  }, {
    key: 'CellMarkup',
    value: function CellMarkup(input) {
      var idStr = 'id' + input.id;
      return React__default.createElement('div', {
        style: this.addColor(input.color),
        id: idStr,
        key: input.id,
        className: 'cell'
      });
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.props.toRender && this.props.toRender.length) {
        return React__default.createElement(
          React__default.Fragment,
          null,
          this.renderCells()
        );
      } else {
        return React__default.createElement(
          'div',
          null,
          'No Cells yet!'
        );
      }
    }
  }]);
  return Cell;
}(React__default.Component);

Cell.propTypes = {
  allColorCellObj: PropTypes.object,
  toRender: PropTypes.array,
  type: PropTypes.string
};

function Point(props) {
  if (!props.coordsArrs) return null;

  // make string with the pseudo selector to add point icon
  function injectPseudoIntoHead() {
    var output = '';
    var stylesArr = Object.keys(styles.pointStyles);
    for (var i = 0; i < stylesArr.length; i++) {
      var j = Object.keys(styles.pointStyles[stylesArr[i]]);
      var k = Object.values(styles.pointStyles[stylesArr[i]]);

      output += '.' + stylesArr[i] + '\n {';
      for (var a = 0; a < j.length; a++) {
        output += ' ' + j[a] + ': ' + k[a] + '; ';
      }
      output += '}\n\n';
    }
    var styleTag = document.createElement('style');
    styleTag.type = 'text/css';
    var node = document.createTextNode(output);
    styleTag.append(node);
    var head = document.querySelector('head');
    head.appendChild(styleTag);
  }
  injectPseudoIntoHead();

  var display = void 0;
  !props.color ? display = 'none' : display = 'block';
  return props.coordsArrs.map(function (coord, i) {
    var _styles;

    var styles$$1 = (_styles = {
      display: display,
      color: props.color
    }, defineProperty(_styles, coord.directions.xDir, coord.pixels.moveX.toString() + 'px'), defineProperty(_styles, coord.directions.yDir, coord.pixels.moveY.toString() + 'px'), _styles);
    return React__default.createElement('div', { className: 'point-marker', style: styles$$1, key: i });
  });
}

var utils = function () {
  return {
    _convertToPixels: function _convertToPixels(x, y) {
      if (!x) {
        x = 0;
      }
      if (!y) {
        y = 0;
      }
      var totalX = void 0;
      var totalY = void 0;
      if (x) {
        x = x - 10;
        totalX = 100 + x * 11;
      } else {
        totalX = x * 10;
      }
      if (y) {
        y = y - 10;
        totalY = 100 + y * 11;
      } else {
        totalY = y * 10;
      }
      var moveX = parseInt(totalX);
      var moveY = parseInt(totalY);
      var coordsObj = {
        moveX: moveX,
        moveY: moveY
      };
      return coordsObj;
    },
    _numToMove: function _numToMove(x, y, type) {
      if (type === 'stop') {
        var moveX = Math.abs(this.state.previousStopX - x);
        var moveY = Math.abs(this.state.previousStopY - y);
        return {
          tempX: moveX,
          tempY: moveY
        };
      } else if (type === 'leg') {
        var _moveX = Math.abs(this.state.previousLegX - x);
        var _moveY = Math.abs(this.state.previousLegY - y);
        return {
          tempX: _moveX,
          tempY: _moveY
        };
      } else {
        console.error('error in the num to move function');
      }
    },
    _calcStartingCell: function _calcStartingCell(sizeObj) {
      // find the corner cell formula is (x * y) - x
      var startingCellNum = parseInt(sizeObj.x) * parseInt(sizeObj.y) - parseInt(sizeObj.x);
      return startingCellNum;
    },
    // make json from the entered plot points
    _makePlotJson: function _makePlotJson(plotsArr) {
      return plotsArr.map(function (coords, i) {
        return {
          name: String.fromCharCode(i + 65),
          x: coords.x,
          y: coords.y
        };
      });
    },
    _Cell: function _Cell(cellNum, color) {
      this.cellNum = cellNum;
      this.color = color;
    },
    _makePLotCellObj: function _makePLotCellObj(cellNum, color, CellFunc) {
      return new CellFunc(cellNum, color);
    },
    _arrOfObjsToArr: function _arrOfObjsToArr(arrOfObjs, property) {
      return arrOfObjs.map(function (obj) {
        return obj[property];
      });
    }
  };
}();

var Graph = function (_Component) {
  inherits(Graph, _Component);

  function Graph(props) {
    classCallCheck(this, Graph);

    var _this = possibleConstructorReturn(this, (Graph.__proto__ || Object.getPrototypeOf(Graph)).call(this, props));

    _this.state = {
      stopsDirsArr: [],
      allColorsCounter: 0,
      colorType: '',
      plotSets: [],
      gridSets: [],
      startingCellNumAll: 0,
      previousStopX: 0,
      previousStopY: 0,
      boxesToRender: Array.from({ length: 100 }, function (v, i) {
        return i;
      }),
      finalStopColorCellObj: {},
      finalStopColorCellArr: []
    };
    return _this;
  }

  createClass(Graph, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.createGraph();
      this.loadPlotDatatoPlotSets();
      this.loadGridDataintoGridSets();
    }
    // make props coords into useable json

  }, {
    key: 'loadPlotDatatoPlotSets',
    value: function loadPlotDatatoPlotSets(type) {
      var _this2 = this;

      var sets = void 0;
      // if array
      if (Array.isArray(this.props.plotSets)) {
        sets = this.props.plotSets;
        // if object
      } else {
        sets = Object.values(this.props.plotSets);
      }
      sets.forEach(function (set$$1) {
        // update with _makePlotJson func
        set$$1.plots = utils._makePlotJson(set$$1.plots);
        _this2.setState(function (prevState) {
          return {
            plotSets: [].concat(toConsumableArray(prevState.plotSets), [set$$1])
          };
        });
      });
    }
    // set state after color grid runs through a set

  }, {
    key: 'resetColorGridState',
    value: function resetColorGridState() {
      this.setState({
        startingCellNumAll: utils._calcStartingCell(this.props.setGraphSize),
        previousStopX: 0,
        previousStopY: 0
      });
      this.calcRowVariaion();
    }
    // use plot json to set stops and make colored grid

  }, {
    key: 'loadGridDataintoGridSets',
    value: function loadGridDataintoGridSets() {
      var _this3 = this;

      setTimeout(function () {
        var _loop = function _loop(key) {
          var plotsArr = _this3.state.plotSets[key].plots;
          var lineColor = _this3.state.plotSets[key].lineColor;
          // get the array inside and set stops

          _this3._setStopCoords('stop', plotsArr);
          var tempGridSet = {
            gridColorDataObjs: [],
            gridColorDataObj: {},
            name: 'set' + key,
            allColorsCounter: _this3.state.allColorsCounter,
            colorType: 'all'
          };
          plotsArr.forEach(function (stop, i) {
            var _colorGrid = _this3.colorGrid(stop.x, stop.y, 'all', lineColor, tempGridSet.gridColorDataObj),
                tempCellNumsArr = _colorGrid.tempCellNumsArr,
                tempCellNumsObj = _colorGrid.tempCellNumsObj;

            tempGridSet.gridColorDataObjs = [].concat(toConsumableArray(tempGridSet.gridColorDataObjs), toConsumableArray(tempCellNumsArr));
            tempGridSet.gridColorDataObj = _extends({}, tempGridSet.gridColorDataObj, tempCellNumsObj);
          });
          _this3.setState(function (prevState) {
            return {
              gridSets: [].concat(toConsumableArray(prevState.gridSets), [tempGridSet])
            };
          });
          _this3.resetColorGridState();
        };

        // loop over each obj
        for (var key in _this3.state.plotSets) {
          _loop(key);
        }
        _this3.setState({
          finalStopColorCellArr: _this3.makeSingleCellNumArr(),
          finalStopColorCellObj: _this3.makeSingleCellNumObj()
        });
      });
    }
    // combine all color cells into one array

  }, {
    key: 'makeSingleCellNumArr',
    value: function makeSingleCellNumArr() {
      var arr = this.state.gridSets.map(function (obj) {
        return obj.gridColorDataObjs;
      }).flat();
      return arr;
    }
    // spread all objs into one big one for lookup

  }, {
    key: 'makeSingleCellNumObj',
    value: function makeSingleCellNumObj() {
      var allObjs = {};
      this.state.gridSets.forEach(function (obj) {
        allObjs = _extends({}, allObjs, obj.gridColorDataObj);
      });
      return allObjs;
    }
  }, {
    key: 'createGraph',
    value: function createGraph() {
      var _this4 = this;

      var that = this;
      // take state of graph and multiple to get num
      var cells = parseInt(this.props.setGraphSize.x) * parseInt(this.props.setGraphSize.y);
      if (!cells) {
        console.error('No cell values');
        return;
      }
      that.setState({
        boxesToRender: Array.from({ length: cells }, function (v, i) {
          return i;
        })
      });
      setTimeout(function () {
        _this4.setState({
          startingCellNumAll: utils._calcStartingCell(_this4.props.setGraphSize)
        });
        _this4.calcRowVariaion();
      });
    }
    // takes coords and type - needs access to state

  }, {
    key: '_numToMove',
    value: function _numToMove(x, y, type) {
      if (type === 'stop') {
        var moveX = Math.abs(this.state.previousStopX - x);
        var moveY = Math.abs(this.state.previousStopY - y);
        return {
          tempX: moveX,
          tempY: moveY
        };
      } else if (type === 'leg') {
        var _moveX = Math.abs(this.state.previousLegX - x);
        var _moveY = Math.abs(this.state.previousLegY - y);
        return {
          tempX: _moveX,
          tempY: _moveY
        };
      } else {
        console.error('error in the num to move function');
      }
    }
    // take amount in leg with a percent - returns num to move out of total leg number

  }, {
    key: '_percentToCoords',
    value: function _percentToCoords(diffObj, percent) {
      var xNum = Math.floor(diffObj.xDiff * 0.01 * percent);
      var yNum = Math.floor(diffObj.yDiff * 0.01 * percent);
      return { xNum: xNum, yNum: yNum };
    }
    // calc num of cells to vertial based on grid size

  }, {
    key: 'calcRowVariaion',
    value: function calcRowVariaion() {
      // formula - move up/down is the same value as x and y
      this.setState({
        moveRowCells: parseInt(this.props.setGraphSize.x)
      });
    }
  }, {
    key: 'colorGrid',
    value: function colorGrid(x, y, type, lineColor, objStore) {
      // calc num of units to move based on prev position
      var tempCellNumsArr = [];
      var tempCellNumsObj = {};
      var tempX = x;
      var tempY = y;
      var tempCellNum = void 0;
      var loopAxis = void 0;

      if (type === 'all') {
        tempCellNum = this.state.startingCellNumAll;
      }
      // convert based on next move using above function
      tempX = this._numToMove(tempX, tempY, 'stop').tempX;
      tempY = this._numToMove(tempX, tempY, 'stop').tempY;
      // on first move on grid only - for bottom corner
      if (this.state.previousStopX === 0 && this.state.previousStopY === 0) {
        tempX = tempX - 1;
        tempY = tempY - 1;
        var obj = utils._makePLotCellObj(tempCellNum, lineColor, utils._Cell);
        tempCellNumsArr.push(obj);
        tempCellNumsObj[obj.cellNum] = obj;
      }
      // move in tandem while both vals exist
      while (tempX && tempY) {
        // console.log(tempX)
        // if last was les than current- do this
        if (this.state.previousStopY < y) {
          tempCellNum = tempCellNum - this.state.moveRowCells;
          var _obj = utils._makePLotCellObj(tempCellNum, lineColor, utils._Cell);
          tempCellNumsArr.push(_obj);
          tempCellNumsObj[_obj.cellNum] = _obj;
        } else if (this.state.previousStopY > y) {
          tempCellNum = tempCellNum + this.state.moveRowCells;
          var _obj2 = utils._makePLotCellObj(tempCellNum, lineColor, utils._Cell);
          tempCellNumsArr.push(_obj2);
          tempCellNumsObj[_obj2.cellNum] = _obj2;
        }
        if (this.state.previousStopX < x) {
          tempCellNum = tempCellNum + 1;
          var _obj3 = utils._makePLotCellObj(tempCellNum, lineColor, utils._Cell);
          tempCellNumsArr.push(_obj3);
          tempCellNumsObj[_obj3.cellNum] = _obj3;
        } else if (this.state.previousStopX > x) {
          tempCellNum = tempCellNum - 1;
          var _obj4 = utils._makePLotCellObj(tempCellNum, lineColor, utils._Cell);
          tempCellNumsArr.push(_obj4);
          tempCellNumsObj[_obj4.cellNum] = _obj4;
        }
        tempX = tempX - 1;
        tempY = tempY - 1;
      }
      // axis - loop over the only one left X or Y
      loopAxis = tempY ? loopAxis = tempY : loopAxis = tempX;
      // if only on val left, move on its own
      for (var i = 0; i < loopAxis; i++) {
        if (tempY) {
          if (this.state.previousStopY < y) {
            tempCellNum = tempCellNum - this.state.moveRowCells;
            var _obj5 = utils._makePLotCellObj(tempCellNum, lineColor, utils._Cell);
            tempCellNumsArr.push(_obj5);
            tempCellNumsObj[_obj5.cellNum] = _obj5;
          } else if (this.state.previousStopY > y) {
            tempCellNum = tempCellNum + this.state.moveRowCells;
            var _obj6 = utils._makePLotCellObj(tempCellNum, lineColor, utils._Cell);
            tempCellNumsArr.push(_obj6);
            tempCellNumsObj[_obj6.cellNum] = _obj6;
          }
        } else if (tempX) {
          if (this.state.previousStopX < x) {
            tempCellNum = tempCellNum + 1;
            var _obj7 = utils._makePLotCellObj(tempCellNum, lineColor, utils._Cell);
            tempCellNumsArr.push(_obj7);
            tempCellNumsObj[_obj7.cellNum] = _obj7;
          } else if (this.state.previousStopX > x) {
            tempCellNum = tempCellNum - 1;
            var _obj8 = utils._makePLotCellObj(tempCellNum, lineColor, utils._Cell);
            tempCellNumsArr.push(_obj8);
            tempCellNumsObj[_obj8.cellNum] = _obj8;
          }
        }
      }
      if (type === 'all') {
        this.setState({
          previousStopX: x,
          previousStopY: y,
          startingCellNumAll: tempCellNum
        });
      }
      return {
        tempCellNumsArr: tempCellNumsArr,
        tempCellNumsObj: tempCellNumsObj
      };
    }
  }, {
    key: 'combineStyles',
    value: function combineStyles() {
      var obj = _extends({}, styles.gridStyles(this.props).graphContainer, styles.bodyStyles.body);
      return obj;
    }

    // set coords in pxs of plots

  }, {
    key: '_setStopCoords',
    value: function _setStopCoords(type, arr, x, y) {
      var that = this;
      // filter out undefined
      if (type === 'stop') {
        setTimeout(function () {
          var coordsArr = [];
          if (arr.length > 0) {
            arr.forEach(function (stop) {
              var pixels = utils._convertToPixels(stop.x, stop.y);
              var coords = {
                pixels: pixels,
                directions: {
                  xDir: 'left',
                  yDir: 'bottom'
                }
              };
              coordsArr.push(coords);
            });
          }
          that.setState(function (prevState) {
            return {
              stopsDirsArr: [].concat(toConsumableArray(prevState.stopsDirsArr), [coordsArr])
            };
          });
        });
      } else if (type === 'driver') {
        var pixels = utils._convertToPixels(x, y);
        var coords = {
          pixels: pixels,
          directions: {
            xDir: 'left',
            yDir: 'bottom'
          }
        };
        return coords;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      return React__default.createElement(
        'main',
        { className: 'graph-container', style: this.combineStyles() },
        React__default.createElement(
          'div',
          { className: 'graph', style: styles.gridStyles(this.props).graph },
          ' ',
          this.state.plotSets.map(function (instance, i) {
            return React__default.createElement(Point, {
              key: i,
              color: instance ? instance.plotColor : null,
              coordsArrs: _this5.state.stopsDirsArr[i]
            });
          }),
          ' ',
          React__default.createElement(Cell, {
            toRender: this.state.boxesToRender,
            allColorCellArr: !this.state.finalStopColorCellArr ? null : this.state.finalStopColorCellArr,
            allColorCellObj: !this.state.finalStopColorCellObj ? null : this.state.finalStopColorCellObj,
            type: 'all'
          }),
          ' '
        )
      );
    }
  }]);
  return Graph;
}(React.Component);

Graph.propTypes = {
  plotSets: PropTypes.array,
  setGraphSize: PropTypes.object
};

module.exports = Graph;
//# sourceMappingURL=export.js.map
