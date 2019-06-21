import React from 'react'
import styles from '../utils/styles'

// takes and array of directions and pixes for x and y
function Point(props) {
  if (!props.coordsArrs) return null

  function injectIntoHead() {
    let output = ''
    let stylesArr = Object.keys(styles.pointStyles)
    for (let i = 0; i < stylesArr.length; i += 1) {
      let j = Object.keys(styles.pointStyles[stylesArr[i]])
      // console.log('j', j)
      let k = Object.values(styles.pointStyles[stylesArr[i]])
      // console.log('k', k)

      output += `.${stylesArr[i]}\n {`
      // console.log('SA', stylesArr[i])
      for (let a = 0; a < j.length; a += 1) {
        // console.log('KEY', j[a])
        // console.log('VAL', k[a])
        output += ` ${j[a]}: ${k[a]}; `
      }

      output += '}\n\n'
    }
    console.log('output', output)

    // styleStr1 = `.point-marker: ${styleStr1}`
    // let tag = document.createElement('style')
    let styleTag = document.createElement('style')
    styleTag.type = 'text/css'
    // let str = `body: {background-color:yellow}`
    let node = document.createTextNode(output)
    styleTag.append(node)
    console.log(styleTag)

    // let node = document.createTextNode(styleStr)
    // tag.appendChild(node)
    // tag.type = 'text/css'
    // console.log(tag)
    // let style = JSON.stringify(styles.pointStyles['point-marker:before'])
    // style = `point-marker:before ${style}`
    // console.log(style)

    let head = document.querySelector('head')

    head.appendChild(styleTag)
    // let tag = document.createElement(node)
    // console.log(head)
    // console.log(tag)
    // tag.appendChild(style)
    // console.log(tag)
    // head.append
  }
  injectIntoHead()
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
    return <div className='point-marker' style={styles} key={i} />
  })
}

export default Point
