import React from 'react'
import styles from '../utils/styles'

// takes and array of directions and pixes for x and y
function Point(props) {
  if (!props.coordsArrs) return null

  function combineStyles(prevStyles) {
    return { ...prevStyles, ...styles.pointStyles['point-marker'] }
  }
  let display
  !props.color ? (display = 'none') : (display = 'block')
  return props.coordsArrs.map((coord, i) => {
    let styles = {
      display: display,
      color: props.color,
      [coord.directions.xDir]: coord.pixels.moveX.toString() + 'px',
      [coord.directions.yDir]: coord.pixels.moveY.toString() + 'px'
    }
    return (
      <div className='point-marker' style={combineStyles(styles)} key={i} />
    )
  })
}

export default Point
