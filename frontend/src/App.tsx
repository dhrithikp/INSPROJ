import { useState } from 'react';
import { Lock, Unlock, Copy, RotateCcw, Sparkles, Shield } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

function App() {
  const [message, setMessage] = useState('');
  const [key, setKey] = useState('3');
  const [method, setMethod] = useState('caesar');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [copied, setCopied] = useState(false);

  async function callApi(path: string, useOutputIfEmpty = false) {
    setLoading(true);
    setOutput('');
    try {
      const msg = (useOutputIfEmpty && (!message || message.trim() === '')) ? output : message;
      const body = { message: msg, key: Number(key), method };
      console.debug('Calling API', API_BASE + path, body);
      const res = await fetch(API_BASE + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const text = await res.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (e) {
        data = null;
      }

      if (!res.ok) {
        const detail = data && (data.detail || data.error) ? (data.detail || data.error) : text;
        setOutput(`Error ${res.status}: ${detail}`);
      } else {
        setOutput(data && data.result ? data.result : text);
      }
    } catch (err) {
      setOutput('Request failed: ' + String(err));
      console.error('API call error', err);
    } finally {
      setLoading(false);
    }
  }

  const handleEncrypt = () => {
    setMode('encrypt');
    callApi('/encrypt');
  };

  const handleDecrypt = () => {
    setMode('decrypt');
    callApi('/decrypt', true);
  };

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSwap = () => {
    setMessage(output);
    setOutput('');
  };

  const handleReset = () => {
    setMessage('');
    setOutput('');
    setKey('3');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-20"></div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-cyan-400 animate-pulse" />
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              CryptoVault
            </h1>
            <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
          <p className="text-slate-300 text-lg">Secure your messages with military-grade encryption</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-cyan-400" />
              <label className="text-lg font-semibold text-cyan-400">Input Message</label>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your secret message here..."
              className="w-full h-64 bg-slate-900/50 border border-slate-600 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all font-mono text-sm resize-none"
            />
            <div className="text-right text-slate-400 text-sm mt-2">
              {message.length} characters
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Unlock className="w-5 h-5 text-blue-400" />
                <label className="text-lg font-semibold text-blue-400">Output</label>
              </div>
              <button
                onClick={handleCopy}
                disabled={!output}
                className="flex items-center gap-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 rounded-lg transition-all text-sm"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="Your encrypted/decrypted message will appear here..."
              className="w-full h-64 bg-slate-900/50 border border-slate-600 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none font-mono text-sm resize-none"
            />
            <div className="text-right text-slate-400 text-sm mt-2">
              {output.length} characters
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-slate-300 mb-2">Encryption Key</label>
              <input
                type="number"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-slate-300 mb-2">Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              >
                <option value="caesar">Caesar Cipher</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={handleEncrypt}
              disabled={loading || !message}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-700 disabled:to-slate-700 disabled:opacity-50 rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-cyan-500/50"
            >
              <Lock className="w-5 h-5" />
              {loading && mode === 'encrypt' ? 'Encrypting...' : 'Encrypt'}
            </button>

            <button
              onClick={handleDecrypt}
              disabled={loading || !output}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-slate-700 disabled:to-slate-700 disabled:opacity-50 rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/50"
            >
              <Unlock className="w-5 h-5" />
              {loading && mode === 'decrypt' ? 'Decrypting...' : 'Decrypt'}
            </button>

            <button
              onClick={handleSwap}
              disabled={!output}
              className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
              Swap
            </button>

            <button
              onClick={handleReset}
              disabled={!message && !output}
              className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-red-600 disabled:opacity-50 rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95"
            >
              Reset
            </button>
          </div>
        </div>

        <footer className="mt-8 text-center text-slate-400 text-sm">
          <p>Backend: <code className="bg-slate-800 px-2 py-1 rounded">{API_BASE}</code></p>
          <p className="mt-2">Adjust VITE_API_BASE environment variable for different host</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
