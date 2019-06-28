import React, { Component } from 'react'

import Graph from 'react-graph-n-plot'

const plotSets = [
  {
    plots: [{ x: 5, y: 5 }, { x: 8, y: 10 }, { x: 12, y: 14 }, { x: 13, y: 15 }],
    plotColor: 'green',
    lineColor: 'yellow'
  },
  {
    plots: [{ x: 5, y: 5 }, { x: 6, y: 5 }, { x: 8, y: 7 }, { x: 14, y: 9 }],
    plotColor: 'blue',
    lineColor: 'red'
  },
  {
    plots: [{ x: 1, y: 3 }, { x: 2, y: 5 }, { x: 3, y: 10 }, { x: 3, y: 15 }],
    plotColor: 'black',
    lineColor: 'blue'
  }
]
export default class App extends Component {
  render() {
    return <Graph setGraphSize={{ x: 20, y: 20 }} plotSets={plotSets} />
  }
}
