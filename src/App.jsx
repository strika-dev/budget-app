import React, { useState, useCallback, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════

const C = {
  bg: '#F5F0E8',
  paper: '#FFFDF9', 
  cream: '#EDE8DC',
  ink: '#1A1A1A',
  inkLight: '#3D3D3D',
  inkFaded: '#6B6B6B',
  ghost: '#A8A8A8',
  coral: '#FF5A36',
  green: '#2D7A4F',
  red: '#C23B3B',
  charts: ['#FF5A36', '#1A1A1A', '#2D7A4F', '#8B7355', '#5B8A72', '#C4A77D'],
};

const CATEGORIES = {
  income: [
    { id: 'salary', label: 'Salary', mark: '■' },
    { id: 'freelance', label: 'Freelance', mark: '◆' },
    { id: 'investment', label: 'Investments', mark: '▲' },
    { id: 'gift', label: 'Gifts', mark: '●' },
    { id: 'other_income', label: 'Other', mark: '○' },
  ],
  expense: [
    { id: 'housing', label: 'Housing', mark: '■' },
    { id: 'food', label: 'Food', mark: '●' },
    { id: 'transport', label: 'Transport', mark: '▶' },
    { id: 'utilities', label: 'Utilities', mark: '◇' },
    { id: 'health', label: 'Health', mark: '+' },
    { id: 'entertainment', label: 'Entertainment', mark: '★' },
    { id: 'shopping', label: 'Shopping', mark: '◆' },
    { id: 'education', label: 'Education', mark: '▲' },
    { id: 'savings', label: 'Savings', mark: '◐' },
    { id: 'other_expense', label: 'Other', mark: '○' },
  ],
};

const MOIS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

// ═══════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════

const fmt = (n) => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);
const fmtDate = (d) => new Date(d).toLocaleDateString('en-CA', { day: '2-digit', month: 'short' });
const today = () => new Date().toISOString().split('T')[0];
const uid = () => Math.random().toString(36).slice(2, 11);
const pct = (v, t) => t === 0 ? 0 : Math.round((v / t) * 100);

const calcTotals = (txs) => txs.reduce((a, t) => {
  t.type === 'income' ? a.inc += t.amount : a.exp += t.amount;
  a.bal = a.inc - a.exp;
  return a;
}, { inc: 0, exp: 0, bal: 0 });

const groupByCat = (txs, type) => txs.filter(t => t.type === type).reduce((a, t) => {
  a[t.category] = (a[t.category] || 0) + t.amount;
  return a;
}, {});

const groupByMonth = (txs) => txs.reduce((a, t) => {
  const k = t.date.slice(0, 7);
  if (!a[k]) a[k] = { inc: 0, exp: 0 };
  t.type === 'income' ? a[k].inc += t.amount : a[k].exp += t.amount;
  return a;
}, {});

const sortDesc = (txs) => [...txs].sort((a, b) => b.date.localeCompare(a.date));

const sampleData = () => {
  const txs = [];
  const now = new Date();
  for (let m = 0; m < 4; m++) {
    const mo = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const yy = mo.getFullYear(), mm = mo.getMonth();
    txs.push({ id: uid(), type: 'income', category: 'salary', amount: 3200 + Math.floor(Math.random() * 300), description: 'Monthly salary', date: `${yy}-${String(mm + 1).padStart(2, '0')}-05` });
    if (Math.random() > 0.5) txs.push({ id: uid(), type: 'income', category: 'freelance', amount: 400 + Math.floor(Math.random() * 600), description: 'Project', date: `${yy}-${String(mm + 1).padStart(2, '0')}-${10 + Math.floor(Math.random() * 15)}` });
    const expenses = [['housing', 950], ['food', 380], ['transport', 120], ['utilities', 95], ['entertainment', 60], ['shopping', 150]];
    expenses.forEach(([cat, base]) => {
      txs.push({ id: uid(), type: 'expense', category: cat, amount: base + Math.floor(Math.random() * 80), description: '', date: `${yy}-${String(mm + 1).padStart(2, '0')}-${1 + Math.floor(Math.random() * 27)}` });
    });
  }
  return sortDesc(txs);
};

// ═══════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════

