'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

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
    // takes 2 objs of coords and determines the diff
    _absDiff: function _absDiff(firstCoordsObj, secondCoordsObj) {
      var xDiff = Math.abs(firstCoordsObj.x - secondCoordsObj.x);
      var yDiff = Math.abs(firstCoordsObj.y - secondCoordsObj.y);
      return {
        xDiff: xDiff,
        yDiff: yDiff
      };
    },
    _getDriverCoords: function _getDriverCoords(firstLegStopObj, lastLegStopObj, numToMoveObj) {
      var x1 = firstLegStopObj.x;
      var x2 = lastLegStopObj.x;
      var y1 = firstLegStopObj.y;
      var y2 = lastLegStopObj.y;
      var xNum = numToMoveObj.xNum;
      var yNum = numToMoveObj.yNum;
      // if x moves up, add
      var xToMove = void 0;
      var yToMove = void 0;
      if (x1 < x2) {
        xToMove = x1 + xNum;
      } else if (x1 >= x2) {
        xToMove = x1 - xNum;
      } else {
        console.error('error in driver movement');
      }
      if (y1 < y2) {
        yToMove = y1 + yNum;
      } else if (y1 >= y2) {
        yToMove = y1 - yNum;
      } else {
        console.error('error in driver movement');
      }
      return {
        x: xToMove,
        y: yToMove
      };
    },
    // take amount in leg with a percent - returns num to move out of total leg number
    _percentToCoords: function _percentToCoords(diffObj, percent) {
      var xNum = Math.floor(diffObj.xDiff * 0.01 * percent);
      var yNum = Math.floor(diffObj.yDiff * 0.01 * percent);
      return { xNum: xNum, yNum: yNum };
    },
    // takes first stop obj, driver coords obj, and abs diff of a single stops axis
    _findPercentFromDriverCoords: function _findPercentFromDriverCoords(firstStop, driverCoords, yAbsDiff, xAbsDiff) {
      var x1 = parseInt(firstStop.x);
      var y1 = parseInt(firstStop.y);
      var x2 = parseInt(driverCoords.x);
      var y2 = parseInt(driverCoords.y);

      var xDiff = void 0;
      var yDiff = void 0;

      // find number moved from last stop
      if (x1 < x2) {
        xDiff = x2 - x1;
      } else if (x1 > x2) {
        xDiff = x1 - x2;
      } else if (x1 === x2) {
        xDiff = 0;
      } else {
        console.error('error in driver movement');
      }
      if (y1 < y2) {
        yDiff = y2 - y1;
      } else if (y1 > y2) {
        yDiff = y1 - y2;
      } else if (y1 === y2) {
        yDiff = 0;
      } else {
        console.error('error in driver movement');
      }

      // divide number moved so far in leg by total number in leg
      var xPercent = void 0;
      var yPercent = void 0;
      // check for zero vals
      if (xDiff === 0) {
        xPercent = 0;
      }
      if (yDiff === 0) {
        yPercent = 0;
      }
      if (xDiff && xDiff !== 0) {
        xPercent = xDiff / xAbsDiff;
      }
      if (yDiff && yDiff !== 0) {
        yPercent = yDiff / yAbsDiff;
      }
      // let finalPercent

      // if one val is missing use the other alone
      if (!xPercent || !yPercent) {
        if (xPercent) {
          return xPercent * 100;
        } else if (yPercent) {
          return yPercent * 100;
        }
      }
      // it both are zero then zero percent
      if (xPercent === 0 && yPercent === 0) {
        return 0;
      }

      // use the larger leg to updaet val - TODO: make both percents equal so driver fits back into grid
      if (xAbsDiff > yAbsDiff) {
        return xPercent;
      } else if (xAbsDiff < yAbsDiff) {
        return yPercent;
        // if equal use the larger percent
      } else if (xAbsDiff === yAbsDiff) {
        if (xPercent >= yPercent) {
          return xPercent;
        } else {
          return yPercent;
        }
      } else {
        console.error('An error occured in the percentage calcs');
      }
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
    _toggleState: function _toggleState(currentState) {
      if (!currentState) {
        return true;
      } else {
        return false;
      }
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
  // export gridStyles

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

// takes the num of boxes/cells to be produced

var Cell = function (_React$Component) {
  inherits(Cell, _React$Component);

  function Cell(props) {
    classCallCheck(this, Cell);

    var _this = possibleConstructorReturn(this, (Cell.__proto__ || Object.getPrototypeOf(Cell)).call(this, props));

    _this.state = {
      allColored: false,
      legColored: false,
      completeColored: false,
      allColorsCounter: 0,
      legColorsCounter: 0,
      completedColorsCounter: 0,
      previousLegIndex: '',
      cellsMounted: {},
      cellNumsArr: [],
      testArr: ['one', 'two', 'three']
    };
    _this.CellMarkup = _this.CellMarkup.bind(_this);
    return _this;
  }

  createClass(Cell, [{
    key: 'renderCells',
    value: function renderCells(i) {
      var _this2 = this;

      // console.log(this.props.gridColors)
      if (this.props.toRender) {
        var toRender = this.props.toRender;

        return toRender.map(function (obj, i) {
          var result = void 0;
          switch (_this2.props.type) {
            case 'all':
              if (!_this2.state.allColored) {
                result = _this2.allColorsRemoveLogic(i);
              } else if (_this2.state.allColored) {
                result = _this2.allColorsAddLogic(i);
              }
              break;
            case 'leg':
              if (!_this2.state.legColored) {
                result = _this2.legColorsRemoveLogic(i);
              } else if (_this2.state.legColored) {
                result = _this2.legColorsAddLogic(i);
              }
              break;
            case 'complete':
              if (!_this2.state.completeColored) {
                result = _this2.completedColorsRemoveLogic(i);
              } else if (_this2.state.completeColored) {
                result = _this2.completedColorsAddLogic(i);
              }
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
    key: 'toggleColor',
    value: function toggleColor(type) {
      if (type === 'all') {
        // console.log('opposite', this.state.allColored)
        this.setState({
          allColored: utils._toggleState(this.state.allColored)
        });
        // console.log(this.state.allColored)
      } else if (type === 'leg') {
        console.log('opposite', this.state.legColored);
        this.setState({
          legColored: utils._toggleState(this.state.legColored)
        });
      } else if (type === 'complete') {
        console.log('opposite', this.state.completeColored);
        this.setState({
          completeColored: utils._toggleState(this.state.completeColored)
        });
      }
    }
  }, {
    key: 'allColorsRemoveLogic',
    value: function allColorsRemoveLogic(i) {
      var gridColors = this.props.gridColors;

      var hasStopColor = function () {
        if (gridColors && gridColors.includes(i)) return false;
      }();
      return React__default.createElement(this.CellMarkup, { hasStopColor: hasStopColor, key: i, id: i });
    }
  }, {
    key: 'legColorsAddLogic',
    value: function legColorsAddLogic(i) {
      var legsColor = this.props.legsColor;

      legsColor = legsColor.leg;
      var hasLegColor = function () {
        if (!legsColor || !legsColor.length || !legsColor.includes(i)) {
          return false;
        }
        return true;
      }();
      return React__default.createElement(this.CellMarkup, { hasLegColor: hasLegColor, key: i, id: i });
    }
  }, {
    key: 'legColorsRemoveLogic',
    value: function legColorsRemoveLogic(i) {
      var legsColor = this.props.legsColor;

      legsColor = legsColor.leg;
      var hasLegColor = function () {
        if (legsColor && legsColor.includes(i)) return false;
      }();
      return React__default.createElement(this.CellMarkup, { hasLegColor: hasLegColor, key: i, id: i });
    }
  }, {
    key: 'completedColorsAddLogic',
    value: function completedColorsAddLogic(i) {
      var completeColor = this.props.completeColor;

      var hasCompletionColor = function () {
        if (!completeColor || !completeColor.length || !completeColor.includes(i)) {
          return false;
        }
        return true;
      }();
      return React__default.createElement(this.CellMarkup, { hasCompletionColor: hasCompletionColor, key: i, id: i });
    }
  }, {
    key: 'completedColorsRemoveLogic',
    value: function completedColorsRemoveLogic(i) {
      var completeColor = this.props.completeColor;

      var hasCompletionColor = function () {
        if (completeColor && completeColor.includes(i)) return false;
      }();
      return React__default.createElement(this.CellMarkup, { hasCompletionColor: hasCompletionColor, key: i, id: i });
    }
  }, {
    key: 'allColorsAddLogic',
    value: function allColorsAddLogic(i) {
      var allColorCellObj = this.props.allColorCellObj;
      // key object key with i

      return React__default.createElement(this.CellMarkup, { key: i, id: i, color: allColorCellObj[i] });
    }
  }, {
    key: 'combineStyles',
    value: function combineStyles(cellObj) {
      if (!this.state.styles) return;
      // console.log(this.state.styles)
      var lineColor = this.addColor(cellObj);
      var allStyle = _extends({}, this.state.styles, lineColor);
      return allStyle;
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
      // console.log()
      return React__default.createElement('div', {
        style: this.addColor(input.color),
        id: idStr,
        key: input.id,
        className: 'cell'
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setState({
        styles: styles
      });
      this.toggleColor('all');
      // get arr of all cell nums
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

// takes and array of directions and pixes for x and y
function Point(props) {
  if (!props.coordsArrs) return null;

  function injectIntoHead() {
    var output = '';
    var stylesArr = Object.keys(styles.pointStyles);
    for (var i = 0; i < stylesArr.length; i += 1) {
      var j = Object.keys(styles.pointStyles[stylesArr[i]]);
      // console.log('j', j)
      var k = Object.values(styles.pointStyles[stylesArr[i]]);
      // console.log('k', k)

      output += '.' + stylesArr[i] + '\n {';
      // console.log('SA', stylesArr[i])
      for (var a = 0; a < j.length; a += 1) {
        // console.log('KEY', j[a])
        output += ' ' + j[a] + ': ' + k[a] + '; ';
      }

      output += '}\n\n';
    }
    // console.log('output', output)

    // styleStr1 = `.point-marker: ${styleStr1}`
    // let tag = document.createElement('style')
    var styleTag = document.createElement('style');
    styleTag.type = 'text/css';
    // let str = `body: {background-color:yellow}`
    var node = document.createTextNode(output);
    styleTag.append(node);
    // console.log(styleTag)

    // let node = document.createTextNode(styleStr)
    // tag.appendChild(node)
    // tag.type = 'text/css'
    // console.log(tag)
    // let style = JSON.stringify(styles.pointStyles['point-marker:before'])
    // style = `point-marker:before ${style}`
    // console.log(style)

    var head = document.querySelector('head');

    head.appendChild(styleTag);
    // let tag = document.createElement(node)
    // console.log(head)
    // console.log(tag)
    // tag.appendChild(style)
    // console.log(tag)
    // head.append
  }
  injectIntoHead();
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

var Graph = function (_Component) {
  inherits(Graph, _Component);

  function Graph(props) {
    classCallCheck(this, Graph);

    var _this = possibleConstructorReturn(this, (Graph.__proto__ || Object.getPrototypeOf(Graph)).call(this, props));

    _this.state = {
      stopsDirsArr: [],
      allColorsCounter: 0,
      legColorsCounter: 0,
      completedColorsCounter: 0,
      colorType: '',
      cursorIndex: 0,
      createCounter: 0,
      legsCoordsObjs: [],
      legsStartEndObjs: [],
      plotSets: [],
      gridSets: [],
      legToColorID: '',
      cursorFormX: '',
      cursorFormY: '',
      cursorArr: [],
      cursorInputProgress: '',
      startingCellNumAll: 0,
      startingCellNumPartial: '',
      previousLegEndCell: 0,
      previousStopX: 0,
      previousStopY: 0,
      previousLegX: 0,
      previousLegY: 0,
      partialLegStartCoords: '',
      partialLegEndCoords: '',
      boxesToRender: Array.from({ length: 100 }, function (v, i) {
        return i;
      }),
      holdAllStopColorIndexes: [],
      holdAllLegColorArrs: [],
      holdingCompletedArrs: [],
      finalStopColorObjs: [],
      finalLegColorObj: [],
      finalCompletedColorsArr: [],
      finalStopColorCellObj: {},
      finalDriverMoveObj: '',
      finalSliderCoords: [],
      finalStopColorCellArr: [],
      legStartEndCellNums: []
    };
    return _this;
  }

  createClass(Graph, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.createGraph();
      this.loadPlotDatatoPlotSets();
      this.loadGridDataintoGridSets();
      this.addNewCursor();
      setTimeout(function () {
        _this2.updateDriverWithCoords('', 'manual');
        _this2.colorLeg(_this2.props.legToColorID);
      });
    }
    // make props coords into useable json

  }, {
    key: 'loadPlotDatatoPlotSets',
    value: function loadPlotDatatoPlotSets(type) {
      var _this3 = this;

      // load plotsets into state
      Object.values(this.props.plotSets).forEach(function (set$$1) {
        // update with _makePlotJson func
        set$$1.plots = utils._makePlotJson(set$$1.plots);
        _this3.setState(function (prevState) {
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
      var _this4 = this;

      setTimeout(function () {
        var _loop = function _loop(key) {
          var plotsArr = _this4.state.plotSets[key].plots;
          var lineColor = _this4.state.plotSets[key].lineColor;
          // get the array inside and set stops

          _this4._setStopCoords('stop', plotsArr);
          var tempGridSet = {
            legStopsNames: _this4.legConstructor(plotsArr),
            legStartEnd: [],
            legColorData: [],
            gridColorDataObjs: [],
            gridColorDataObj: {},
            name: 'set' + key,
            allColorsCounter: _this4.state.allColorsCounter,
            legColorsCounter: _this4.state.legColorsCounter,
            colorType: 'all'
          };
          plotsArr.forEach(function (stop, i) {
            var _legStartEnd = _this4.legStartEnd(stop.x, stop.y, 'all'),
                legStartEndCellNums = _legStartEnd.legStartEndCellNums,
                holdAllLegColorArrs = _legStartEnd.holdAllLegColorArrs;

            tempGridSet.legColorData.push(holdAllLegColorArrs);
            tempGridSet.legStartEnd.push(legStartEndCellNums);

            var _colorGrid = _this4.colorGrid(stop.x, stop.y, 'all', lineColor, tempGridSet.gridColorDataObj),
                tempCellNumsArr = _colorGrid.tempCellNumsArr,
                tempCellNumsObj = _colorGrid.tempCellNumsObj;

            tempGridSet.gridColorDataObjs = [].concat(toConsumableArray(tempGridSet.gridColorDataObjs), toConsumableArray(tempCellNumsArr));
            tempGridSet.gridColorDataObj = _extends({}, tempGridSet.gridColorDataObj, tempCellNumsObj);
          });
          _this4.setState(function (prevState) {
            return {
              gridSets: [].concat(toConsumableArray(prevState.gridSets), [tempGridSet])
            };
          });
          _this4.resetColorGridState();

          // this.setState(prevState => ({
          //   legsCoordsObjs: [...prevState.legsCoordsObjs, legArr],
          //   legsStartEndObjs: [...prevState.legsStartEndObjs, legData],
          //   holdAllStopColorIndexes: [
          //     ...prevState.holdAllStopColorIndexes,
          //     gridColorData
          //   ]
          // }))
          // })
        };

        // loop over each obj
        for (var key in _this4.state.plotSets) {
          _loop(key);
        }
        _this4.setState({
          finalStopColorCellArr: _this4.makeSingleCellNumArr(),
          finalStopColorCellObj: _this4.makeSingleCellNumObj()
        });
      });
    }
    // combine all color cells into one array

  }, {
    key: 'makeSingleCellNumArr',
    value: function makeSingleCellNumArr() {
      var arr = this.state.gridSets.map(function (obj) {
        // console.log(obj)
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
      var _this5 = this;

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
      setCSSvars();
      // sets vals in css to grid size
      function setCSSvars() {
        // console.log(that.state.setGraphSize)
        var root = document.documentElement;
        root.style.setProperty('--graph-size-x', that.props.setGraphSize.x);
        root.style.setProperty('--graph-size-y', that.props.setGraphSize.y);
      }
      setTimeout(function () {
        _this5.setState({
          startingCellNumAll: utils._calcStartingCell(_this5.props.setGraphSize)
        });
        _this5.calcRowVariaion();
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
    // update createCounter by 1

  }, {
    key: 'increaseCursorIdindex',
    value: function increaseCursorIdindex() {
      var x = this.state.createCounter + 1;
      this.setState({
        createCounter: x
      });
    }
    // new add driver - runs on mount and when add button clicked

  }, {
    key: 'addNewCursor',
    value: function addNewCursor() {
      var newCursorObj = {
        directions: {
          xDir: 'left',
          yDir: 'bottom'
        },
        pixels: {
          moveX: 0,
          moveY: 0
        },
        id: this.state.createCounter,
        name: 'cursor ' + (this.state.createCounter + 1),
        color: 'blue',
        show: true
      };
      var arr = [];
      arr.push(newCursorObj);
      var allCursors = this.state.cursorArr.concat(arr);
      this.setState({
        cursorArr: allCursors
      });
      this.increaseCursorIdindex();
    }
    // on click set driver with coords and send to child

  }, {
    key: 'updateDriverWithCoords',
    value: function updateDriverWithCoords(coords, type) {
      var selectedDriver = this.state.cursorArr[this.state.cursorIndex];
      var cursorArr = [].concat(toConsumableArray(this.state.cursorArr));
      if (type === 'form') {
        // reset to zero
        this._resetCursor();
        // from form
        coords = this._setStopCoords('driver', this.state.cursorFormX, this.state.cursorFormY);
        // toggle driver to first stop of map start
      } else if (type === 'checkbox') ; else if (type === 'slider') {
        // from params
        coords = this._setStopCoords('driver', coords.x, coords.y);
      } else if (type === 'manual') {
        // reset to zero
        this._resetCursor();
        coords = this._setStopCoords('driver', '10', '10');
        cursorArr[this.state.cursorIndex].driverCoords = { x: 5, y: 5 };
      }
      // subtract for icon positionSelect
      coords.pixels.moveX = coords.pixels.moveX - 30;
      // update the values in the object
      cursorArr[this.state.cursorIndex].directions = coords.directions;
      cursorArr[this.state.cursorIndex].pixels = coords.pixels;
      // set new driver vals
      this.setState({
        cursorArr: cursorArr
      });
    }
    // calc up to driver position to color

  }, {
    key: 'colorCompleted',
    value: function colorCompleted(legID, type) {
      var selectedDriver = this.state.cursorArr[this.state.cursorIndex];
      var arr = this.state.legs.filter(function (leg) {
        // console.log(leg.legID)
        return leg.legID === legID;
      });

      // index for arr of cell nums
      var holdingArrIndex = this._legIndex(arr[0].legID);
      // index for json with legs info
      var dataIndex = this.state.legs.indexOf(arr[0]);
      // all previous legs to color
      // var previousLegNames = this.state.legs.slice(0,index)

      // get arr of all previous arrs to cell nums
      // var previousLegArrs = this.state.holdAllLegColorArrs.slice(0, holdingArrIndex)
      // get current arr leg of cell nums
      // var currentLegArr = this.state.holdAllLegColorArrs[holdingArrIndex]
      // console.log('previouslegs', previousLegArrs)
      // console.log('currnt arr', currentLegArr)
      // get current and next leg json info
      var thisLeg = this.state.legs[dataIndex];
      // console.log(thisLeg)
      var legFirstStop = this.state.stops.filter(function (stop) {
        return stop.name === thisLeg.startStop;
      });
      // console.log(legFirstStop)
      var legLastStop = this.state.stops.filter(function (stop) {
        return stop.name === thisLeg.endStop;
      });
      // get first and end coords
      var stopStartCoords = {
        x: legFirstStop[0].x,
        y: legFirstStop[0].y
      };
      var stopEndCoords = {
        x: legLastStop[0].x,
        y: legLastStop[0].y
        // console.log(stopStartCoords)
        // console.log(stopEndCoords)
        // get diff to get number of moves
        // let diffObj = utils._absDiff(stopStartCoords, stopEndCoords)
        // console.log(diff)
        // percent driver is complete of leg
        // let progress = parseInt(this.state.driver.legProgress)
        // // takes number of moves and percent - returns number of moves that is partial of leg in coords
        // let numToMove = utils._percentToCoords(diffObj, progress)
        // console.log('num to move', numToMove)
        // console.log(this.state.legStartEndCellNums)
        // cell nums
      };var start = this.state.legStartEndCellNums[holdingArrIndex];
      // console.log('start/end', start, end)
      // set startingCell and start x / y

      // this.state.startingCellNumPartial: start/end cells
      // 24034 34034
      // this.partialLegStartCoords: start x/y
      // {x: 35, y: 80}
      // this.state.partialLegEndCoords: end
      // {x: 35, y: 30}
      var previousLegArrs = this.state.holdAllLegColorArrs.slice(0, holdingArrIndex);

      this.setState({
        startingCellNumPartial: start,
        partialLegStartCoords: stopStartCoords,
        partialLegEndCoords: stopEndCoords,
        holdingCompletedArrs: [].concat(toConsumableArray(previousLegArrs))
      });
      // console.log('startingCell', start)
      // console.log('stop/start', stopStartCoords)
      // console.log('partial leg end', stopEndCoords)
      // console.log('all', [...previousLegArrs])

      // console.log(this.state.holdingCompletedArrs)
      // console.log(start, end)
      // set state to start coords
      // inout end coords
      // this.state.driverCoords.x = 20
      // this.state.driverCoords.y = 13
      // console.log(selectedDriver)
      if (type === 'data') {
        // console.log(selectedDriver)
        this.legStartEnd(selectedDriver.driverCoords.x, selectedDriver.driverCoords.y, 'partial');
      } else if (type === 'coords') {
        this.legStartEnd(selectedDriver.driverCoords.x, selectedDriver.driverCoords.y, 'partial');
      }
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
    // takes x y and determine start and end cells

  }, {
    key: 'legStartEnd',
    value: function legStartEnd(x, y, type) {
      var tempCellNumsArr = [];
      var tempX = x;
      var tempY = y;
      // start remains the same
      var tempStartNum = void 0;
      // cell num changes with calcs
      var tempCellNum = void 0;
      var loopAxis = void 0;
      if (type === 'all') {
        // on first move only
        if (this.state.previousLegEndCell === 0) {
          tempStartNum = this.state.startingCellNumAll;
          tempCellNum = this.state.startingCellNumAll;
        } else {
          tempStartNum = this.state.previousLegEndCell;
          tempCellNum = this.state.previousLegEndCell;
        }
      } else if (type === 'partial') {
        // start of leg
        tempCellNum = this.state.startingCellNumPartial;
        // need to reset previous x and y
        this.setState({
          previousLegX: this.state.partialLegStartCoords.x,
          previousLegY: this.state.partialLegStartCoords.y
        });
      }

      // on first move on grid only - for bottom corner
      var _numToMove2 = this._numToMove(tempX, tempY, 'leg');

      tempX = _numToMove2.tempX;
      tempY = _numToMove2.tempY;
      if (this.state.previousLegX === 0 && this.state.previousLegY === 0) {
        tempX = tempX - 1;
        tempY = tempY - 1;
        tempCellNumsArr.push(tempCellNum);
      }
      // move in tandem while both vals exist
      while (tempX && tempY) {
        // if last was les than current- do this
        if (this.state.previousLegY < y) {
          tempCellNum = tempCellNum - this.state.moveRowCells;
          tempCellNumsArr.push(tempCellNum);
        } else if (this.state.previousLegY > y) {
          tempCellNum = tempCellNum + this.state.moveRowCells;
          tempCellNumsArr.push(tempCellNum);
        }
        if (this.state.previousLegX < x) {
          tempCellNum = tempCellNum + 1;
          tempCellNumsArr.push(tempCellNum);
        } else if (this.state.previousLegX > x) {
          tempCellNum = tempCellNum - 1;
          tempCellNumsArr.push(tempCellNum);
        }
        tempX = tempX - 1;
        tempY = tempY - 1;
      }
      // axis - loop over the only one left X or Y
      loopAxis = tempY ? loopAxis = tempY : loopAxis = tempX;
      // if only on val left, move on its own
      for (var i = 0; i < loopAxis; i++) {
        if (tempY) {
          if (this.state.previousLegY < y) {
            tempCellNum = tempCellNum - this.state.moveRowCells;
            tempCellNumsArr.push(tempCellNum);
          } else if (this.state.previousLegY > y) {
            tempCellNum = tempCellNum + this.state.moveRowCells;
            tempCellNumsArr.push(tempCellNum);
          }
        } else if (tempX) {
          if (this.state.previousLegX < x) {
            tempCellNum = tempCellNum + 1;
            tempCellNumsArr.push(tempCellNum);
          } else if (this.state.previousLegX > x) {
            tempCellNum = tempCellNum - 1;
            tempCellNumsArr.push(tempCellNum);
          }
        }
      }
      var legCellNums = {
        start: tempStartNum,
        end: tempCellNum
        // - make this previousLast
      };if (type === 'all') {
        this.setState({
          previousLegEndCell: tempCellNum,
          previousLegX: x,
          previousLegY: y
          // legStartEndCellNums: [...this.state.legStartEndCellNums, legCellNums],
          // holdAllLegColorArrs: [
          //   ...this.state.holdAllLegColorArrs,
          //   tempCellNumsArr
          // ]
        });
        return {
          legStartEndCellNums: legCellNums,
          holdAllLegColorArrs: tempCellNumsArr
        };
      } else if (type === 'partial') {
        this.setState({
          previousStopX: x,
          previousStopY: y,
          startingCellNumPartial: tempCellNum,
          holdingCompletedArrs: [].concat(toConsumableArray(this.state.holdingCompletedArrs), [tempCellNumsArr])
        });
      }
    }
    // on click pass props to child

  }, {
    key: 'colorCompletedStops',
    value: function colorCompletedStops() {
      console.log(this.state.holdingCompletedArrs);
      var merged = [].concat.apply([], this.state.holdingCompletedArrs);
      this.setState({
        finalCompletedColorsArr: merged
      });
    }
    // takes driver coords and finds the leg start

  }, {
    key: '_getLegStartfromCoords',
    value: function _getLegStartfromCoords() {
      var _this6 = this;

      var selectedDriver = this.state.cursorArr[this.state.cursorIndex];
      var coords = selectedDriver.driverCoords;
      // if x & y is between the stops
      var firstStop = this.state.stops.filter(function (coord, index) {
        var stop1 = _this6.state.stops[index];
        var stop2 = _this6.state.stops[index + 1];
        if (stop2 === undefined) return false;
        if (
        // x/y are both btw
        (coords.y > stop1.y && coords.y < stop2.y || coords.y < stop1.y && coords.y > stop2.y) && (coords.x > stop1.x && coords.x < stop2.x || coords.x < stop1.x && coords.x > stop2.x)) {
          return coord;
        } else if (
        // y is bwn and x is equal
        (coords.y > stop1.y && coords.y < stop2.y || coords.y < stop1.y && coords.y > stop2.y) && coords.x === stop1.x && coords.x === stop2.x) {
          return coord;
        } else if (
        // x is bwn and y is equal
        (coords.x > stop1.x && coords.x < stop2.x || coords.x < stop1.x && coords.x > stop2.x) && coords.y === stop1.y && coords.y === stop2.y) {
          return coord;
        } else if (
        // coords are exact match
        coords.x === stop1.x && coords.y === stop1.y) {
          return coord;
          // first stop  on map with nothing previous
        } else if (index === 0 && coord === _this6.state.stops[0]) {
          // console.log('first stop on map')
          return coord;
        } else {
          // not within the stops
          return null;
        }
      });
      return firstStop;
    }

    // resets data but does not move

  }, {
    key: '_resetCursor',
    value: function _resetCursor() {
      this.setState({
        finalDriverMoveObj: {
          directions: {
            xDir: 'left',
            yDir: 'bottom'
          },
          pixels: {
            moveX: 0,
            moveY: 0
          }
        }
      });
    }
  }, {
    key: 'combineStyles',
    value: function combineStyles() {
      console.log('DB', styles.bodyStyles.body);
      var obj = _extends({}, styles.gridStyles(this.props).graphContainer, styles.bodyStyles.body);
      return obj;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this7 = this;

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
              coordsArrs: _this7.state.stopsDirsArr[i]
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
  }, {
    key: '_legIndex',
    value: function _legIndex(input) {
      var index = void 0;
      switch (input) {
        // pre-stop
        case 'ZZ':
          index = 0;
          break;
        case 'AB':
          index = 1;
          break;
        case 'BC':
          index = 2;
          break;
        case 'CD':
          index = 3;
          break;
        case 'DE':
          index = 4;
          break;
        case 'EF':
          index = 5;
          break;
        case 'FG':
          index = 6;
          break;
        case 'GH':
          index = 7;
          break;
        case 'HI':
          index = 8;
          break;
        case 'IJ':
          index = 9;
          break;
        case 'JK':
          index = 10;
          break;
        case 'KL':
          index = 11;
          break;
        default:
          console.error('Nothing in switch');
          break;
      }
      return index;
    }
  }, {
    key: 'colorLeg',
    value: function colorLeg(input) {
      // if no props don't call
      if (!this.props.legToColorID) return;
      // change it to an index
      var index = this._legIndex(input);
      // get leg using index out of array
      var leg = this.state.holdAllLegColorArrs[index];
      // set state on child to change the color
      var legObj = { leg: leg, index: index };
      this.setState({
        finalLegColorObj: legObj,
        legColorsCounter: this.state.legColorsCounter + 1,
        colorType: 'leg'
      });
      console.log('FL', this.state.finalLegColorObj);
    }
    // build legs out of stops

  }, {
    key: 'legConstructor',
    value: function legConstructor(stops) {
      var legs = stops.map(function (stop, i) {
        if (!stops[i + 1]) return false;
        return {
          startStop: stop.name,
          endStop: stops[i + 1].name,
          legID: '' + stop.name + stops[i + 1].name
        };
      }).filter(function (stop) {
        return stop;
      });
      return legs;
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
  }]);
  return Graph;
}(React.Component);

module.exports = Graph;
//# sourceMappingURL=export.js.map
