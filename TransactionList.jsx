// Transaction List - Neo-Brutalist Editorial
import React from 'react';
import { THEME, CATEGORIES } from '../styles/theme';
import { formatCurrency, formatDate } from '../utils/helpers';

const C = THEME.colors;

const getCat = (id, type) => {
  const cats = type === 'income' ? CATEGORIES.income : CATEGORIES.expense;
  return cats.find(c => c.id === id) || { label: id, mark: '○' };
};

export const TransactionList = ({ transactions, onDelete, filter, onFilterChange }) => {
  return (
    <div style={{ background: C.paper }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 24px',
        borderBottom: `2px solid ${C.ink}`,
      }}>
        <h3 style={{
          fontFamily: THEME.fonts.display,
          fontSize: '22px',
          fontWeight: 400,
          margin: 0,
        }}>
          Historique
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'income', 'expense'].map(f => (
            <button
              key={f}
              onClick={() => onFilterChange({ ...filter, type: f })}
              style={{
                fontFamily: THEME.fonts.mono,
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                padding: '8px 14px',
                background: filter.type === f ? C.ink : 'transparent',
                color: filter.type === f ? C.paper : C.ink,
                border: `1px solid ${C.ink}`,
                cursor: 'pointer',
              }}
            >
              {f === 'all' ? 'Tout' : f === 'income' ? 'Entrées' : 'Sorties'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {transactions.length === 0 ? (
          <div style={{
            padding: '60px 24px',
            textAlign: 'center',
            color: C.ghost,
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>∅</div>
            <div style={{ fontFamily: THEME.fonts.body, fontSize: '14px' }}>
              Aucune opération
            </div>
          </div>
        ) : transactions.map((t, i) => {
          const cat = getCat(t.category, t.type);
          const isInc = t.type === 'income';
          return (
            <div
              key={t.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '48px 1fr auto 32px',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 24px',
                borderBottom: i < transactions.length - 1 ? `1px solid ${C.cream}` : 'none',
                transition: 'background 0.1s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = C.cream}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: '48px',
                height: '48px',
                background: isInc ? C.greenLight : C.redLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: THEME.fonts.body,
                fontSize: '20px',
                color: isInc ? C.green : C.red,
              }}>
                {cat.mark}
              </div>

              <div>
                <div style={{
                  fontFamily: THEME.fonts.body,
                  fontSize: '15px',
                  fontWeight: 500,
                  color: C.ink,
                }}>
                  {cat.label}
                </div>
                <div style={{
                  fontFamily: THEME.fonts.mono,
                  fontSize: '11px',
                  color: C.inkFaded,
                  marginTop: '2px',
                }}>
                  {formatDate(t.date)} {t.description && `· ${t.description}`}
                </div>
              </div>

              <div style={{
                fontFamily: THEME.fonts.mono,
                fontSize: '15px',
                fontWeight: 600,
                color: isInc ? C.green : C.red,
                textAlign: 'right',
              }}>
                {isInc ? '+' : '−'}{formatCurrency(t.amount)}
              </div>

              <button
                onClick={() => onDelete(t.id)}
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: C.ghost,
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.1s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.color = C.red}
                onMouseLeave={e => e.currentTarget.style.color = C.ghost}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionList;
