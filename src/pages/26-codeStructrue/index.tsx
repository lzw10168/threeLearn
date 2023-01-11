import { useEffect } from 'react'
import Main from './Playground'


// eslint-disable-next-line no-unused-vars

function Index() {
  useEffect(() => {

    const main = new Main((document.querySelector('#mainCanvas') as HTMLCanvasElement))


  }, [])

  return <canvas id="mainCanvas" className="webgl"></canvas>
}
export default Index
