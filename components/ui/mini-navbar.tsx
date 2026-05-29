"use client";

import React, { useState, useEffect, useRef } from 'react';

const AnimatedNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <a href={href} className="group relative inline-flex overflow-hidden h-5 items-center text-sm">
      <div className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-1/2">
        <span className="text-gray-300">{children}</span>
        <span className="text-white">{children}</span>
      </div>
    </a>
  );
};

const navLinks = [
  { label: 'Ветеринари', href: '#vets' },
  { label: 'Груминг', href: '#grooming' },
  { label: 'Услуги', href: '#services' },
  { label: 'За нас', href: '#about' },
];

export function MiniNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [shapeClass, setShapeClass] = useState('rounded-full');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (isOpen) {
      setShapeClass('rounded-2xl');
    } else {
      timerRef.current = setTimeout(() => setShapeClass('rounded-full'), 300);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isOpen]);

  const loginBtn = (
    <button className="px-4 py-1.5 text-xs border border-white/20 bg-white/10 text-gray-300 rounded-full hover:border-white/50 hover:text-white transition-colors duration-200 w-full sm:w-auto">
      Вход
    </button>
  );

  const registerBtn = (
    <div className="relative group w-full sm:w-auto">
      <div className="absolute inset-0 -m-2 rounded-full hidden sm:block bg-white opacity-30 blur-lg pointer-events-none transition-all duration-300 group-hover:opacity-50 group-hover:blur-xl" />
      <button className="relative z-10 px-4 py-1.5 text-xs font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-white hover:to-gray-200 transition-all duration-200 w-full sm:w-auto">
        Регистрация
      </button>
    </div>
  );

  return (
    <header
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50
                  flex flex-col items-center
                  px-6 py-3 backdrop-blur-md
                  border border-white/15 bg-black/40
                  w-[calc(100%-2rem)] sm:w-auto
                  transition-[border-radius] duration-300 ease-in-out
                  ${shapeClass}`}
    >
      <div className="flex items-center justify-between w-full gap-x-8">
        {/* Logo */}
        <span className="text-white font-bold text-sm tracking-wide whitespace-nowrap">
          🐾 Dr. Pet Friend
        </span>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center space-x-6">
          {navLinks.map((link) => (
            <AnimatedNavLink key={link.href} href={link.href}>
              {link.label}
            </AnimatedNavLink>
          ))}
        </nav>

        {/* Desktop buttons */}
        <div className="hidden sm:flex items-center gap-2">
          {loginBtn}
          {registerBtn}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-gray-300 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Затвори' : 'Меню'}
        >
          {isOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                       ${isOpen ? 'max-h-96 opacity-100 pt-4' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center space-y-3 w-full">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-gray-300 hover:text-white transition-colors text-sm w-full text-center">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex flex-col items-center space-y-3 mt-4 w-full">
          {loginBtn}
          {registerBtn}
        </div>
      </div>
    </header>
  );
}