const useBudget = () => {
  const [txs, setTxs] = useState(sampleData);
  const [filter, setFilter] = useState('all');

  const add = useCallback((t) => setTxs(p => sortDesc([...p, { ...t, id: uid(), amount: +t.amount }])), []);
  const del = useCallback((id) => setTxs(p => p.filter(t => t.id !== id)), []);
  const reset = useCallback(() => setTxs(sampleData()), []);
  const clear = useCallback(() => setTxs([]), []);

  const filtered = useMemo(() => filter === 'all' ? txs : txs.filter(t => t.type === filter), [txs, filter]);
  const totals = useMemo(() => calcTotals(filtered), [filtered]);
  const expByCat = useMemo(() => groupByCat(filtered, 'expense'), [filtered]);
  const incByCat = useMemo(() => groupByCat(filtered, 'income'), [filtered]);
  const monthly = useMemo(() => groupByMonth(txs), [txs]);

  return { txs: filtered, all: txs, filter, setFilter, totals, expByCat, incByCat, monthly, add, del, reset, clear };
};

// ═══════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════

const Header = ({ view, setView }) => {
  const tabs = [
    { id: 'dashboard', label: 'Overview' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'stats', label: 'Statistics' },
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
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: '42px',
          fontWeight: 400,
          letterSpacing: '-2px',
          lineHeight: 1,
          color: C.ink,
        }}>
          Budget<span style={{ color: C.coral }}>.</span>
        </div>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          color: C.inkFaded,
          marginTop: '4px',
        }}>
          Personal finances
        </div>
      </div>

      <nav style={{ display: 'flex', gap: '0' }}>
        {tabs.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setView(t.id)}
            style={{
              fontFamily: "'Space Grotesk', system-ui",
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

const StatBlock = ({ label, value, sub, accent }) => (
  <div style={{
    padding: '28px 24px',
    borderRight: `3px solid ${C.ink}`,
    flex: 1,
    minWidth: '200px',
  }}>
    <div style={{
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: '10px',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      color: C.inkFaded,
      marginBottom: '8px',
    }}>
      {label}
    </div>
    <div style={{
      fontFamily: "'Instrument Serif', Georgia, serif",
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
        fontFamily: "'Space Grotesk', system-ui",
        fontSize: '12px',
        color: C.inkFaded,
        marginTop: '8px',
      }}>
        {sub}
      </div>
    )}
  </div>
);

const StatsBar = ({ totals, count }) => (
  <div style={{
    display: 'flex',
    borderBottom: `3px solid ${C.ink}`,
    background: C.paper,
    flexWrap: 'wrap',
  }}>
    <StatBlock 
      label="Current balance" 
      value={fmt(totals.bal)} 
      accent={totals.bal >= 0 ? C.green : C.red}
    />
    <StatBlock 
      label="Income" 
      value={fmt(totals.inc)} 
      sub={`${count} transactions`}
      accent={C.green}
    />
    <StatBlock 
      label="Expenses" 
      value={fmt(totals.exp)} 
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
          width: `${Math.min(100, pct(totals.inc - totals.exp, totals.inc))}%`,
          background: totals.bal >= 0 ? C.green : C.red,
          transition: 'width 0.3s ease',
        }} />
      </div>
    </div>
  </div>
);

