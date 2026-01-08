// Transaction Form - Neo-Brutalist Editorial
import React, { useState } from 'react';
import { THEME, CATEGORIES } from '../styles/theme';
import { formatDateForInput } from '../utils/helpers';

const C = THEME.colors;

export const TransactionForm = ({ onSubmit }) => {
  const [type, setType] = useState('expense');
  const [data, setData] = useState({ 
    amount: '', 
    category: '', 
    description: '', 
    date: formatDateForInput() 
  });
  
  const cats = type === 'income' ? CATEGORIES.income : CATEGORIES.expense;

  const submit = () => {
    if (!data.amount || !data.category) return;
    onSubmit({ type, ...data });
    setData({ amount: '', category: '', description: '', date: formatDateForInput() });
  };

  const inputStyle = {
    fontFamily: THEME.fonts.body,
    fontSize: '14px',
    padding: '14px 16px',
    border: `2px solid ${C.ink}`,
    background: C.paper,
    color: C.ink,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    fontFamily: THEME.fonts.mono,
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: C.inkFaded,
    display: 'block',
    marginBottom: '8px',
  };

  return (
    <div style={{
      background: C.cream,
      padding: '32px',
      borderBottom: `3px solid ${C.ink}`,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <h2 style={{
          fontFamily: THEME.fonts.display,
          fontSize: '28px',
          fontWeight: 400,
          margin: 0,
          color: C.ink,
        }}>
          Nouvelle opération
        </h2>
        
        <div style={{ display: 'flex' }}>
          {['expense', 'income'].map((t, i) => (
            <button
              key={t}
              onClick={() => { setType(t); setData(d => ({ ...d, category: '' })); }}
              style={{
                fontFamily: THEME.fonts.mono,
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                padding: '10px 20px',
                background: type === t ? (t === 'expense' ? C.red : C.green) : C.paper,
                color: type === t ? C.paper : C.ink,
                border: `2px solid ${C.ink}`,
                borderLeft: i === 0 ? `2px solid ${C.ink}` : 'none',
                cursor: 'pointer',
              }}
            >
              {t === 'expense' ? '− Dépense' : '+ Revenu'}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
      }}>
        <div>
          <label style={labelStyle}>Montant €</label>
          <input
            type="number"
            value={data.amount}
            onChange={e => setData(d => ({ ...d, amount: e.target.value }))}
            placeholder="0"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Catégorie</label>
          <select
            value={data.category}
            onChange={e => setData(d => ({ ...d, category: e.target.value }))}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="">Choisir...</option>
            {cats.map(c => <option key={c.id} value={c.id}>{c.mark} {c.label}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Date</label>
          <input
            type="date"
            value={data.date}
            onChange={e => setData(d => ({ ...d, date: e.target.value }))}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Note</label>
          <input
            type="text"
            value={data.description}
            onChange={e => setData(d => ({ ...d, description: e.target.value }))}
            placeholder="Optionnel"
            style={inputStyle}
          />
        </div>
      </div>

      <button
        onClick={submit}
        disabled={!data.amount || !data.category}
        style={{
          fontFamily: THEME.fonts.body,
          fontSize: '14px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          padding: '16px 32px',
          background: data.amount && data.category ? C.coral : C.ghost,
          color: C.paper,
          border: 'none',
          cursor: data.amount && data.category ? 'pointer' : 'not-allowed',
          marginTop: '24px',
          transition: 'background 0.15s ease',
        }}
      >
        Enregistrer →
      </button>
    </div>
  );
};

export default TransactionForm;
