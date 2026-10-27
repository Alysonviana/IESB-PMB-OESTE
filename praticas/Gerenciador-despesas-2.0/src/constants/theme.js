export const CATEGORIES = [
  'Alimentação', 'Transporte', 'Moradia', 'Lazer', 'Saúde', 'Educação', 'Outros',
];

export const themes = {
  light: {
    background: '#F3F4F6', card: '#FFFFFF', text: '#111827', subtext: '#6B7280',
    border: '#D1D5DB', primary: '#3B5BDB', danger: '#DC2626', input: '#FFFFFF',
  },
  dark: {
    background: '#0F172A', card: '#1E293B', text: '#F1F5F9', subtext: '#94A3B8',
    border: '#334155', primary: '#748FFC', danger: '#F87171', input: '#1E293B',
  },
};

export const getTheme = (scheme) => (scheme === 'dark' ? themes.dark : themes.light);