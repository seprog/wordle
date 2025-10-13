'use client'

import { useState } from 'react'
import random from 'random'

import { Wordle } from './Wordle'

import wordles from './wordles.yaml'
import './index.css'


function App() {
  const searchParams = new URLSearchParams(window.location.search)

  const randomWordleId = () =>
    Math.min(wordles.length-1, Math.max(0,
      Number.parseInt(
        searchParams.get('wordleId') ?? ''
      ) || random.int(0, wordles.length)
    ))
  const [ wordleId, setWordleId ] = useState(randomWordleId())

  return (
    <div>
      <Title />
      <Wordle
        wordle={ wordles[wordleId] }
        nextWordle={ () => setWordleId(() => randomWordleId()) }
      />
      <p className='fixed left-0 right-0 bottom-1 text-xs text-center text-gray-500'>
        wordleID: <span className='font-semibold'>{ wordleId }</span>
      </p>
    </div>
  )
}


export default App
function Title() {
  return (
    <div className='my-6'>
      <h1 className='text-4xl text-center font-bold'>Wordle</h1>
      <p className='text-sm text-center text-gray-500'>
        by <a className='font-semibold' href='https://github.com/seprog'>seprog</a>
      </p>
    </div>
  )
}

