import wordles from '../wordles.yaml'


export function getWordleQueue(category?: string, seed?: number) {
  // safeguard the category
  category = (category && wordles[category]) ? category : Object.keys(wordles)[Math.floor(Math.random() * Object.keys(wordles).length)]!

  return {
    category,
    ...getPermutation<{
      solution: string
      hints: string[]
    }>(
      wordles[category].map((wordle: {[solution: string]: string[]}) => ({
        solution: Object.keys(wordle)[0]!,
        hints: wordle[Object.keys(wordle)[0]!]!
      })),
      seed
    )
  }
}

export function getPermutation<T>(arr: readonly T[], seed?: number): {
  seed: number
  permutation: T[]
} {
  const n = arr.length
  const nFactorial = factorial(n)

  // safeguard the seed
  seed = (seed !== undefined && 0 <= seed && seed < nFactorial) ? seed : Math.floor(Math.random() * nFactorial)

  // Create a mutable copy of the original array
  const availableElements = [...arr]
  const permutation: T[] = []

  // Lehmer Code
  let currentSeed = seed
  for (let i = n - 1; i >= 0; i--) {
    const iFactorial = factorial(i)
    permutation.push(availableElements.splice(Math.floor(currentSeed / iFactorial), 1)[0]!)
    currentSeed %= iFactorial
  }

  return {
    seed,
    permutation
  }
}

export const factorial = (n: number) =>
  Array(n+1).keys().drop(2).reduce((acc, i) => acc *= i, 1)
