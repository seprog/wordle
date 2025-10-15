import categorizedWordles from '../wordles.yaml'


export function getWordleQueue(category?: string) {
  // safeguard the category
  category =
    (category && categorizedWordles[category])
    ? category
    : Object.keys(categorizedWordles)[Math.floor(Math.random() * Object.keys(categorizedWordles).length)]!

  const wordles: {
    [solution: string]: string[]
  }[] = categorizedWordles[category]

  return {
    category,
    wordleQueue: wordles
      .map((wordle) => ({
        wordle: {
          solution: Object.keys(wordle)[0]!,
          hints: wordle[Object.keys(wordle)[0]!]!
        },
        sort: Math.random()
      }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ wordle }) => wordle)
  }
}
