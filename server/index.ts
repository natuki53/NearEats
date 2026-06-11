import { createServer } from 'node:http'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { loadEnvFile } from './env.ts'
import { sendError, sendJson } from './http.ts'
import { handleHotPepperSearch } from './routes/hotpepper.ts'
import { handleReverseLocation } from './routes/location.ts'

const defaultPort = 3001

loadEnvFile()

const port = Number(process.env.PORT ?? process.env.API_PORT ?? defaultPort)

const handleRequest = async (
  request: IncomingMessage,
  response: ServerResponse,
) => {
  if (!request.url) {
    sendError(response, 400, 'URLが不正です。')
    return
  }

  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {})
    return
  }

  if (request.method !== 'GET') {
    sendError(response, 405, 'GETメソッドのみ対応しています。')
    return
  }

  const requestUrl = new URL(request.url, `http://${request.headers.host}`)

  try {
    if (requestUrl.pathname === '/api/location/reverse') {
      await handleReverseLocation(requestUrl, response)
      return
    }

    if (requestUrl.pathname === '/api/hotpepper/search') {
      await handleHotPepperSearch(requestUrl, response)
      return
    }

    sendError(response, 404, 'APIエンドポイントが見つかりません。')
  } catch (error) {
    sendError(
      response,
      error instanceof Error && error.message.includes('必須') ? 400 : 500,
      error instanceof Error ? error.message : 'APIプロキシでエラーが発生しました。',
    )
  }
}

const server = createServer(handleRequest)

server.listen(port, () => {
  console.log(`API proxy is running on http://localhost:${port}`)
})
