// Main App - Neo-Brutalist Editorial Design
import React, { useState } from 'react';
import { Header } from './components/Header';
import { Summary } from './components/Summary';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { Charts, CategoryChart, TrendChart } from './components/Charts';
import { useBudget } from './hooks/useBudget';
import { THEME } from './styles/theme';

const C = THEME.colors;

// Toolbar Component
const Toolbar = ({ onReset, onClear }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    padding: '16px 32px',
    borderBottom: `1px solid ${C.cream}`,
  }}>
    {[
      { label: '↻ Exemple', action: onReset },
      { label: '⌫ Effacer', action: onClear },
    ].map(b => (
      <button
        key={b.label}
        onClick={b.action}
        style={{
          fontFamily: THEME.fonts.mono,
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

// Dashboard View
const DashboardView = ({ totals, count, transactions, onDelete, filter, setFilter, expensesByCategory, monthlyData }) => (
  <>
    <Summary totals={totals} count={count} />
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      minHeight: '500px',
    }}>
      <div style={{ borderRight: `3px solid ${C.ink}` }}>
        <TransactionList 
          transactions={transactions.slice(0, 8)} 
          onDelete={onDelete} 
          filter={filter} 
          onFilterChange={setFilter} 
        />
      </div>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '24px', 
        padding: '24px', 
        background: C.bg 
      }}>
        <CategoryChart title="Répartition des sorties" data={expensesByCategory} type="expense" />
        <TrendChart title="Évolution mensuelle" data={monthlyData} />
      </div>
    </div>
  </>
);

// Transactions View
const TransactionsView = ({ onAdd, transactions, onDelete, filter, setFilter }) => (
  <>
    <TransactionForm onSubmit={onAdd} />
    <TransactionList 
      transactions={transactions} 
      onDelete={onDelete} 
      filter={filter} 
      onFilterChange={setFilter} 
    />
  </>
);

// Stats View
const StatsView = ({ totals, expensesByCategory, incomeByCategory, monthlyData }) => (
  <div style={{ padding: '32px', background: C.bg }}>
    <h2 style={{
      fontFamily: THEME.fonts.display,
      fontSize: '36px',
      fontWeight: 400,
      margin: '0 0 32px 0',
      color: C.ink,
    }}>
      Analyse détaillée
    </h2>
    
    <Summary totals={totals} count={0} />
    
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '24px',
      marginTop: '24px',
    }}>
      <CategoryChart title="Sorties par catégorie" data={expensesByCategory} type="expense" />
      <CategoryChart title="Entrées par source" data={incomeByCategory} type="income" />
      <div style={{ gridColumn: '1 / -1' }}>
        <TrendChart title="Évolution mensuelle" data={monthlyData} />
      </div>
    </div>
  </div>
);

// Main App
export const App = () => {
  const [view, setView] = useState('dashboard');
  const {
    transactions,
    allTransactions,
    filter,
    totals,
    expensesByCategory,
    incomeByCategory,
    monthlyData,
    addTransaction,
    deleteTransaction,
    resetToSampleData,
    clearAllTransactions,
    setFilter,
  } = useBudget();

  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      fontFamily: THEME.fonts.body,
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
        <Toolbar onReset={resetToSampleData} onClear={clearAllTransactions} />
        
        {view === 'dashboard' && (
          <DashboardView
            totals={totals}
            count={allTransactions.length}
            transactions={transactions}
            onDelete={deleteTransaction}
            filter={filter}
            setFilter={setFilter}
            expensesByCategory={expensesByCategory}
            monthlyData={monthlyData}
          />
        )}
        
        {view === 'transactions' && (
          <TransactionsView
            onAdd={addTransaction}
            transactions={transactions}
            onDelete={deleteTransaction}
            filter={filter}
            setFilter={setFilter}
          />
        )}
        
        {view === 'stats' && (
          <StatsView
            totals={totals}
            expensesByCategory={expensesByCategory}
            incomeByCategory={incomeByCategory}
            monthlyData={monthlyData}
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
            fontFamily: THEME.fonts.mono,
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: C.inkFaded,
          }}>
            Budget. — {new Date().getFullYear()}
          </div>
          <div style={{
            fontFamily: THEME.fonts.mono,
            fontSize: '10px',
            color: C.ghost,
          }}>
            Fait avec soin
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
