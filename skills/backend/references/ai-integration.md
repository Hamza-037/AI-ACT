# AI Integration — aiactio

## Règle absolue

Tous les appels IA passent par `lib/ai/openrouter.ts`. Jamais d'import direct `openai`.

## Modèles disponibles

```typescript
// lib/ai/openrouter.ts
export const MODELS = {
  CLAUDE_HAIKU: 'anthropic/claude-haiku-4-5',    // rapide, pas cher
  CLAUDE_SONNET: 'anthropic/claude-sonnet-4-6',  // équilibré
  GEMINI_FLASH: 'google/gemini-2.5-flash',       // multimodal
  DEEPSEEK_V3: 'deepseek/deepseek-chat',         // code, JSON
}
```

## Pattern appel IA

```typescript
import { callAI, logAiUsage } from '@/lib/ai/openrouter'
import { getPrompt } from '@/lib/ai/prompts'

const result = await callAI({
  model: MODELS.CLAUDE_HAIKU,
  messages: [{ role: 'user', content: getPrompt('analyse_systeme', { nom }) }],
  maxTokens: 500,
})

// Fire-and-forget — jamais await bloquant
void logAiUsage({
  model: MODELS.CLAUDE_HAIKU,
  inputTokens: result.usage.input_tokens,
  outputTokens: result.usage.output_tokens,
  task: 'analyse_systeme',
})
```

## Prompts

Tous les prompts dans `lib/ai/prompts.ts` :
- En français, professionnel mais accessible
- Pas de prompt directement dans les actions

## Headers obligatoires

```typescript
headers: {
  'HTTP-Referer': 'https://aiactio.fr',
  'X-Title': 'aiactio',
}
```
