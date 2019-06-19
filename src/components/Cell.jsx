import React from 'react'
import utils from '../graph_utils'

// takes the num of boxes/cells to be produced
class Cell extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
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
    }
    this.CellMarkup = this.CellMarkup.bind(this)
  }
  renderCells(i) {
    // console.log(this.props.gridColors)
    if (this.props.toRender) {
      const { toRender } = this.props
      return toRender.map((obj, i) => {
        let result
        switch (this.props.type) {
          case 'all':
            if (!this.state.allColored) {
              result = this.allColorsRemoveLogic(i)
            } else if (this.state.allColored) {
              result = this.allColorsAddLogic(i)
            }
            break
          case 'leg':
            if (!this.state.legColored) {
              result = this.legColorsRemoveLogic(i)
            } else if (this.state.legColored) {
              result = this.legColorsAddLogic(i)
            }
            break
          case 'complete':
            if (!this.state.completeColored) {
              result = this.completedColorsRemoveLogic(i)
            } else if (this.state.completeColored) {
              result = this.completedColorsAddLogic(i)
            }
            break
          default:
            // on first render just run markup
            result = <this.CellMarkup key={i} id={i} />
            break
        }
        return result
      })
    }
  }
  toggleColor(type) {
    if (type === 'all') {
      // console.log('opposite', this.state.allColored)
      this.setState({
        allColored: utils._toggleState(this.state.allColored)
      })
      // console.log(this.state.allColored)
    } else if (type === 'leg') {
      console.log('opposite', this.state.legColored)
      this.setState({
        legColored: utils._toggleState(this.state.legColored)
      })
    } else if (type === 'complete') {
      console.log('opposite', this.state.completeColored)
      this.setState({
        completeColored: utils._toggleState(this.state.completeColored)
      })
    }
  }
  allColorsRemoveLogic(i) {
    let { gridColors } = this.props
    let hasStopColor = (() => {
      if (gridColors && gridColors.includes(i)) return false
    })()
    return <this.CellMarkup hasStopColor={hasStopColor} key={i} id={i} />
  }
  legColorsAddLogic(i) {
    let { legsColor } = this.props
    legsColor = legsColor.leg
    let hasLegColor = (() => {
      if (!legsColor || !legsColor.length || !legsColor.includes(i))
        return false
      return true
    })()
    return <this.CellMarkup hasLegColor={hasLegColor} key={i} id={i} />
  }
  legColorsRemoveLogic(i) {
    let { legsColor } = this.props
    legsColor = legsColor.leg
    let hasLegColor = (() => {
      if (legsColor && legsColor.includes(i)) return false
    })()
    return <this.CellMarkup hasLegColor={hasLegColor} key={i} id={i} />
  }
  completedColorsAddLogic(i) {
    let { completeColor } = this.props
    let hasCompletionColor = (() => {
      if (!completeColor || !completeColor.length || !completeColor.includes(i))
        return false
      return true
    })()
    return (
      <this.CellMarkup hasCompletionColor={hasCompletionColor} key={i} id={i} />
    )
  }
  completedColorsRemoveLogic(i) {
    let { completeColor } = this.props
    let hasCompletionColor = (() => {
      if (completeColor && completeColor.includes(i)) return false
    })()
    return (
      <this.CellMarkup hasCompletionColor={hasCompletionColor} key={i} id={i} />
    )
  }
  allColorsAddLogic(i) {
    let { allColorCellObj } = this.props
    // key object key with i
    return <this.CellMarkup key={i} id={i} color={allColorCellObj[i]} />
  }
  addColor(cellObj) {
    if (cellObj) {
      return {
        backgroundColor: cellObj.color
      }
    }
    return null
  }
  CellMarkup(input) {
    let idStr = `id${input.id}`
    return (
      <div
        style={this.addColor(input.color)}
        id={idStr}
        key={input.id}
        className="cell"
      />
    )
  }
  componentDidMount() {
    this.toggleColor('all')
    // get arr of all cell nums
  }
  render() {
    // console.log(this.props)
    if (this.props.toRender && this.props.toRender.length) {
      return <React.Fragment>{this.renderCells()}</React.Fragment>
    } else {
      return <div>No Cells yet!</div>
    }
  }
}

export default Cell
