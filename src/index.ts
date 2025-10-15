import { serve } from 'bun'
import index from './index.html'
import { getWordleQueue } from './lib/wordleHelper'


const server = serve({
  routes: {
    '/api/queue': (req: Request) => {
      try {
        const searchParams = new URL(req.url).searchParams

        const categoryParam = searchParams.get('category')

        const result = getWordleQueue(
          (categoryParam !== null) ? categoryParam : undefined
        )

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