const TxForm = ({ onSubmit }) => {
  const [type, setType] = useState('expense');
  const [data, setData] = useState({ amount: '', category: '', description: '', date: today() });
  const cats = type === 'income' ? CATEGORIES.income : CATEGORIES.expense;

  const submit = () => {
    if (!data.amount || !data.category) return;
    onSubmit({ type, ...data });
    setData({ amount: '', category: '', description: '', date: today() });
  };

  const inputStyle = {
    fontFamily: "'Space Grotesk', system-ui",
    fontSize: '14px',
    padding: '14px 16px',
    border: `2px solid ${C.ink}`,
    background: C.paper,
    color: C.ink,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
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
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: '28px',
          fontWeight: 400,
          margin: 0,
          color: C.ink,
        }}>
          New transaction
        </h2>
        
        <div style={{ display: 'flex' }}>
          {['expense', 'income'].map((t, i) => (
            <button
              key={t}
              onClick={() => { setType(t); setData(d => ({ ...d, category: '' })); }}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
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
              {t === 'expense' ? '− Expense' : '+ Income'}
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
          <label style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: C.inkFaded,
            display: 'block',
            marginBottom: '8px',
          }}>Amount $</label>
          <input
            type="number"
            value={data.amount}
            onChange={e => setData(d => ({ ...d, amount: e.target.value }))}
            placeholder="0"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: C.inkFaded,
            display: 'block',
            marginBottom: '8px',
          }}>Category</label>
          <select
            value={data.category}
            onChange={e => setData(d => ({ ...d, category: e.target.value }))}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="">Select...</option>
            {cats.map(c => <option key={c.id} value={c.id}>{c.mark} {c.label}</option>)}
          </select>
        </div>

        <div>
          <label style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: C.inkFaded,
            display: 'block',
            marginBottom: '8px',
          }}>Date</label>
          <input
            type="date"
            value={data.date}
            onChange={e => setData(d => ({ ...d, date: e.target.value }))}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: C.inkFaded,
            display: 'block',
            marginBottom: '8px',
          }}>Note</label>
          <input
            type="text"
            value={data.description}
            onChange={e => setData(d => ({ ...d, description: e.target.value }))}
            placeholder="Optional"
            style={inputStyle}
          />
        </div>
      </div>

      <button
        onClick={submit}
        disabled={!data.amount || !data.category}
        style={{
          fontFamily: "'Space Grotesk', system-ui",
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
        Save →
      </button>
    </div>
  );
};

const TxList = ({ txs, onDelete, filter, setFilter }) => {
  const getCat = (id, type) => (type === 'income' ? CATEGORIES.income : CATEGORIES.expense).find(c => c.id === id) || { label: id, mark: '○' };

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
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: '22px',
          fontWeight: 400,
          margin: 0,
        }}>
          History
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'income', 'expense'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                padding: '8px 14px',
                background: filter === f ? C.ink : 'transparent',
                color: filter === f ? C.paper : C.ink,
                border: `1px solid ${C.ink}`,
                cursor: 'pointer',
              }}
            >
              {f === 'all' ? 'All' : f === 'income' ? 'Income' : 'Expenses'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {txs.length === 0 ? (
          <div style={{
            padding: '60px 24px',
            textAlign: 'center',
            color: C.ghost,
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>∅</div>
            <div style={{ fontFamily: "'Space Grotesk', system-ui", fontSize: '14px' }}>
              No transactions
            </div>
          </div>
        ) : txs.map((t, i) => {
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
                borderBottom: i < txs.length - 1 ? `1px solid ${C.cream}` : 'none',
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
                fontFamily: "'Space Grotesk', system-ui",
                fontSize: '20px',
                color: isInc ? C.green : C.red,
              }}>
                {cat.mark}
              </div>

              <div>
                <div style={{
                  fontFamily: "'Space Grotesk', system-ui",
                  fontSize: '15px',
                  fontWeight: 500,
                  color: C.ink,
                }}>
                  {cat.label}
                </div>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '11px',
                  color: C.inkFaded,
                  marginTop: '2px',
                }}>
                  {fmtDate(t.date)} {t.description && `· ${t.description}`}
                </div>
              </div>

              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '15px',
                fontWeight: 600,
                color: isInc ? C.green : C.red,
                textAlign: 'right',
              }}>
                {isInc ? '+' : '−'}{fmt(t.amount)}
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

