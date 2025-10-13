'use client'

import { useEffect, useState } from 'react'

import { Wordle } from './Wordle'
import { factorial } from './lib/wordleHelper'

import './index.css'


export default function App() {
  const [ wordleQueue, setWordleQueue ] = useState<any[]|null>(null)
  const [ seed, setSeed ] = useState(0)
  const [ level, setLevel ] = useState(0)

  useEffect(() => {
    fetch(`/api/queue?seed=${encodeURIComponent(new URLSearchParams(window.location.search).get('seed') ?? '')}`)
      .then(r => r.json())
      .then(({ permutation, seed }) => {
        setWordleQueue(() => permutation)
        setSeed(() => seed)
      })
      .catch(() => {
        setWordleQueue(() => [])
      })
  }, [])

  if (!wordleQueue)
    return (<div className='my-6 text-2xl text-center text-gray-500>'>Loading…</div>)

  return (
    <div>
      <Header />
      <Main
        wordleQueue={ wordleQueue }
        level={ level }
        nextWordle={ () => setLevel((level) => level + 1) }
      />
      <Footer
        seed={ seed }
        level={ level }
        levels={ wordleQueue.length }
      />
    </div>
  )
}

function Header() {
  return (
    <header className='my-6'>
      <h1 className='text-4xl text-center font-bold'>Wordle</h1>
      <p className='text-sm text-center text-gray-500'>
        by <a className='font-semibold' href='https://github.com/seprog'>seprog</a>
      </p>
    </header>
  )
}

function Main({ wordleQueue, level, nextWordle }: {
  wordleQueue: {
    [solution: string]: string[]
  }[]
  level: number
  nextWordle: () => void
}) {
  return (
    <main className='max-w-3xl mx-auto px-6'>{
      wordleQueue[level]
      ? <Wordle
        wordle={ wordleQueue[level] }
        nextWordle={ nextWordle }
      />
      : <h2 className='text-2xl text-center text-violet-500'>You played ALL the Wordles!</h2>
    }</main>
  )
}

function Footer({ seed, level, levels }: {
  seed: number
  level: number
  levels: number
}) {
  return (
    <footer className='fixed left-0 right-0 bottom-1'>
      <p className='text-xs text-center text-gray-500'>level: <span className='font-semibold'>{ (level+1).toString() }/{ levels.toString() }</span></p>
      <p className='text-xs text-center text-gray-500'>seed: <span className='font-semibold'>{ (seed+1).toString() }/{ factorial(levels) }</span></p>
    </footer>
  )
}
