import React from 'react'
import styles from '../utils/styles'
import PropTypes from 'prop-types'

class Cell extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      allColored: false
    }
    this.CellMarkup = this.CellMarkup.bind(this)
  }
  renderCells(i) {
    if (this.props.toRender) {
      const { toRender } = this.props
      return toRender.map((obj, i) => {
        let result
        switch (this.props.type) {
          case 'all':
            result = this.allColorsAddLogic(i)
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
    } else {
      return styles.cellStyles.cell
    }
  }
  CellMarkup(input) {
    let idStr = `id${input.id}`
    return (
      <div
        style={this.addColor(input.color)}
        id={idStr}
        key={input.id}
        className='cell'
      />
    )
  }

  render() {
    if (this.props.toRender && this.props.toRender.length) {
      return <React.Fragment>{this.renderCells()}</React.Fragment>
    } else {
      return <div>No Cells yet!</div>
    }
  }
}
Cell.propTypes = {
  allColorCellObj: PropTypes.object,
  toRender: PropTypes.array,
  type: PropTypes.string
}
export default Cell
