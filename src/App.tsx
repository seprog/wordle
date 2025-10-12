import random from 'random'

import { Wordle } from './Wordle'
import wordles from './wordles.yaml'
import './index.css'


export function App() {
  const searchParams = new URLSearchParams(window.location.search)

  return (
    <Wordle wordle={wordles[
      Math.min(wordles.length-1, Math.max(0,
        Number.parseInt(
          searchParams.get('cardId')
          ?? random.int(0, wordles.length).toString()
        ) ?? random.int(0, wordles.length)
      ))
    ]} />
  )
}


export default App
