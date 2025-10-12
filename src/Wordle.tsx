'use client'

import { useState } from 'react'


export function Wordle({ wordle }: {
  wordle: {
    [solution: string]: string[]
  }
}) {
  const solution = Object.keys(wordle).pop()!
  const hints = wordle[solution]!

  const [ guesses, setGuesses ] = useState<string[]>([])
  function makeGuess(guess: string) {
    if (guess && guess.length === solution.length) setGuesses((guesses) => [
      ...guesses,
      guess
    ])
  }

  return (
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
          <tr key={round}>
            <td>{ round + 1 }</td>
            <td>{
              guesses[round]
              ? <FormattedGuess guess={guesses[round]} solution={solution} />
              : <GuessForm makeGuess={makeGuess} solutionLength={solution.length} />
            }</td>
            <td>{ hint }</td>
          </tr>
        )) }
      </tbody>
    </table>
  )
}

function FormattedGuess({ guess, solution }: {
  guess: string,
  solution: string
}) {
  return (
    guess.toUpperCase().split('').map((c, n) => (
      <span
        key={n}
        className={
          solution.toUpperCase().includes(c)
          ? c === solution.toUpperCase().at(n)
          ? 'text-green-700'
          : 'text-yellow-700'
          : 'text-red-700'
        }
      >{ c }</span>
    ))
  )
}

function GuessForm({ makeGuess, solutionLength }: {
  makeGuess: (guess: string) => void
  solutionLength: number
}) {
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      makeGuess(new FormData(e.currentTarget).get('guess') as string | null ?? '')
    }}>
      <input type='text' name='guess' autoFocus />
      <input type='submit' value={`Submit (${solutionLength})`} />
    </form>
  )
}
