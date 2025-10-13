'use client'

import { useState } from 'react'


export function Wordle({ wordle, nextWordle }: {
  wordle: {
    [solution: string]: string[]
  }
  nextWordle: () => void
}) {
  const solution = Object.keys(wordle).pop()!
  const hints = wordle[solution]!

  const [ guesses, setGuesses ] = useState<string[]>([])
  const makeGuess = (guess: string) =>
    (guess && guess.length === solution.length) && setGuesses((guesses) => [
      ...guesses,
      guess
    ])

  return (
    <form
      onSubmit={ (e) => {
        e.preventDefault()
        makeGuess(new FormData(e.currentTarget).get('guess') as string | null ?? '')
      } }
      className='flex flex-col w-lg mx-auto items-stretch'
    >
      <table>
        <thead>
          <tr>
            <th>Round</th>
            <th>Guess</th>
            <th>Hint</th>
          </tr>
        </thead>
        <tbody>
          { hints.slice(0, guesses.length+1).map((hint, round) => (
            <tr key={ round } className={ `px-2 py-2 ${round === guesses.length ? 'font-semibold' : ''}` }>
              <td className='font-mono text-end'>
                { round + 1 }
              </td>
              <td className='px-2 py-2'>{
                guesses[round]
                ? <FormattedGuess guess={ guesses[round] } solution={ solution } />
                : <GuessInput />
              }</td>
              <td className='px-2 py-2'>
                { hint }
              </td>
            </tr>
          )) }
        </tbody>
      </table>
      { guesses.length < hints.length
        ? <GuessButton solution={ solution } />
        : <button
            autoFocus
            onClick={ () => {
              setGuesses(() => [])
              nextWordle()
            } }
            className='px-2 py-1 bg-blue-500 dark:bg-orange-500 text-white rounded'
          >Next Wordle</button>
      }
    </form>
  )
}

function FormattedGuess({ guess, solution }: {
  guess: string
  solution: string
}) {
  return (
    <div className='font-mono text-center'>
      { guess.toUpperCase().split('').map((c, n) => (
        <span
          key={ n }
          className={
            solution.toUpperCase().includes(c)
            ? c === solution.toUpperCase().at(n)
              ? 'text-green-500'
              : 'text-yellow-500'
            : 'text-red-500'
          }
        >{ c }</span>
      )) }
    </div>
  )
}

function GuessInput() {
  return (
    <input
      type='text'
      name='guess'
      autoFocus
      className='px-2 py-1 min-w-full font-mono text-center border border-gray-300 dark:border-gray-700 rounded'
    />
  )
}

function GuessButton({ solution }: {
  solution: string
}) {
  return (
    <input
      type='submit'
      value={ `Submit (${ solution.length })` }
      className='px-2 py-1 bg-blue-500 dark:bg-orange-500 text-white rounded'
    />
  )
}
