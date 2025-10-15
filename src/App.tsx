'use client'

import { useEffect, useState } from 'react'

import { Wordle } from './Wordle'
import { factorial } from './lib/wordleHelper'

import './index.css'


export default function App() {
  const [ category, setCategory ] = useState<string>()
  const [ seed, setSeed ] = useState<number>()
  const [ wordleQueue, setWordleQueue ] = useState<{
    solution: string
    hints: string[]
  }[]>()

  useEffect(() => {
    fetch(`/api/queue${window.location.search}`)
      .then(r => r.json())
      .then(({ category, seed, permutation }) => {
        setCategory(() => category)
        setSeed(() => seed)
        setWordleQueue(() => permutation)
      })
      .catch(() => {
        setWordleQueue(() => [])
      })
  }, [window.location.search, setCategory, setSeed, setWordleQueue])

  const [ level, setLevel ] = useState(0)

  return (
    <div>
      <Header />
      { wordleQueue
        ? <Main
          wordleQueue={ wordleQueue }
          level={ level }
          nextWordle={ () => setLevel((level) => level + 1) }
        />
        : <h2 className='text-2xl text-center text-slate-500'>Loading...</h2>
      }
      <Footer
        category={ category ?? '' }
        seed={ seed ?? -1 }
        level={ level ?? -1 }
        levels={ wordleQueue?.length ?? -1 }
      />
    </div>
  )
}

function Header() {
  return (
    <header className='p-6'>
      <h1 className='text-4xl text-center font-bold bg-gradient-to-b from-slate-600 to-slate-900 dark:from-slate-100 dark:to-slate-400 text-transparent bg-clip-text'>Wordle</h1>
      <p className='text-sm text-center text-slate-500'>
        by <a className='font-semibold' href='https://github.com/seprog'>seprog</a>
      </p>
    </header>
  )
}

function Main({ wordleQueue, level, nextWordle }: {
  wordleQueue: {
    solution: string
    hints: string[]
  }[]
  level: number
  nextWordle: () => void
}) {
  return (
    <main className='max-w-3xl mx-auto p-2'>{
      wordleQueue[level]
      ? <Wordle
        wordle={
          wordleQueue[level]
        }
        nextWordle={ nextWordle }
      />
      : <>
        <h2 className='text-2xl text-center text-purple-500 dark:text-rose-500'>Category completed!</h2>
        <p className='text-lg text-center'>🎉</p>
      </>
    }</main>
  )
}

function Footer({ category, seed, level, levels }: {
  category: string
  seed: number
  level: number
  levels: number
}) {
  return (
    <footer className='fixed left-0 right-0 bottom-1'>
      <p className='text-xs text-center text-slate-500'>level: <span className='font-semibold'>{ (level+1).toString() }/{ levels.toString() }</span></p>
      <p className='text-xs text-center text-slate-500'>seed: <span className='font-semibold'>{ (seed+1).toString() }/{ factorial(levels) }</span></p>
      <p className='text-xs text-center text-slate-500'>category: <span className='font-semibold'>{ category }</span></p>
    </footer>
  )
}
