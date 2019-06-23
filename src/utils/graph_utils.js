var utils = (function() {
  return {
    _convertToPixels: function(x, y) {
      if (!x) {
        x = 0
      }
      if (!y) {
        y = 0
      }
      let totalX
      let totalY
      if (x) {
        x = x - 10
        totalX = 100 + x * 11
      } else {
        totalX = x * 10
      }
      if (y) {
        y = y - 10
        totalY = 100 + y * 11
      } else {
        totalY = y * 10
      }
      let moveX = parseInt(totalX)
      let moveY = parseInt(totalY)
      let coordsObj = {
        moveX: moveX,
        moveY: moveY
      }
      return coordsObj
    },
    _numToMove: function(x, y, type) {
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
    },
    _calcStartingCell: function(sizeObj) {
      // find the corner cell formula is (x * y) - x
      let startingCellNum =
        parseInt(sizeObj.x) * parseInt(sizeObj.y) - parseInt(sizeObj.x)
      return startingCellNum
    },
    // make json from the entered plot points
    _makePlotJson(plotsArr) {
      return plotsArr.map((coords, i) => {
        return {
          name: String.fromCharCode(i + 65),
          x: coords.x,
          y: coords.y
        }
      })
    },
    _Cell(cellNum, color) {
      this.cellNum = cellNum
      this.color = color
    },
    _makePLotCellObj(cellNum, color, CellFunc) {
      return new CellFunc(cellNum, color)
    },
    _arrOfObjsToArr(arrOfObjs, property) {
      return arrOfObjs.map(obj => {
        return obj[property]
      })
    }
  }
})()

export default utils
