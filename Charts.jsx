// Charts - Neo-Brutalist Editorial
import React from 'react';
import { THEME, CATEGORIES, MONTHS_SHORT } from '../styles/theme';
import { formatCurrency, getPercentage } from '../utils/helpers';

const C = THEME.colors;

// Donut Chart Component
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
        fontFamily: THEME.fonts.display,
        fontSize: '24px',
        fill: C.ink,
      }}>
        {formatCurrency(total).replace('€', '').trim()}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" style={{
        fontFamily: THEME.fonts.mono,
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

// Category Panel Component
export const CategoryChart = ({ title, data, type }) => {
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
        fontFamily: THEME.fonts.display,
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
          Pas de données
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
                    fontFamily: THEME.fonts.body,
                    fontSize: '13px',
                    color: C.inkLight,
                    flex: 1,
                  }}>
                    {cat.label}
                  </span>
                  <span style={{
                    fontFamily: THEME.fonts.mono,
                    fontSize: '12px',
                    color: C.ink,
                    fontWeight: 500,
                  }}>
                    {getPercentage(v, total)}%
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

// Monthly Trend Chart
export const TrendChart = ({ title, data }) => {
  const entries = Object.entries(data).sort((a, b) => a[0].localeCompare(b[0])).slice(-6);
  if (entries.length === 0) return null;
  
  const maxVal = Math.max(...entries.flatMap(([, d]) => [d.income || d.inc, d.expenses || d.exp]), 1);
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
        fontFamily: THEME.fonts.display,
        fontSize: '20px',
        fontWeight: 400,
        margin: '0 0 24px 0',
        paddingBottom: '12px',
        borderBottom: `1px solid ${C.cream}`,
      }}>
        {title || 'Évolution mensuelle'}
      </h4>
      
      <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', background: C.green }} />
          <span style={{ fontFamily: THEME.fonts.mono, fontSize: '10px', color: C.inkFaded, textTransform: 'uppercase' }}>Entrées</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', background: C.red }} />
          <span style={{ fontFamily: THEME.fonts.mono, fontSize: '10px', color: C.inkFaded, textTransform: 'uppercase' }}>Sorties</span>
        </div>
      </div>

      <svg width="100%" height={h + 40} viewBox={`0 0 ${entries.length * (barW * 2 + gap) + 20} ${h + 40}`}>
        {/* Grid */}
        {[0, 1, 2, 3].map(i => (
          <line key={i} x1="0" y1={i * (h / 3)} x2="100%" y2={i * (h / 3)} stroke={C.cream} strokeWidth="1" />
        ))}
        
        {entries.map(([k, v], i) => {
          const x = i * (barW * 2 + gap) + 20;
          const hInc = ((v.income || v.inc) / maxVal) * h;
          const hExp = ((v.expenses || v.exp) / maxVal) * h;
          const mo = parseInt(k.split('-')[1]) - 1;
          
          return (
            <g key={k}>
              <rect x={x} y={h - hInc} width={barW} height={hInc} fill={C.green} />
              <rect x={x + barW + 4} y={h - hExp} width={barW} height={hExp} fill={C.red} />
              <text x={x + barW + 2} y={h + 24} textAnchor="middle" style={{
                fontFamily: THEME.fonts.mono,
                fontSize: '10px',
                fill: C.inkFaded,
              }}>
                {MONTHS_SHORT[mo]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Main Charts Container
export const Charts = ({ expensesByCategory, incomeByCategory, monthlyData }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    <CategoryChart title="Répartition des sorties" data={expensesByCategory} type="expense" />
    <TrendChart title="Évolution mensuelle" data={monthlyData} />
  </div>
);

export default Charts;
