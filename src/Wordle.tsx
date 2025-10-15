'use client'

import { useState } from 'react'


export function Wordle({ wordle, nextWordle }: {
  wordle: {
    solution: string
    hints: string[]
  }
  nextWordle: () => void
}) {
  const { solution, hints } = wordle

  const [ guesses, setGuesses ] = useState<string[]>([])
  const makeGuess = (guess: string) =>
    (guess && guess.trim().length === solution.length) && setGuesses((guesses) => [
      ...guesses,
      guess.trim()
    ])

  return (
    <form
      onSubmit={ (e) => {
        e.preventDefault()
        makeGuess(new FormData(e.currentTarget).get('guess') as string | null ?? '')
      } }
      className='flex flex-col'
    >
      <table>
        <thead>
          <tr className='text-nowrap'>
            <th>Round</th>
            <th>{ `Guess (${ solution.length })` }</th>
            <th>Hint</th>
          </tr>
        </thead>
        <tbody>
          { hints.map((hint, round) => (
            <tr key={ round } className={ `${round === guesses.length ? 'font-semibold' : ''}` }>
              <td className='px-2 py-2 font-mono text-end'>
                { round + 1 }
              </td>
              <td className='px-2 py-2'>{
                guesses[round]
                ? <FormattedGuess guess={ guesses[round] } solution={ solution } />
                : round == guesses.length
                  ? <GuessInput />
                  : <></>
              }</td>
              <td className='px-2 py-2'>
                { round <= guesses.length
                  ? hint
                  : '*'.repeat(hint.length)
                }
              </td>
            </tr>
          )) }
        </tbody>
      </table>
      { guesses.length < hints.length
        ? <GuessButton />
        : <NextWordleButton nextWordle={ () => {
          setGuesses(() => [])
          nextWordle()
        } } />
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

function GuessButton() {
  return (
    <input
      type='submit'
      value={ 'Submit' }
      className='px-2 py-1 bg-blue-500 dark:bg-orange-500 text-white rounded'
    />
  )
}

function NextWordleButton({ nextWordle }: {
  nextWordle: () => void
}) {
  return (
    <button
      autoFocus
      onClick={ nextWordle }
      className='px-2 py-1 bg-blue-500 dark:bg-orange-500 text-white rounded'
    >Next Wordle</button>
  )
}
