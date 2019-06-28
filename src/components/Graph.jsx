import React, { Component } from 'react'
import Cell from './Cell.jsx'
import Point from './Point.jsx'
import utils from '../utils/graph_utils'
import gridStyles from '../utils/styles'
import PropTypes from 'prop-types'

class Graph extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stopsDirsArr: [],
      allColorsCounter: 0,
      colorType: '',
      plotSets: [],
      gridSets: [],
      startingCellNumAll: 0,
      previousStopX: 0,
      previousStopY: 0,
      boxesToRender: Array.from({ length: 100 }, (v, i) => i),
      finalStopColorCellObj: {},
      finalStopColorCellArr: []
    }
  }
  componentDidMount() {
    this.createGraph()
    this.loadPlotDatatoPlotSets()
    this.loadGridDataintoGridSets()
  }
  // make props coords into useable json
  loadPlotDatatoPlotSets(type) {
    let sets
    // if array
    if (Array.isArray(this.props.plotSets)) {
      sets = this.props.plotSets
      // if object
    } else {
      sets = Object.values(this.props.plotSets)
    }
    sets.forEach(set => {
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
          gridColorDataObjs: [],
          gridColorDataObj: {},
          name: `set${key}`,
          allColorsCounter: this.state.allColorsCounter,
          colorType: 'all'
        }
        plotsArr.forEach((stop, i) => {
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
  combineStyles() {
    let obj = {
      ...gridStyles.gridStyles(this.props).graphContainer,
      ...gridStyles.bodyStyles.body
    }
    return obj
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
  render() {
    return (
      <main className='graph-container' style={this.combineStyles()}>
        <div className='graph' style={gridStyles.gridStyles(this.props).graph}>
          {' '}
          {this.state.plotSets.map((instance, i) => {
            return (
              <Point
                key={i}
                color={instance ? instance.plotColor : null}
                coordsArrs={this.state.stopsDirsArr[i]}
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
}
Graph.propTypes = {
  plotSets: PropTypes.array,
  setGraphSize: PropTypes.object
}

export default Graph
