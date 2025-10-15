import random from 'random'

import wordles from '../wordles.yaml'


export function getWordleQueue(category?: string, seed?: number) {
  // safeguard the category
  category = (category && wordles[category]) ? category : Object.keys(wordles)[random.int(0, Object.keys(wordles).length - 1)]!

  return {
    category,
    ...getPermutation<{
      [solution: string]: string[]
    }>(wordles[category], seed)
  }
}

export function getPermutation<T>(arr: readonly T[], seed?: number): {
  seed: number
  permutation: T[]
} {
  const n = arr.length
  const nFactorial = factorial(n)

  // safeguard the seed
  seed = (seed !== undefined && 0 <= seed && seed < nFactorial) ? seed : random.int(0, nFactorial-1)

  // Create a mutable copy of the original array
  const availableElements = [...arr]
  const permutation: T[] = []

  // Lehmer Code
  let currentSeed = seed
  for (let i = n - 1; i >= 0; i--) {
    const currentFactorial = factorial(i)
    const indexToPick = Math.floor(currentSeed / currentFactorial)
    permutation.push(availableElements[indexToPick]!)
    availableElements.splice(indexToPick, 1)
    currentSeed %= currentFactorial
  }

  return {
    permutation,
    seed
  }
}

export function factorial(n: number): number {
  let result = 1
  for (let i = 2; i <= n; i++)
    result *= i
  return result
}