const DonutChart = ({ data, colors }) => {
  const total = Object.values(data).reduce((s, v) => s + v, 0);
  if (total === 0) return null;
  
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const cx = 100, cy = 100, r = 80, inner = 50;
  let angle = -90;

  return (
    <svg viewBox="0 0 200 200" style={{ width: '160px', height: '160px' }}>
      {entries.map(([, val], i) => {
        const a = (val / total) * 360;
        const start = angle;
        angle += a;
        const end = angle;
        
        const sr = start * Math.PI / 180;
        const er = end * Math.PI / 180;
        
        const x1 = cx + r * Math.cos(sr);
        const y1 = cy + r * Math.sin(sr);
        const x2 = cx + r * Math.cos(er);
        const y2 = cy + r * Math.sin(er);
        const x3 = cx + inner * Math.cos(er);
        const y3 = cy + inner * Math.sin(er);
        const x4 = cx + inner * Math.cos(sr);
        const y4 = cy + inner * Math.sin(sr);
        
        const large = a > 180 ? 1 : 0;
        
        return (
          <path
            key={i}
            d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${inner} ${inner} 0 ${large} 0 ${x4} ${y4} Z`}
            fill={colors[i % colors.length]}
          />
        );
      })}
      <text x={cx} y={cy - 8} textAnchor="middle" style={{
        fontFamily: "'Instrument Serif', Georgia, serif",
        fontSize: '24px',
        fill: C.ink,
      }}>
        {fmt(total).replace('€', '').trim()}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '9px',
        fill: C.inkFaded,
        textTransform: 'uppercase',
        letterSpacing: '1px',
      }}>
        Total
      </text>
    </svg>
  );
};

const CategoryPanel = ({ title, data, type }) => {
  const cats = type === 'income' ? CATEGORIES.income : CATEGORIES.expense;
  const total = Object.values(data).reduce((s, v) => s + v, 0);
  const getCat = (id) => cats.find(c => c.id === id) || { label: id, mark: '○' };
  
  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div style={{
      background: C.paper,
      border: `2px solid ${C.ink}`,
      padding: '24px',
    }}>
      <h4 style={{
        fontFamily: "'Instrument Serif', Georgia, serif",
        fontSize: '20px',
        fontWeight: 400,
        margin: '0 0 24px 0',
        paddingBottom: '12px',
        borderBottom: `1px solid ${C.cream}`,
      }}>
        {title}
      </h4>
      
      {total === 0 ? (
        <div style={{ color: C.ghost, textAlign: 'center', padding: '40px 0' }}>
          No data
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '32px' }}>
          <DonutChart data={data} colors={C.charts} />
          
          <div style={{ flex: 1 }}>
            {sorted.map(([k, v], i) => {
              const cat = getCat(k);
              return (
                <div key={k} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 0',
                  borderBottom: i < sorted.length - 1 ? `1px solid ${C.cream}` : 'none',
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    background: C.charts[i % C.charts.length],
                  }} />
                  <span style={{
                    fontFamily: "'Space Grotesk', system-ui",
                    fontSize: '13px',
                    color: C.inkLight,
                    flex: 1,
                  }}>
                    {cat.label}
                  </span>
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '12px',
                    color: C.ink,
                    fontWeight: 500,
                  }}>
                    {pct(v, total)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const MonthlyChart = ({ data, title = "Monthly trend" }) => {
  const entries = Object.entries(data).sort((a, b) => a[0].localeCompare(b[0])).slice(-6);
  if (entries.length === 0) return null;
  
  const maxVal = Math.max(...entries.flatMap(([, d]) => [d.inc, d.exp]), 1);
  const barW = 28;
  const gap = 40;
  const h = 180;

  return (
    <div style={{
      background: C.paper,
      border: `2px solid ${C.ink}`,
      padding: '24px',
    }}>
      <h4 style={{
        fontFamily: "'Instrument Serif', Georgia, serif",
        fontSize: '20px',
        fontWeight: 400,
        margin: '0 0 24px 0',
        paddingBottom: '12px',
        borderBottom: `1px solid ${C.cream}`,
      }}>
        {title}
      </h4>
      
      <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', background: C.green }} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: C.inkFaded, textTransform: 'uppercase' }}>Income</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', background: C.red }} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: C.inkFaded, textTransform: 'uppercase' }}>Expenses</span>
        </div>
      </div>

      <svg width="100%" height={h + 40} viewBox={`0 0 ${entries.length * (barW * 2 + gap) + 20} ${h + 40}`}>
        {/* Grid */}
        {[0, 1, 2, 3].map(i => (
          <line key={i} x1="0" y1={i * (h / 3)} x2="100%" y2={i * (h / 3)} stroke={C.cream} strokeWidth="1" />
        ))}
        
        {entries.map(([k, v], i) => {
          const x = i * (barW * 2 + gap) + 20;
          const hInc = (v.inc / maxVal) * h;
          const hExp = (v.exp / maxVal) * h;
          const mo = parseInt(k.split('-')[1]) - 1;
          
          return (
            <g key={k}>
              <rect x={x} y={h - hInc} width={barW} height={hInc} fill={C.green} />
              <rect x={x + barW + 4} y={h - hExp} width={barW} height={hExp} fill={C.red} />
              <text x={x + barW + 2} y={h + 24} textAnchor="middle" style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px',
                fill: C.inkFaded,
              }}>
                {MOIS[mo]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const Toolbar = ({ onReset, onClear }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    padding: '16px 32px',
    borderBottom: `1px solid ${C.cream}`,
  }}>
    {[
      { label: '↻ Sample', action: onReset },
      { label: '⌫ Clear', action: onClear },
    ].map(b => (
      <button
        key={b.label}
        onClick={b.action}
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          padding: '8px 16px',
          background: 'transparent',
          color: C.inkFaded,
          border: `1px solid ${C.ghost}`,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = C.ink;
          e.currentTarget.style.color = C.ink;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = C.ghost;
          e.currentTarget.style.color = C.inkFaded;
        }}
      >
        {b.label}
      </button>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════
// VIEWS
// ═══════════════════════════════════════════════════════════

const DashboardView = ({ totals, count, txs, del, filter, setFilter, expByCat, incByCat, monthly }) => (
  <>
    <StatsBar totals={totals} count={count} />
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      minHeight: '500px',
    }}>
      <div style={{ borderRight: `3px solid ${C.ink}` }}>
        <TxList txs={txs.slice(0, 8)} onDelete={del} filter={filter} setFilter={setFilter} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px', background: C.bg }}>
        <CategoryPanel title="Expense breakdown" data={expByCat} type="expense" />
        <MonthlyChart data={monthly} title="Monthly trend" />
      </div>
    </div>
  </>
);

const TransactionsView = ({ add, txs, del, filter, setFilter }) => (
  <>
    <TxForm onSubmit={add} />
    <TxList txs={txs} onDelete={del} filter={filter} setFilter={setFilter} />
  </>
);

const StatsView = ({ totals, expByCat, incByCat, monthly }) => (
  <div style={{ padding: '32px', background: C.bg }}>
    <h2 style={{
      fontFamily: "'Instrument Serif', Georgia, serif",
      fontSize: '36px',
      fontWeight: 400,
      margin: '0 0 32px 0',
      color: C.ink,
    }}>
      Detailed analysis
    </h2>
    
    <StatsBar totals={totals} count={0} />
    
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '24px',
      marginTop: '24px',
    }}>
      <CategoryPanel title="Expenses by category" data={expByCat} type="expense" />
      <CategoryPanel title="Income by source" data={incByCat} type="income" />
      <div style={{ gridColumn: '1 / -1' }}>
        <MonthlyChart data={monthly} />
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════

export default function App() {
  const [view, setView] = useState('dashboard');
  const { txs, all, filter, setFilter, totals, expByCat, incByCat, monthly, add, del, reset, clear } = useBudget();

  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      fontFamily: "'Space Grotesk', system-ui",
      color: C.ink,
    }}>
      {/* Import fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Instrument+Serif&family=Space+Grotesk:wght@400;500;600&display=swap');
      `}</style>
      
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: C.paper,
        minHeight: '100vh',
        boxShadow: '0 0 60px rgba(0,0,0,0.08)',
      }}>
        <Header view={view} setView={setView} />
        <Toolbar onReset={reset} onClear={clear} />
        
        {view === 'dashboard' && (
          <DashboardView
            totals={totals}
            count={all.length}
            txs={txs}
            del={del}
            filter={filter}
            setFilter={setFilter}
            expByCat={expByCat}
            incByCat={incByCat}
            monthly={monthly}
          />
        )}
        
        {view === 'transactions' && (
          <TransactionsView
            add={add}
            txs={txs}
            del={del}
            filter={filter}
            setFilter={setFilter}
          />
        )}
        
        {view === 'stats' && (
          <StatsView
            totals={totals}
            expByCat={expByCat}
            incByCat={incByCat}
            monthly={monthly}
          />
        )}
        
        <footer style={{
          padding: '24px 32px',
          borderTop: `3px solid ${C.ink}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: C.inkFaded,
          }}>
            Budget. — {new Date().getFullYear()}
          </div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            color: C.ghost,
          }}>
            Made with care
          </div>
        </footer>
      </div>
    </div>
  );
}
