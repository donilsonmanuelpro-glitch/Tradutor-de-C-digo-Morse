
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-8 px-4 text-center">
      <div className="inline-block bg-blue-500/10 border border-blue-500/20 px-4 py-1 rounded-full mb-4">
        <span className="text-blue-400 text-sm font-semibold tracking-wider uppercase">Tradutor Profissional</span>
      </div>
      <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
        Tradutor de Código Morse
      </h1>
      <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
        Comunicação atemporal com o poder da tecnologia moderna. Converta texto em sinais de forma instantânea.
      </p>
    </header>
  );
};

export default Header;
