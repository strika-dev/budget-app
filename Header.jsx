// Header - Neo-Brutalist Editorial
import React from 'react';
import { THEME } from '../styles/theme';

const C = THEME.colors;

export const Header = ({ view, setView }) => {
  const tabs = [
    { id: 'dashboard', label: 'Aperçu' },
    { id: 'transactions', label: 'Opérations' },
    { id: 'stats', label: 'Statistiques' },
  ];

  return (
    <header style={{
      borderBottom: `3px solid ${C.ink}`,
      padding: '20px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    }}>
      <div>
        <div style={{ 
          fontFamily: THEME.fonts.display,
          fontSize: '42px',
          fontWeight: 400,
          letterSpacing: '-2px',
          lineHeight: 1,
          color: C.ink,
        }}>
          Budget<span style={{ color: C.coral }}>.</span>
        </div>
        <div style={{
          fontFamily: THEME.fonts.mono,
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          color: C.inkFaded,
          marginTop: '4px',
        }}>
          Finances personnelles
        </div>
      </div>

      <nav style={{ display: 'flex', gap: '0' }}>
        {tabs.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setView(t.id)}
            style={{
              fontFamily: THEME.fonts.body,
              fontSize: '13px',
              fontWeight: view === t.id ? 600 : 400,
              padding: '12px 24px',
              background: view === t.id ? C.ink : 'transparent',
              color: view === t.id ? C.paper : C.ink,
              border: `2px solid ${C.ink}`,
              borderLeft: i === 0 ? `2px solid ${C.ink}` : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>
    </header>
  );
};

export default Header;
