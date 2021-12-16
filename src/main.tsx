import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

// import { Ball } from './Ball'
import { Hexagons } from './Hexagons'
import { Canvas } from './Canvas'

ReactDOM.render(
  <React.StrictMode>
    {/* <Canvas /> */}
    <Hexagons />
  </React.StrictMode>,
  document.getElementById('root')
)
