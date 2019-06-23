import React from 'react'
import styles from '../utils/styles'

// takes and array of directions and pixes for x and y
function Point(props) {
  if (!props.coordsArrs) return null

  // make string with the pseudo selector to add point icon
  function injectIntoHead() {
    let output = ''
    const stylesArr = Object.keys(styles.pointStyles)
    for (let i = 0; i < stylesArr.length; i++) {
      const j = Object.keys(styles.pointStyles[stylesArr[i]])
      const k = Object.values(styles.pointStyles[stylesArr[i]])

      output += `.${stylesArr[i]}\n {`
      for (let a = 0; a < j.length; a++) {
        output += ` ${j[a]}: ${k[a]}; `
      }
      output += '}\n\n'
    }
    let styleTag = document.createElement('style')
    styleTag.type = 'text/css'
    let node = document.createTextNode(output)
    styleTag.append(node)
    let head = document.querySelector('head')
    head.appendChild(styleTag)
  }
  injectIntoHead()

  let display
  !props.color ? (display = 'none') : (display = 'block')
  return props.coordsArrs.map((coord, i) => {
    let styles = {
      display: display,
      color: props.color,
      [coord.directions.xDir]: coord.pixels.moveX.toString() + 'px',
      [coord.directions.yDir]: coord.pixels.moveY.toString() + 'px'
    }
    return <div className='point-marker' style={styles} key={i} />
  })
}

export default Point
