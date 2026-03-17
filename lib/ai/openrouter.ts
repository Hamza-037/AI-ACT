const OPENROUTER_BASE = 'https://openrouter.ai/api/v1'

export const MODELS = {
  CLAUDE_HAIKU: 'anthropic/claude-haiku-4-5',
  CLAUDE_SONNET: 'anthropic/claude-sonnet-4-6',
  GEMINI_FLASH: 'google/gemini-2.5-flash',
} as const

export type TarvioTask = 'classification-ia' | 'generation-doc' | 'analyse-conformite'

const TASK_MAX_TOKENS: Partial<Record<TarvioTask, number>> = {
  'classification-ia': 1000,
  'generation-doc': 4000,
  'analyse-conformite': 2000,
}

export async function ai(options: {
  task: TarvioTask
  model: string
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[]
  maxTokens?: number
}): Promise<string> {
  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://aiactio.fr',
      'X-Title': 'aiactio',
    },
    body: JSON.stringify({
      model: options.model,
      messages: options.messages,
      max_tokens: options.maxTokens ?? TASK_MAX_TOKENS[options.task] ?? 1000,
    }),
  })
  if (!res.ok) throw new Error(`OpenRouter error: ${res.status}`)
  const data = (await res.json()) as { choices: { message: { content: string } }[] }
  return data.choices[0]?.message.content ?? ''
}
