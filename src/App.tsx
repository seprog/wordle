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
  const [ score, setScore ] = useState(0)
  const [ isDone, setIsDone] = useState(false)
  return (
    <main className='flex flex-col gap-2 max-w-3xl mx-2 p-2 bg-slate-200 dark:bg-slate-800 rounded-2xl'>
      { wordleQueue[level]
        ? <Wordle
            wordle={ wordleQueue[level] }
            nextWordle={ () => {
              setIsDone(() => false)
              nextWordle()
            } }
            setSolved={ (attempts: number) => {
              setIsDone(() => true)
              setCorrectLevels((correctLevels) => correctLevels + (attempts ? 1 : 0))
              setScore((score) => score + (attempts ? attempts**-1 : 0))
            } }
          />
        : <>
          <h2 className='text-2xl text-center text-transparent bg-clip-text bg-gradient-to-br from-purple-500 to-emerald-500 dark:from-orange-500 dark:to-rose-500 font-semibold'>Category completed!</h2>
          <p className='text-lg text-center'>🎉</p>
        </>
      }
      <Progress level={ level } correctLevels={ correctLevels } score={ score } isDone={ isDone } levels={ wordleQueue.length } />
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

function Progress({ level, correctLevels, score, isDone, levels }: {
  level: number
  correctLevels: number
  score: number
  isDone: boolean
  levels: number
}) {
  return (
    <div className='flex flex-row items-center gap-1 text-xs text-slate-700 dark:text-slate-300'>
      <p>{ `(${ Math.min(level+1, levels) }/${ levels })` }</p>
      <motion.div
        className='relative bg-slate-300 dark:bg-slate-700 h-2 w-full rounded-full'
        whileHover={{
          height: 16
        }}
      >
        <motion.div
          animate={ {
            width: `${ Math.round(Math.min(level+1, levels) / levels * 100) }%`,
            transition: {
              delay: 0 * .8,
              duration: 1.2
            }
          } }
          className={ 'absolute bg-gradient-to-br from-slate-400 to-slate-500 dark:from-slate-500 dark:to-slate-600 h-full rounded-full' }
        />
        <motion.div
          animate={ {
            width: `${ Math.round((level + (isDone ? 1 : 0)) / levels * 100) }%`,
            transition: {
              delay: 1 * .8,
              duration: 1.2
            }
          } }
          className={ 'absolute bg-gradient-to-br from-red-400 to-red-500 dark:from-red-500 dark:to-red-600 h-full rounded-full' }
        />
        <motion.div
          animate={ {
            width: `${ Math.round(correctLevels / levels * 100) }%`,
            transition: {
              delay: 2 * .8,
              duration: 1.2
            }
          } }
          className={ 'absolute bg-gradient-to-br from-yellow-400 to-yellow-500 dark:from-yellow-500 dark:to-yellow-600 h-full rounded-full' }
        />
        <motion.div
          animate={ {
            width: `${ Math.round(score / levels * 100) }%`,
            transition: {
              delay: 3 * .8,
              duration: 1.2
            }
          } }
          className={ 'absolute bg-gradient-to-br from-green-400 to-green-500 dark:from-green-500 dark:to-green-600 h-full rounded-full' }
        />
      </motion.div>
      <p className='text-green-500'>{ Math.round(score / ((level + (isDone ? 1 : 0)) || 1) * 100) }%</p>
      <p className='text-yellow-500'>{ Math.round(correctLevels / ((level + (isDone ? 1 : 0)) || 1) * 100) }%</p>
    </div>
  )
}
