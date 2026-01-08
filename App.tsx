
import React, { useState, useEffect, useCallback } from 'react';
import { TranslationMode, HistoryItem } from './types';
import { translateToMorse, translateToText, playMorseAudio } from './services/morseService';
import { getMorseExplanation } from './services/geminiService';
import Header from './components/Header';
import Dictionary from './components/Dictionary';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<TranslationMode>(TranslationMode.TEXT_TO_MORSE);
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (input.trim() === '') {
      setOutput('');
      return;
    }
    const result = mode === TranslationMode.TEXT_TO_MORSE 
      ? translateToMorse(input) 
      : translateToText(input);
    setOutput(result);
  }, [input, mode]);

  const toggleMode = () => {
    setMode(prev => prev === TranslationMode.TEXT_TO_MORSE ? TranslationMode.MORSE_TO_TEXT : TranslationMode.TEXT_TO_MORSE);
    setInput(output);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setExplanation('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePlay = () => {
    const morse = mode === TranslationMode.TEXT_TO_MORSE ? output : input;
    if (morse) playMorseAudio(morse);
  };

  const handleExplain = async () => {
    const textToExplain = mode === TranslationMode.TEXT_TO_MORSE ? input : output;
    if (!textToExplain) return;

    setIsExplaining(true);
    const result = await getMorseExplanation(textToExplain);
    setExplanation(result);
    setIsExplaining(false);
  };

  return (
    <div className="min-h-screen pb-12">
      <Header />

      <main className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Main Translator Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 bg-slate-900/50 border-b border-slate-700">
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${mode === TranslationMode.TEXT_TO_MORSE ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                Português
              </span>
              <button 
                onClick={toggleMode}
                className="p-2 hover:bg-slate-700 rounded-full transition-colors group"
                title="Inverter Modo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${mode === TranslationMode.MORSE_TO_TEXT ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                Código Morse
              </span>
            </div>
            <button 
              onClick={handleClear}
              className="text-sm text-slate-400 hover:text-red-400 transition-colors"
            >
              Limpar Tudo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Input Area */}
            <div className="p-6 border-b md:border-b-0 md:border-r border-slate-700">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Entrada</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === TranslationMode.TEXT_TO_MORSE ? "Digite seu texto aqui..." : ".... . .-.. .-.. ---"}
                className={`w-full h-48 bg-transparent border-none focus:ring-0 resize-none text-xl leading-relaxed placeholder:text-slate-600 ${mode === TranslationMode.MORSE_TO_TEXT ? 'mono' : ''}`}
              />
              {mode === TranslationMode.MORSE_TO_TEXT && (
                <div className="mt-4 flex space-x-2">
                  <button onClick={() => setInput(prev => prev + '.')} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg mono text-lg font-bold transition-colors">.</button>
                  <button onClick={() => setInput(prev => prev + '-')} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg mono text-lg font-bold transition-colors">-</button>
                  <button onClick={() => setInput(prev => prev + ' ')} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors">Espaço</button>
                  <button onClick={() => setInput(prev => prev + ' / ')} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors">/</button>
                </div>
              )}
            </div>

            {/* Output Area */}
            <div className="p-6 bg-slate-900/30">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Saída</label>
              <div className={`w-full h-48 overflow-y-auto text-xl leading-relaxed ${mode === TranslationMode.TEXT_TO_MORSE ? 'mono text-blue-400' : 'text-slate-200'}`}>
                {output || <span className="text-slate-700">Tradução aparecerá aqui...</span>}
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button 
                  onClick={handlePlay}
                  className="p-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl transition-all"
                  title="Ouvir Código Morse"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <button 
                  onClick={handleCopy}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl flex items-center space-x-2 transition-all active:scale-95"
                >
                  {isCopied ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Explainer Section */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2 flex items-center text-indigo-300">
              <span className="mr-2">✨</span> Contexto por Inteligência Artificial
            </h3>
            <p className="text-slate-400 text-sm mb-4 max-w-2xl">
              Curioso sobre o que você escreveu? Deixe o Gemini explicar a história ou o significado por trás do seu texto.
            </p>
            
            {!explanation ? (
              <button 
                onClick={handleExplain}
                disabled={!input || isExplaining}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:opacity-50 text-white rounded-xl transition-all font-medium flex items-center space-x-2"
              >
                {isExplaining ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Analisando...</span>
                  </>
                ) : (
                  <span>Obter Explicação</span>
                )}
              </button>
            ) : (
              <div className="bg-slate-900/60 rounded-xl p-4 border border-indigo-500/10">
                <p className="text-slate-300 leading-relaxed italic">{explanation}</p>
                <button 
                  onClick={() => setExplanation('')}
                  className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 uppercase tracking-widest font-bold"
                >
                  Fechar Explicação
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reference Section */}
        <Dictionary />

        <footer className="pt-12 border-t border-slate-800">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-center">
              <p className="text-slate-400 font-medium mb-1">Tradutor de Código Morse</p>
              <p className="text-slate-600 text-sm">Desenvolvido com precisão para converter ideias em sinais.</p>
            </div>
            
            <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 w-full max-w-lg">
              <h4 className="text-slate-300 font-bold mb-4 text-center uppercase tracking-widest text-xs">Créditos do Autor</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Nome</span>
                  <span className="text-slate-200 font-semibold">Donilson Bernardo Bumba Manuel</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">E-mail</span>
                  <a href="mailto:donilsonmanuelpro@gmail.com" className="text-blue-400 hover:underline">donilsonmanuelpro@gmail.com</a>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">WhatsApp</span>
                  <a href="https://wa.me/244931191045" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline font-mono">+244 931191045</a>
                </div>
              </div>
            </div>
            
            <p className="text-slate-700 text-[10px] uppercase tracking-tighter">© 2024 • Todos os direitos reservados</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
