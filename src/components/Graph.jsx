import React, { Component } from 'react'

import Cell from './Cell.jsx'
import Point from './Point.jsx'
// import Cursor from './Cursor'
import utils from '../graph_utils'

class Graph extends Component {
  constructor(props) {
    super(props)
    this.state = {
      storeGraphSize: { x: '20', y: '20' },
      plotObjs: [],
      tempPlotObj: { x: '', y: '' },
      cancelSlide: false,
      sliderSlicedChunk: [],
      iconStartAtfirstStop: false,
      sliderIndex: 0,
      initialSliderChange: true,
      sliderCoordsArrs: [],
      stopsDirsArr: [],
      // utilsTop: '',
      colors: [
        'red',
        'Orange',
        'DodgerBlue',
        'MediumSeaGreen',
        'Violet',
        'SlateBlue',
        'Tomato'
      ],
      showStopNames: false,
      allColorsCounter: 0,
      legColorsCounter: 0,
      completedColorsCounter: 0,
      colorType: '',
      loadingDataArr: [],
      cursorIndex: 0,
      createCounter: 0,
      legsCoordsObjs: [],
      legsStartEndObjs: [],
      plotSets: [],
      gridSets: [],
      jsonStops: [],
      stopsCopy: [],
      legToColorID: '',
      cursorFormX: '',
      cursorFormY: '',
      cursorLegInput: '',
      cursorArr: [],
      cursorInputProgress: '',
      currentCursor: '',
      startingCellNumAll: 0,
      startingCellNumPartial: '',
      previousLegEndCell: 0,
      previousStopX: 0,
      previousStopY: 0,
      previousLegX: 0,
      previousLegY: 0,
      partialLegStartCoords: '',
      partialLegEndCoords: '',
      boxesToRender: Array.from({ length: 100 }, (v, i) => i),
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
    }
  }
  componentDidMount() {
    this.createGraph()
    this.loadPlotDatatoPlotSets()
    this.loadGridDataintoGridSets()
    this.addNewCursor()
    setTimeout(() => {
      this.updateDriverWithCoords('', 'manual')
      this.colorLeg(this.props.legToColorID)
    })
  }
  // make props coords into useable json
  loadPlotDatatoPlotSets(type) {
    // load plotsets into state
    Object.values(this.props.plotSets).forEach(set => {
      // update with _makePlotJson func
      set.plots = utils._makePlotJson(set.plots)
      this.setState(prevState => ({
        plotSets: [...prevState.plotSets, set]
      }))
    })
  }
  // set state after color grid runs through a set
  resetColorGridState() {
    this.setState({
      startingCellNumAll: utils._calcStartingCell(this.props.setGraphSize),
      previousStopX: 0,
      previousStopY: 0
    })
    this.calcRowVariaion()
  }
  // use plot json to set stops and make colored grid
  loadGridDataintoGridSets() {
    setTimeout(() => {
      // loop over each obj
      for (let key in this.state.plotSets) {
        const plotsArr = this.state.plotSets[key].plots
        const { lineColor } = this.state.plotSets[key]
        // get the array inside and set stops
        this._setStopCoords('stop', plotsArr)
        const tempGridSet = {
          legStopsNames: this.legConstructor(plotsArr),
          legStartEnd: [],
          legColorData: [],
          gridColorDataObjs: [],
          gridColorDataObj: {},
          name: `set${key}`,
          allColorsCounter: this.state.allColorsCounter,
          legColorsCounter: this.state.legColorsCounter,
          colorType: 'all'
        }
        plotsArr.forEach((stop, i) => {
          const { legStartEndCellNums, holdAllLegColorArrs } = this.legStartEnd(
            stop.x,
            stop.y,
            'all'
          )
          tempGridSet.legColorData.push(holdAllLegColorArrs)
          tempGridSet.legStartEnd.push(legStartEndCellNums)
          const { tempCellNumsArr, tempCellNumsObj } = this.colorGrid(
            stop.x,
            stop.y,
            'all',
            lineColor,
            tempGridSet.gridColorDataObj
          )
          tempGridSet.gridColorDataObjs = [
            ...tempGridSet.gridColorDataObjs,
            ...tempCellNumsArr
          ]
          tempGridSet.gridColorDataObj = {
            ...tempGridSet.gridColorDataObj,
            ...tempCellNumsObj
          }
        })
        this.setState(prevState => ({
          gridSets: [...prevState.gridSets, tempGridSet]
        }))
        this.resetColorGridState()

        // this.setState(prevState => ({
        //   legsCoordsObjs: [...prevState.legsCoordsObjs, legArr],
        //   legsStartEndObjs: [...prevState.legsStartEndObjs, legData],
        //   holdAllStopColorIndexes: [
        //     ...prevState.holdAllStopColorIndexes,
        //     gridColorData
        //   ]
        // }))
        // })
      }
      this.setState({
        finalStopColorCellArr: this.makeSingleCellNumArr(),
        finalStopColorCellObj: this.makeSingleCellNumObj()
      })
    })
  }
  // combine all color cells into one array
  makeSingleCellNumArr() {
    const arr = this.state.gridSets
      .map(obj => {
        console.log(obj)
        return obj.gridColorDataObjs
      })
      .flat()
    return arr
  }
  // spread all objs into one big one for lookup
  makeSingleCellNumObj() {
    let allObjs = {}
    this.state.gridSets.forEach(obj => {
      allObjs = { ...allObjs, ...obj.gridColorDataObj }
    })
    return allObjs
  }
  createGraph() {
    let that = this
    // take state of graph and multiple to get num
    let cells =
      parseInt(this.props.setGraphSize.x) * parseInt(this.props.setGraphSize.y)
    if (!cells) {
      console.error('No cell values')
      return
    }
    that.setState({
      boxesToRender: Array.from({ length: cells }, (v, i) => i)
    })
    setCSSvars()
    // sets vals in css to grid size
    function setCSSvars() {
      // console.log(that.state.setGraphSize)
      let root = document.documentElement
      root.style.setProperty('--graph-size-x', that.props.setGraphSize.x)
      root.style.setProperty('--graph-size-y', that.props.setGraphSize.y)
    }
    setTimeout(() => {
      this.setState({
        startingCellNumAll: utils._calcStartingCell(this.props.setGraphSize)
      })
      this.calcRowVariaion()
    })
  }
  // takes coords and type - needs access to state
  _numToMove(x, y, type) {
    if (type === 'stop') {
      let moveX = Math.abs(this.state.previousStopX - x)
      let moveY = Math.abs(this.state.previousStopY - y)
      return {
        tempX: moveX,
        tempY: moveY
      }
    } else if (type === 'leg') {
      let moveX = Math.abs(this.state.previousLegX - x)
      let moveY = Math.abs(this.state.previousLegY - y)
      return {
        tempX: moveX,
        tempY: moveY
      }
    } else {
      console.error('error in the num to move function')
    }
  }
  // take amount in leg with a percent - returns num to move out of total leg number
  _percentToCoords(diffObj, percent) {
    let xNum = Math.floor(diffObj.xDiff * 0.01 * percent)
    let yNum = Math.floor(diffObj.yDiff * 0.01 * percent)
    return { xNum, yNum }
  }
  // update createCounter by 1
  increaseCursorIdindex() {
    let x = this.state.createCounter + 1
    this.setState({
      createCounter: x
    })
  }
  // new add driver - runs on mount and when add button clicked
  addNewCursor() {
    let newCursorObj = {
      directions: {
        xDir: 'left',
        yDir: 'bottom'
      },
      pixels: {
        moveX: 0,
        moveY: 0
      },
      id: this.state.createCounter,
      name: `cursor ${this.state.createCounter + 1}`,
      color: 'blue',
      show: true
    }
    let arr = []
    arr.push(newCursorObj)
    let allCursors = this.state.cursorArr.concat(arr)
    this.setState({
      cursorArr: allCursors
    })
    this.increaseCursorIdindex()
  }
  // on click set driver with coords and send to child
  updateDriverWithCoords(coords, type) {
    let selectedDriver = this.state.cursorArr[this.state.cursorIndex]
    let cursorArr = [...this.state.cursorArr]
    if (type === 'form') {
      // reset to zero
      this._resetCursor()
      // from form
      coords = this._setStopCoords(
        'driver',
        this.state.cursorFormX,
        this.state.cursorFormY
      )
      // toggle driver to first stop of map start
    } else if (type === 'checkbox') {
    } else if (type === 'slider') {
      // from params
      coords = this._setStopCoords('driver', coords.x, coords.y)
    } else if (type === 'manual') {
      // reset to zero
      this._resetCursor()
      coords = this._setStopCoords('driver', '10', '10')
      cursorArr[this.state.cursorIndex].driverCoords = { x: 5, y: 5 }
    }
    // subtract for icon positionSelect
    coords.pixels.moveX = coords.pixels.moveX - 30
    // update the values in the object
    cursorArr[this.state.cursorIndex].directions = coords.directions
    cursorArr[this.state.cursorIndex].pixels = coords.pixels
    // set new driver vals
    this.setState({
      cursorArr: cursorArr
    })
  }
  // calc up to driver position to color
  colorCompleted(legID, type) {
    let selectedDriver = this.state.cursorArr[this.state.cursorIndex]
    var arr = this.state.legs.filter(leg => {
      // console.log(leg.legID)
      return leg.legID === legID
    })

    // index for arr of cell nums
    let holdingArrIndex = this._legIndex(arr[0].legID)
    // index for json with legs info
    let dataIndex = this.state.legs.indexOf(arr[0])
    // all previous legs to color
    // var previousLegNames = this.state.legs.slice(0,index)

    // get arr of all previous arrs to cell nums
    // var previousLegArrs = this.state.holdAllLegColorArrs.slice(0, holdingArrIndex)
    // get current arr leg of cell nums
    // var currentLegArr = this.state.holdAllLegColorArrs[holdingArrIndex]
    // console.log('previouslegs', previousLegArrs)
    // console.log('currnt arr', currentLegArr)
    // get current and next leg json info
    let thisLeg = this.state.legs[dataIndex]
    // console.log(thisLeg)
    let legFirstStop = this.state.stops.filter(stop => {
      return stop.name === thisLeg.startStop
    })
    // console.log(legFirstStop)
    let legLastStop = this.state.stops.filter(stop => {
      return stop.name === thisLeg.endStop
    })
    // get first and end coords
    let stopStartCoords = {
      x: legFirstStop[0].x,
      y: legFirstStop[0].y
    }
    let stopEndCoords = {
      x: legLastStop[0].x,
      y: legLastStop[0].y
    }
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
    let start = this.state.legStartEndCellNums[holdingArrIndex]
    // console.log('start/end', start, end)
    // set startingCell and start x / y

    // this.state.startingCellNumPartial: start/end cells
    // 24034 34034
    // this.partialLegStartCoords: start x/y
    // {x: 35, y: 80}
    // this.state.partialLegEndCoords: end
    // {x: 35, y: 30}
    var previousLegArrs = this.state.holdAllLegColorArrs.slice(
      0,
      holdingArrIndex
    )

    this.setState({
      startingCellNumPartial: start,
      partialLegStartCoords: stopStartCoords,
      partialLegEndCoords: stopEndCoords,
      holdingCompletedArrs: [...previousLegArrs]
    })
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
      this.legStartEnd(
        selectedDriver.driverCoords.x,
        selectedDriver.driverCoords.y,
        'partial'
      )
    } else if (type === 'coords') {
      this.legStartEnd(
        selectedDriver.driverCoords.x,
        selectedDriver.driverCoords.y,
        'partial'
      )
    }
  }
  // calc num of cells to vertial based on grid size
  calcRowVariaion() {
    // formula - move up/down is the same value as x and y
    this.setState({
      moveRowCells: parseInt(this.props.setGraphSize.x)
    })
  }
  colorGrid(x, y, type, lineColor, objStore) {
    // calc num of units to move based on prev position
    let tempCellNumsArr = []
    let tempCellNumsObj = {}
    let tempX = x
    let tempY = y
    let tempCellNum
    let loopAxis

    if (type === 'all') {
      tempCellNum = this.state.startingCellNumAll
    }
    // convert based on next move using above function
    tempX = this._numToMove(tempX, tempY, 'stop').tempX
    tempY = this._numToMove(tempX, tempY, 'stop').tempY
    // on first move on grid only - for bottom corner
    if (this.state.previousStopX === 0 && this.state.previousStopY === 0) {
      tempX = tempX - 1
      tempY = tempY - 1
      const obj = utils._makePLotCellObj(tempCellNum, lineColor, utils._Cell)
      tempCellNumsArr.push(obj)
      tempCellNumsObj[obj.cellNum] = obj
    }
    // move in tandem while both vals exist
    while (tempX && tempY) {
      // console.log(tempX)
      // if last was les than current- do this
      if (this.state.previousStopY < y) {
        tempCellNum = tempCellNum - this.state.moveRowCells
        const obj = utils._makePLotCellObj(tempCellNum, lineColor, utils._Cell)
        tempCellNumsArr.push(obj)
        tempCellNumsObj[obj.cellNum] = obj
      } else if (this.state.previousStopY > y) {
        tempCellNum = tempCellNum + this.state.moveRowCells
        const obj = utils._makePLotCellObj(tempCellNum, lineColor, utils._Cell)
        tempCellNumsArr.push(obj)
        tempCellNumsObj[obj.cellNum] = obj
      }
      if (this.state.previousStopX < x) {
        tempCellNum = tempCellNum + 1
        const obj = utils._makePLotCellObj(tempCellNum, lineColor, utils._Cell)
        tempCellNumsArr.push(obj)
        tempCellNumsObj[obj.cellNum] = obj
      } else if (this.state.previousStopX > x) {
        tempCellNum = tempCellNum - 1
        const obj = utils._makePLotCellObj(tempCellNum, lineColor, utils._Cell)
        tempCellNumsArr.push(obj)
        tempCellNumsObj[obj.cellNum] = obj
      }
      tempX = tempX - 1
      tempY = tempY - 1
    }
    // axis - loop over the only one left X or Y
    loopAxis = tempY ? (loopAxis = tempY) : (loopAxis = tempX)
    // if only on val left, move on its own
    for (var i = 0; i < loopAxis; i++) {
      if (tempY) {
        if (this.state.previousStopY < y) {
          tempCellNum = tempCellNum - this.state.moveRowCells
          const obj = utils._makePLotCellObj(
            tempCellNum,
            lineColor,
            utils._Cell
          )
          tempCellNumsArr.push(obj)
          tempCellNumsObj[obj.cellNum] = obj
        } else if (this.state.previousStopY > y) {
          tempCellNum = tempCellNum + this.state.moveRowCells
          const obj = utils._makePLotCellObj(
            tempCellNum,
            lineColor,
            utils._Cell
          )
          tempCellNumsArr.push(obj)
          tempCellNumsObj[obj.cellNum] = obj
        }
      } else if (tempX) {
        if (this.state.previousStopX < x) {
          tempCellNum = tempCellNum + 1
          const obj = utils._makePLotCellObj(
            tempCellNum,
            lineColor,
            utils._Cell
          )
          tempCellNumsArr.push(obj)
          tempCellNumsObj[obj.cellNum] = obj
        } else if (this.state.previousStopX > x) {
          tempCellNum = tempCellNum - 1
          const obj = utils._makePLotCellObj(
            tempCellNum,
            lineColor,
            utils._Cell
          )
          tempCellNumsArr.push(obj)
          tempCellNumsObj[obj.cellNum] = obj
        }
      }
    }
    if (type === 'all') {
      this.setState({
        previousStopX: x,
        previousStopY: y,
        startingCellNumAll: tempCellNum
      })
    }
    return {
      tempCellNumsArr,
      tempCellNumsObj
    }
  }
  // takes x y and determine start and end cells
  legStartEnd(x, y, type) {
    let tempCellNumsArr = []
    let tempX = x
    let tempY = y
    // start remains the same
    let tempStartNum
    // cell num changes with calcs
    let tempCellNum
    let loopAxis
    if (type === 'all') {
      // on first move only
      if (this.state.previousLegEndCell === 0) {
        tempStartNum = this.state.startingCellNumAll
        tempCellNum = this.state.startingCellNumAll
      } else {
        tempStartNum = this.state.previousLegEndCell
        tempCellNum = this.state.previousLegEndCell
      }
    } else if (type === 'partial') {
      // start of leg
      tempCellNum = this.state.startingCellNumPartial
      // need to reset previous x and y
      this.setState({
        previousLegX: this.state.partialLegStartCoords.x,
        previousLegY: this.state.partialLegStartCoords.y
      })
    }
    // convert based on next move using above function
    ;({ tempX, tempY } = this._numToMove(tempX, tempY, 'leg'))
    // on first move on grid only - for bottom corner
    if (this.state.previousLegX === 0 && this.state.previousLegY === 0) {
      tempX = tempX - 1
      tempY = tempY - 1
      tempCellNumsArr.push(tempCellNum)
    }
    // move in tandem while both vals exist
    while (tempX && tempY) {
      // if last was les than current- do this
      if (this.state.previousLegY < y) {
        tempCellNum = tempCellNum - this.state.moveRowCells
        tempCellNumsArr.push(tempCellNum)
      } else if (this.state.previousLegY > y) {
        tempCellNum = tempCellNum + this.state.moveRowCells
        tempCellNumsArr.push(tempCellNum)
      }
      if (this.state.previousLegX < x) {
        tempCellNum = tempCellNum + 1
        tempCellNumsArr.push(tempCellNum)
      } else if (this.state.previousLegX > x) {
        tempCellNum = tempCellNum - 1
        tempCellNumsArr.push(tempCellNum)
      }
      tempX = tempX - 1
      tempY = tempY - 1
    }
    // axis - loop over the only one left X or Y
    loopAxis = tempY ? (loopAxis = tempY) : (loopAxis = tempX)
    // if only on val left, move on its own
    for (var i = 0; i < loopAxis; i++) {
      if (tempY) {
        if (this.state.previousLegY < y) {
          tempCellNum = tempCellNum - this.state.moveRowCells
          tempCellNumsArr.push(tempCellNum)
        } else if (this.state.previousLegY > y) {
          tempCellNum = tempCellNum + this.state.moveRowCells
          tempCellNumsArr.push(tempCellNum)
        }
      } else if (tempX) {
        if (this.state.previousLegX < x) {
          tempCellNum = tempCellNum + 1
          tempCellNumsArr.push(tempCellNum)
        } else if (this.state.previousLegX > x) {
          tempCellNum = tempCellNum - 1
          tempCellNumsArr.push(tempCellNum)
        }
      }
    }
    let legCellNums = {
      start: tempStartNum,
      end: tempCellNum
    }
    // - make this previousLast
    if (type === 'all') {
      this.setState({
        previousLegEndCell: tempCellNum,
        previousLegX: x,
        previousLegY: y
        // legStartEndCellNums: [...this.state.legStartEndCellNums, legCellNums],
        // holdAllLegColorArrs: [
        //   ...this.state.holdAllLegColorArrs,
        //   tempCellNumsArr
        // ]
      })
      return {
        legStartEndCellNums: legCellNums,
        holdAllLegColorArrs: tempCellNumsArr
      }
    } else if (type === 'partial') {
      this.setState({
        previousStopX: x,
        previousStopY: y,
        startingCellNumPartial: tempCellNum,
        holdingCompletedArrs: [
          ...this.state.holdingCompletedArrs,
          tempCellNumsArr
        ]
      })
    }
  }
  // on click pass props to child
  colorCompletedStops() {
    console.log(this.state.holdingCompletedArrs)
    let merged = [].concat.apply([], this.state.holdingCompletedArrs)
    this.setState({
      finalCompletedColorsArr: merged
    })
  }
  // takes driver coords and finds the leg start
  _getLegStartfromCoords() {
    let selectedDriver = this.state.cursorArr[this.state.cursorIndex]
    let coords = selectedDriver.driverCoords
    // if x & y is between the stops
    let firstStop = this.state.stops.filter((coord, index) => {
      let stop1 = this.state.stops[index]
      let stop2 = this.state.stops[index + 1]
      if (stop2 === undefined) return false
      if (
        // x/y are both btw
        ((coords.y > stop1.y && coords.y < stop2.y) ||
          (coords.y < stop1.y && coords.y > stop2.y)) &&
        ((coords.x > stop1.x && coords.x < stop2.x) ||
          (coords.x < stop1.x && coords.x > stop2.x))
      ) {
        return coord
      } else if (
        // y is bwn and x is equal
        ((coords.y > stop1.y && coords.y < stop2.y) ||
          (coords.y < stop1.y && coords.y > stop2.y)) &&
        (coords.x === stop1.x && coords.x === stop2.x)
      ) {
        return coord
      } else if (
        // x is bwn and y is equal
        ((coords.x > stop1.x && coords.x < stop2.x) ||
          (coords.x < stop1.x && coords.x > stop2.x)) &&
        (coords.y === stop1.y && coords.y === stop2.y)
      ) {
        return coord
      } else if (
        // coords are exact match
        coords.x === stop1.x &&
        coords.y === stop1.y
      ) {
        return coord
        // first stop  on map with nothing previous
      } else if (index === 0 && coord === this.state.stops[0]) {
        // console.log('first stop on map')
        return coord
      } else {
        // not within the stops
        return null
      }
    })
    return firstStop
  }

  // resets data but does not move
  _resetCursor() {
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
    })
  }

  render() {
    return (
      <main className='graph-container'>
        <div className='graph'>
          {' '}
          {this.state.plotSets.map((instance, i) => {
            return (
              <Point
                key={i}
                color={instance ? instance.plotColor : null}
                coordsArrs={this.state.stopsDirsArr[i]}
                toggleStopNames={this.state.showStopNames}
              />
            )
          })}{' '}
          <Cell
            toRender={this.state.boxesToRender}
            allColorCellArr={
              !this.state.finalStopColorCellArr
                ? null
                : this.state.finalStopColorCellArr
            }
            allColorCellObj={
              !this.state.finalStopColorCellObj
                ? null
                : this.state.finalStopColorCellObj
            }
            type='all'
          />{' '}
        </div>
      </main>
    )
  }

  _legIndex(input) {
    let index
    switch (input) {
      // pre-stop
      case 'ZZ':
        index = 0
        break
      case 'AB':
        index = 1
        break
      case 'BC':
        index = 2
        break
      case 'CD':
        index = 3
        break
      case 'DE':
        index = 4
        break
      case 'EF':
        index = 5
        break
      case 'FG':
        index = 6
        break
      case 'GH':
        index = 7
        break
      case 'HI':
        index = 8
        break
      case 'IJ':
        index = 9
        break
      case 'JK':
        index = 10
        break
      case 'KL':
        index = 11
        break
      default:
        console.error('Nothing in switch')
        break
    }
    return index
  }
  colorLeg(input) {
    // if no props don't call
    if (!this.props.legToColorID) return
    // change it to an index
    let index = this._legIndex(input)
    // get leg using index out of array
    let leg = this.state.holdAllLegColorArrs[index]
    // set state on child to change the color
    let legObj = { leg, index }
    this.setState({
      finalLegColorObj: legObj,
      legColorsCounter: this.state.legColorsCounter + 1,
      colorType: 'leg'
    })
    console.log('FL', this.state.finalLegColorObj)
  }
  // build legs out of stops
  legConstructor(stops) {
    const legs = stops
      .map((stop, i) => {
        if (!stops[i + 1]) return false
        return {
          startStop: stop.name,
          endStop: stops[i + 1].name,
          legID: `${stop.name}${stops[i + 1].name}`
        }
      })
      .filter(stop => stop)
    return legs
  }
  // set coords in pxs of plots
  _setStopCoords(type, arr, x, y) {
    let that = this
    // filter out undefined
    if (type === 'stop') {
      setTimeout(function() {
        let coordsArr = []
        if (arr.length > 0) {
          arr.forEach(stop => {
            let pixels = utils._convertToPixels(stop.x, stop.y)
            let coords = {
              pixels: pixels,
              directions: {
                xDir: 'left',
                yDir: 'bottom'
              }
            }
            coordsArr.push(coords)
          })
        }
        that.setState(prevState => ({
          stopsDirsArr: [...prevState.stopsDirsArr, coordsArr]
        }))
      })
    } else if (type === 'driver') {
      let pixels = utils._convertToPixels(x, y)
      let coords = {
        pixels: pixels,
        directions: {
          xDir: 'left',
          yDir: 'bottom'
        }
      }
      return coords
    }
  }
}

export default Graph
