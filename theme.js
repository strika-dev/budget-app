// Theme - Neo-Brutalist Editorial
// Swiss design meets raw aesthetics

export const THEME = {
  colors: {
    bg: '#F5F0E8',
    paper: '#FFFDF9',
    cream: '#EDE8DC',
    ink: '#1A1A1A',
    inkLight: '#3D3D3D',
    inkFaded: '#6B6B6B',
    ghost: '#A8A8A8',
    coral: '#FF5A36',
    coralDark: '#E04420',
    green: '#2D7A4F',
    greenLight: '#E8F5ED',
    red: '#C23B3B',
    redLight: '#FDEDED',
    charts: ['#FF5A36', '#1A1A1A', '#2D7A4F', '#8B7355', '#5B8A72', '#C4A77D'],
  },
  fonts: {
    display: "'Instrument Serif', Georgia, serif",
    body: "'Space Grotesk', system-ui, sans-serif",
    mono: "'IBM Plex Mono', monospace",
  },
};

export const CATEGORIES = {
  income: [
    { id: 'salary', label: 'Salaire', mark: '■' },
    { id: 'freelance', label: 'Freelance', mark: '◆' },
    { id: 'investment', label: 'Placements', mark: '▲' },
    { id: 'gift', label: 'Dons reçus', mark: '●' },
    { id: 'other_income', label: 'Autres', mark: '○' },
  ],
  expense: [
    { id: 'housing', label: 'Logement', mark: '■' },
    { id: 'food', label: 'Alimentation', mark: '●' },
    { id: 'transport', label: 'Transport', mark: '▶' },
    { id: 'utilities', label: 'Factures', mark: '◇' },
    { id: 'health', label: 'Santé', mark: '+' },
    { id: 'entertainment', label: 'Loisirs', mark: '★' },
    { id: 'shopping', label: 'Achats', mark: '◆' },
    { id: 'education', label: 'Formation', mark: '▲' },
    { id: 'savings', label: 'Épargne', mark: '◐' },
    { id: 'other_expense', label: 'Divers', mark: '○' },
  ],
};

export const MONTHS_SHORT = ['JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUN', 'JUL', 'AOÛ', 'SEP', 'OCT', 'NOV', 'DÉC'];

export default THEME;
