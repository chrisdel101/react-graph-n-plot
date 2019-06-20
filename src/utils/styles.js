const styles = function(props) {
  console.log('PP', props)
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
export default styles
