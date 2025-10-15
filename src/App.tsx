'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

import { Wordle } from './Wordle'

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
    <div className='flex flex-col items-center justify-center'>
      <Header />
      { wordleQueue
        ? <Main
          wordleQueue={ wordleQueue }
          level={ level }
          nextWordle={ () => setLevel((level) => level + 1) }
        />
        : <h2 className='text-2xl text-center text-slate-500'>Loading...</h2>
      }
      { category !== undefined && seed !== undefined && (
        <Footer
          category={ category }
          seed={ seed }
        />
      ) }
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
  const [ correctLevels, setCorrectLevels ] = useState(0)
  return (
    <main className='flex flex-col gap-2 max-w-3xl mx-2 p-2 bg-slate-200 dark:bg-slate-800 rounded-2xl'>
      { wordleQueue[level]
        ? <Wordle
            wordle={
              wordleQueue[level]
            }
            nextWordle={ (solved: boolean) => {
              setCorrectLevels((correctLevels) => correctLevels + (solved ? 1 : 0))
              nextWordle()
            } }
          />
        : <>
          <h2 className='text-2xl text-center text-purple-500 dark:text-rose-500 font-semibold'>Category completed!</h2>
          <p className='text-lg text-center'>🎉</p>
        </>
      }
      <Progress level={ level } correctLevels={ correctLevels } levels={ wordleQueue.length } />
    </main>
  )
}

function Footer({ category, seed }: {
  category: string
  seed: number
}) {
  return (
    <footer className='fixed left-0 right-0 bottom-1'>
      <p className='text-xs text-center text-slate-500'>seed: <span className='font-semibold'>{ (seed).toString() }</span></p>
      <p className='text-xs text-center text-slate-500'>category: <span className='font-semibold'>{ category }</span></p>
    </footer>
  )
}

function Progress({ level, correctLevels, levels }: {
  level: number
  correctLevels: number
  levels: number
}) {
  return (
    <div className='flex flex-row items-center gap-1 text-xs text-slate-700 dark:text-slate-300'>
      <p>{ `(${ Math.min(level+1, levels) }/${ levels })` }</p>
      <div className='relative bg-slate-300 dark:bg-slate-700 h-2 w-full rounded-full'>
        <motion.div
          animate={ {
            width: `${ Math.floor(Math.min(level+1, levels) / levels * 100) }%`,
            transition: {
              duration: 1
            }
          } }
          className={ `absolute bg-gradient-to-br from-slate-400 to-slate-500 dark:from-slate-500 dark:to-slate-600 h-full rounded-full` }
        />
        <motion.div
          animate={ {
            width: `${ Math.floor(level / levels * 100) }%`,
            transition: {
              duration: 1
            }
          } }
          className={ `absolute bg-gradient-to-br from-sky-400 to-sky-500 dark:from-orange-500 dark:to-orange-600 h-full rounded-full` }
        />
        <motion.div
          animate={ {
            width: `${ Math.floor(correctLevels / levels * 100) }%`,
            transition: {
              duration: 1
            }
          } }
          className={ `absolute bg-gradient-to-br from-purple-400 to-purple-500 dark:from-rose-500 dark:to-rose-600 h-full rounded-full` }
        />
      </div>
      <p>{ Math.floor(correctLevels / (level || 1) * 100) }%</p>
    </div>
  )
}
