import { serve } from 'bun'
import index from './index.html'
import { getWordleQueue } from './lib/wordleHelper'

const server = serve({
  routes: {
    '/api/queue': (req: Request) => {
      try {
        const url = new URL(req.url)
        const seedParam = url.searchParams.get('seed') ?? undefined
        const seed = seedParam !== undefined && seedParam !== '' ? Number.parseInt(seedParam) : undefined
        const result = getWordleQueue(seed)
        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' }
        })
      } catch (err) {
        return new Response('Internal Server Error', { status: 500 })
      }
    },
    '/*': index
  },
  development: process.env.NODE_ENV !== 'production' && {
    hmr: true,
    console: true
  }
})

console.log(`🚀 Server running at ${server.url}`)
