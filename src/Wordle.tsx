'use client'

import { useState } from 'react'


type KnownInformation = {
  positions: {
    is?: string
    isNot: string[]
  }[]
  occurences: string[]
}


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
            <th>Guess</th>
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
                ? <PastGuess guess={guesses[round]} known={ knownInformation(guesses, solution) } />
                : round == guesses.length
                  ? <GuessInput />
                  : <FutureGuess known={ knownInformation(guesses, solution) } />
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

function PastGuess({ guess, known }: {
  guess: string
  known: KnownInformation
}) {
  return (
    <div className='font-mono text-center'>
      { guess.split('').map((c, n) => (
        <span
          key={ n }
          className={
            known.occurences.includes(c)
            ? known.positions[n]!.is === c
              ? 'text-green-500'
              : 'text-yellow-500'
            : 'text-red-500'
          }
        >{ c }</span>
      )) }
    </div>
  )
}

function FutureGuess({ known }: {
  known: KnownInformation
}) {
  return (
    <div className='font-mono text-center'>
      { known.positions.map((c, n) => (
        <span
          key={ n }
          className={
            c.is
            ? 'text-green-500'
            : 'text-gray-500'
          }
        >{ c.is ?? '-' }</span>
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

function knownInformation(
  guesses: string[],
  solution: string
): KnownInformation {
  const solutionArray = solution.split('')
  return {
    positions: solutionArray.map((c, n) => ({
      is: guesses.some((guess) => guess.at(n) === c) ? c : undefined,
      isNot: guesses.map((guess) => guess.at(n) !== c ? guess.at(n) : undefined).filter((c) => c !== undefined)
    })),
    occurences: solutionArray.map((c) => guesses.some((guess) => guess.includes(c)) ? c : '')
  }
}
