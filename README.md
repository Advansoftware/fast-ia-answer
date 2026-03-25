# Fast IA Answer 🚀

Mini projeto focado em resolver questões de múltipla escolha com o máximo de velocidade e objetividade.
Cole sua questão, aperte Enter e receba apenas: `"a resposta é X"`. Sem explicações, sem firulas.

![Fast IA Answer Preview](./public/preview.png)

## 🛠️ Stack Tecnológica

O projeto foi construído com as seguintes dependências principais (conforme `package.json`):

- **[Next.js](https://nextjs.org/)**: `16.2.1` (App Router)
- **[React](https://react.dev/)**: `19.2.4`
- **[Material-UI (MUI)](https://mui.com/)**: `^7.3.9` (com `@mui/material-nextjs` para SSR)
- **[OpenAI SDK](https://github.com/openai/openai-node)**: `^6.32.0`
- **[Google Generative AI SDK](https://github.com/google/generative-ai-js)**: `^0.24.1`

**Modelos de IA suportados na interface**:
- `gpt-4o-mini` (OpenAI) - **Padrão** (mais rápido e barato)
- `gemini-2.0-flash` (Google Gemini) - Rápido e focado

## ✨ Funcionalidades

- **UI Estilo ChatGPT/Gemini**: Bolhas de chat responsivas, auto-scroll, suporte a quebra de linha com `Shift+Enter`.
- **Toggle Dinâmico**: Escolha instantaneamente qual IA vai responder a questão na própria interface.
- **Micro-interações**: Animação de `typing dots` ao carregar a resposta.
- **Foco Automático**: Após cada resposta, o input ganha foco automaticamente para você já colar a próxima pergunta e não perder 1 segundo sequer.

## 🚀 Como Executar Localmente

### 1. Clone o repositório
```bash
git clone git@github.com:Advansoftware/fast-ia-answer.git
cd fast-ia-answer
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configuração de Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto copiando o `.env.example`:
```bash
cp .env.example .env.local
```
No arquivo `.env.local`, coloque suas chaves de API:
```env
OPENAI_API_KEY=sk-suachaveopenai...
GEMINI_API_KEY=AIzaSySuaChaveGemini...
```

### 4. Rode o Servidor
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📝 Regra do Prompt API
A rota de API backend (`/api/answer`) trava o System Prompt para garantir que a IA obedeça à regra:
> *"Você analisa questões de múltipla escolha. Responda EXCLUSIVAMENTE no formato: 'a resposta é X' onde X é a letra correta. NÃO explique, NÃO justifique, NÃO adicione nada mais."*

Isso garante velocidade extrema na geração e **baixo consumo de tokens**.
