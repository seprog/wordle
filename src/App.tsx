import random from 'random'

import { Wordle } from './Wordle'

import wordles from './wordles.yaml'
import './index.css'


export default function App() {
  const searchParams = new URLSearchParams(window.location.search)

  // get wordleId from searchParams
  const wordleId = Number.parseInt(searchParams.get('wordleId') ?? '')
  const wordle = wordles[wordleId]

  // safeguard wordle / wordleId
  if (!wordle) {
    searchParams.set('wordleId', random.int(0, wordles.length).toString())
    window.location.search = searchParams.toString()
  }

  return (
    <div>
      <Header />
      { wordle && <Main
        wordle={ wordle }
      /> }
      <Footer wordleId={wordleId} />
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

function Main({ wordle }: {
  wordle: {
    [solution: string]: string[]
  }
}) {
  return (
    <main className='max-w-3xl mx-auto px-6'>
      <Wordle
        wordle={ wordle }
      />
    </main>
  )
}

function Footer({ wordleId }: {
  wordleId: number
}) {
  return (
    <footer className='fixed left-0 right-0 bottom-1'>
      <p className='text-xs text-center text-gray-500'>
        wordleID: <span className='font-semibold'>{ wordleId.toString() }</span>
      </p>
    </footer>
  )
}
