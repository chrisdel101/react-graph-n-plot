const gridStyles = function(props) {
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
      gridTemplateRows: `repeat(${props.setGraphSize.y}, 10px)`,
      gridTemplateColumns: `repeat(${props.setGraphSize.x}, 10px)`
    }
  }
}
const cellStyles = {
  cell: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff'
  }
}
const pointStyles = {
  'point-marker:before': {
    content: "'●'",
    'font-size': '10px'
  },
  'point-marker': {
    position: 'absolute',
    bottom: '0px'
  }
}
const bodyStyles = {
  body: {
    margin: 0,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale'
  }
}
module.exports = {
  bodyStyles,
  cellStyles,
  gridStyles,
  pointStyles
}
// export gridStyles
