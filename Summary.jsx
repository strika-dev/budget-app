// Summary Stats Bar - Neo-Brutalist Editorial
import React from 'react';
import { THEME } from '../styles/theme';
import { formatCurrency, getPercentage } from '../utils/helpers';

const C = THEME.colors;

const StatBlock = ({ label, value, sub, accent }) => (
  <div style={{
    padding: '28px 24px',
    borderRight: `3px solid ${C.ink}`,
    flex: 1,
    minWidth: '200px',
  }}>
    <div style={{
      fontFamily: THEME.fonts.mono,
      fontSize: '10px',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      color: C.inkFaded,
      marginBottom: '8px',
    }}>
      {label}
    </div>
    <div style={{
      fontFamily: THEME.fonts.display,
      fontSize: '38px',
      fontWeight: 400,
      color: accent || C.ink,
      letterSpacing: '-1px',
      lineHeight: 1,
    }}>
      {value}
    </div>
    {sub && (
      <div style={{
        fontFamily: THEME.fonts.body,
        fontSize: '12px',
        color: C.inkFaded,
        marginTop: '8px',
      }}>
        {sub}
      </div>
    )}
  </div>
);

export const Summary = ({ totals, count }) => (
  <div style={{
    display: 'flex',
    borderBottom: `3px solid ${C.ink}`,
    background: C.paper,
    flexWrap: 'wrap',
  }}>
    <StatBlock 
      label="Solde actuel" 
      value={formatCurrency(totals.balance || totals.bal)} 
      accent={totals.balance >= 0 || totals.bal >= 0 ? C.green : C.red}
    />
    <StatBlock 
      label="Entrées" 
      value={formatCurrency(totals.income || totals.inc)} 
      sub={`${count} transactions`}
      accent={C.green}
    />
    <StatBlock 
      label="Sorties" 
      value={formatCurrency(totals.expenses || totals.exp)} 
      accent={C.red}
    />
    <div style={{
      padding: '28px 24px',
      flex: 1,
      minWidth: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '200px',
        height: '12px',
        background: C.cream,
        position: 'relative',
        border: `2px solid ${C.ink}`,
      }}>
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: `${Math.min(100, getPercentage((totals.income || totals.inc) - (totals.expenses || totals.exp), totals.income || totals.inc))}%`,
          background: (totals.balance >= 0 || totals.bal >= 0) ? C.green : C.red,
          transition: 'width 0.3s ease',
        }} />
      </div>
    </div>
  </div>
);

export default Summary;
