import type { ServerResponse } from 'node:http'

type JsonPayload = Record<string, unknown>

export const sendJson = (
  response: ServerResponse,
  statusCode: number,
  payload: JsonPayload,
) => {
  response.writeHead(statusCode, {
    'access-control-allow-origin': 'http://localhost:5173',
    'access-control-allow-methods': 'GET, OPTIONS',
    'access-control-allow-headers': 'Content-Type',
    'content-type': 'application/json; charset=utf-8',
  })
  response.end(JSON.stringify(payload))
}

export const sendError = (
  response: ServerResponse,
  statusCode: number,
  message: string,
) => {
  sendJson(response, statusCode, { error: message })
}

export const requestJson = async <ResponseBody>(
  url: string,
): Promise<ResponseBody> => {
  const response = await fetch(url)
  const text = await response.text()

  if (!response.ok) {
    throw new Error(`外部APIへの問い合わせに失敗しました。status=${response.status}`)
  }

  try {
    return JSON.parse(text) as ResponseBody
  } catch {
    throw new Error('外部APIのレスポンスをJSONとして読み取れませんでした。')
  }
}
