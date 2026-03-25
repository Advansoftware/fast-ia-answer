'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

type Provider = 'openai' | 'gemini';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  provider?: Provider;
}

const GeminiIcon = () => (
  <svg width="26" height="26" viewBox="0 0 192 192" fill="none">
    <path
      d="M96 16C96 60.183 60.183 96 16 96C60.183 96 96 131.817 96 176C96 131.817 131.817 96 176 96C131.817 96 96 60.183 96 16Z"
      fill="url(#g1)"
    />
    <defs>
      <linearGradient id="g1" x1="16" y1="16" x2="176" y2="176" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8ab4f8" />
        <stop offset="1" stopColor="#c084fc" />
      </linearGradient>
    </defs>
  </svg>
);

const OpenAIIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5Z" />
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PROVIDER_LABELS: Record<Provider, string> = {
  openai: 'OpenAI',
  gemini: 'Gemini',
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<Provider>('openai');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text, provider }),
      });
      const data = await res.json();
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: data.answer ?? data.error ?? 'Erro desconhecido',
        provider,
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'ai', text: 'Erro ao conectar.' },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#1e1e2e', color: '#e3e3e3' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 1.5,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <GeminiIcon />
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Google Sans", sans-serif',
              fontWeight: 500,
              fontSize: '1.05rem',
              background: 'linear-gradient(135deg, #8ab4f8, #c084fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Fast IA Answer
          </Typography>
        </Box>

        {/* Provider toggle */}
        <ToggleButtonGroup
          value={provider}
          exclusive
          onChange={(_, val) => val && setProvider(val)}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              color: '#9aa0a6',
              borderColor: 'rgba(255,255,255,0.1)',
              fontFamily: '"Google Sans", sans-serif',
              fontSize: '0.78rem',
              fontWeight: 500,
              px: 1.5,
              py: 0.5,
              gap: 0.7,
              textTransform: 'none',
              '&.Mui-selected': {
                color: '#e3e3e3',
                bgcolor: 'rgba(138,180,248,0.15)',
                borderColor: 'rgba(138,180,248,0.4)',
              },
              '&.Mui-selected:hover': {
                bgcolor: 'rgba(138,180,248,0.2)',
              },
            },
          }}
        >
          <ToggleButton value="openai">
            <OpenAIIcon /> OpenAI
          </ToggleButton>
          <ToggleButton value="gemini">
            <GeminiIcon /> Gemini
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: { xs: 2, md: 0 } }}>
        <Box sx={{ maxWidth: 760, width: '100%', mx: 'auto', py: 3 }}>
          {messages.length === 0 && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '42vh',
                gap: 1.5,
                opacity: 0.65,
              }}
            >
              <GeminiIcon />
              <Typography sx={{ fontFamily: '"Google Sans", sans-serif', fontSize: '1.3rem', fontWeight: 500, color: '#c0c0d0' }}>
                Cole sua questão com as alternativas
              </Typography>
              <Typography sx={{ color: '#9aa0a6', fontSize: '0.85rem' }}>
                Enter envia · Shift+Enter nova linha
              </Typography>
            </Box>
          )}

          {messages.map(msg => (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                mb: 1.5,
                animation: 'fadeIn 0.18s ease',
                '@keyframes fadeIn': {
                  from: { opacity: 0, transform: 'translateY(6px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              {msg.role === 'ai' && (
                <Box sx={{ width: 26, height: 26, mr: 1.5, mt: 0.5, flexShrink: 0 }}>
                  <GeminiIcon />
                </Box>
              )}
              <Box
                sx={
                  msg.role === 'user'
                    ? {
                        bgcolor: '#2d2d44',
                        color: '#e3e3e3',
                        px: 2.5,
                        py: 1.5,
                        borderRadius: '18px 18px 4px 18px',
                        maxWidth: '75%',
                        fontSize: '0.93rem',
                        lineHeight: 1.6,
                        fontFamily: '"Roboto", sans-serif',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        border: '1px solid rgba(255,255,255,0.07)',
                      }
                    : {
                        py: 0.5,
                        fontSize: '1.15rem',
                        fontFamily: '"Google Sans", sans-serif',
                        fontWeight: 500,
                        background: 'linear-gradient(135deg, #8ab4f8, #c084fc)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }
                }
              >
                {msg.text}
              </Box>
            </Box>
          ))}

          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Box sx={{ width: 26, height: 26, flexShrink: 0 }}>
                <GeminiIcon />
              </Box>
              <Box sx={{ display: 'flex', gap: 0.6 }}>
                {[0, 1, 2].map(i => (
                  <Box
                    key={i}
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #8ab4f8, #c084fc)',
                      animation: 'pulse 1.2s ease-in-out infinite',
                      animationDelay: `${i * 0.2}s`,
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 0.3, transform: 'scale(0.8)' },
                        '50%': { opacity: 1, transform: 'scale(1)' },
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>
      </Box>

      {/* Input */}
      <Box sx={{ px: { xs: 2, md: 0 }, pb: 3, pt: 1 }}>
        <Box sx={{ maxWidth: 760, width: '100%', mx: 'auto' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              bgcolor: '#2d2d44',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              '&:focus-within': {
                borderColor: 'rgba(138,180,248,0.5)',
                boxShadow: '0 0 0 1px rgba(138,180,248,0.15)',
              },
              px: 2,
              py: 1,
              gap: 1,
            }}
          >
            <TextField
              inputRef={inputRef}
              fullWidth
              multiline
              maxRows={6}
              autoFocus
              placeholder={`Cole a questão com as alternativas... (${PROVIDER_LABELS[provider]})`}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              variant="standard"
              InputProps={{ disableUnderline: true }}
              sx={{
                '& .MuiInputBase-root': {
                  color: '#e3e3e3',
                  fontFamily: '"Roboto", sans-serif',
                  fontSize: '0.95rem',
                  py: 0.5,
                },
                '& .MuiInputBase-input::placeholder': { color: '#6b7280', opacity: 1 },
              }}
            />
            <Tooltip title={`Enviar via ${PROVIDER_LABELS[provider]} (Enter)`} placement="top">
              <span>
                <IconButton
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  size="small"
                  sx={{
                    mb: 0.5,
                    bgcolor: input.trim() && !loading ? 'rgba(138,180,248,0.15)' : 'transparent',
                    color: input.trim() && !loading ? '#8ab4f8' : '#6b7280',
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: 'rgba(138,180,248,0.25)' },
                    '&.Mui-disabled': { color: '#6b7280' },
                  }}
                >
                  {loading ? <CircularProgress size={18} sx={{ color: '#8ab4f8' }} /> : <SendIcon />}
                </IconButton>
              </span>
            </Tooltip>
          </Box>
          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, color: '#6b7280', fontSize: '0.73rem' }}>
            Enter envia · Shift+Enter nova linha · Modelo: {provider === 'openai' ? 'gpt-4o-mini' : 'gemini-2.0-flash'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
