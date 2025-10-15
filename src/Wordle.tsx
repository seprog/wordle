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
        if (guesses.length < hints.length)
          makeGuess(new FormData(e.currentTarget).get('guess') as string | null ?? '')
        else {
          setGuesses(() => [])
          nextWordle()
        }
      } }
      className='flex flex-col'
    >
      <WordleTable guesses={ guesses } hints={ hints } solution={ solution } />
      <input
        type='submit'
        value={ guesses.length < hints.length ? 'Submit' : 'Next Wordle' }
        className='px-2 py-1 bg-blue-500 dark:bg-orange-500 text-white rounded'
      />
    </form>
  )
}

function WordleTable({ guesses, hints, solution }:{
  guesses: string[]
  hints: string[]
  solution: string
}) {
  return (
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
          <tr key={ round } className={`${ round === guesses.length ? 'font-semibold' : '' }`}>
            <td className='px-2 py-2'>
              <p className='font-mono text-end'>
                { round + 1 }
              </p>
            </td>
            <td className='px-2 py-2'>{
              guesses[round]
              ? <PastGuess guess={ guesses[round] } known={ knownInformation(guesses, solution) } />
              : round === guesses.length
                ? <GuessInput known={ knownInformation(guesses, solution) } />
                : <FutureGuess known={ knownInformation(guesses, solution) } />
            }</td>
            <td className='px-2 py-2'>
              <p>{
                round <= guesses.length
                ? hint
                : '*'.repeat(hint.length)
              }</p>
            </td>
          </tr>
        )) }
      </tbody>
    </table>
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
      { known.positions.map((position, n) => (
        <span
          key={ n }
          className={
            position.is
            ? 'text-green-500'
            : 'text-gray-500'
          }
        >{ position.is ?? '-' }</span>
      )) }
    </div>
  )
}

function GuessInput({ known }: {
  known: KnownInformation
}) {
  const [ guessInput, setGuessInput ] = useState('')

  return (
    <div className='relative flex items-center justify-center'>
      <input
        type='text'
        name='guess'
        autoFocus
        value={ guessInput }
        onChange={ ({ currentTarget: { value } }) => setGuessInput(
          () => value.trimStart().slice(0, known.positions.length).toUpperCase()
        ) }
        className='px-2 py-1 font-mono text-center text-transparent text-shadow-transparent caret-slate-900 dark:caret-slate-100 border border-gray-300 dark:border-gray-700 rounded'
      />
      <div className='absolute font-mono text-center pointer-events-none'>
        { guessInput.split('').map((c, n) => (
          <span
            key={ n }
            className={
              known.positions[n]?.is === c
              ? 'text-green-500'
              : known.positions[n]?.is !== undefined || known.positions[n]!.isNot.includes(c)
                ? 'text-red-500'
                : known.occurences.includes(c)
                  ? 'text-yellow-500'
                  : 'text-slate-900 dark:text-slate-100'
            }
          >{ c }</span>
        )) }
      </div>
    </div>
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
