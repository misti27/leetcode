export type Theme = 'light' | 'dark' | 'eyecare';

export type ThemeClasses = {
  bg: string;
  text: string;
  textMuted: string;
  headerBg: string;
  headerBorder: string;
  sidebarBg: string;
  sidebarBorder: string;
  inputBg: string;
  inputFocus: string;
  cardHover: string;
  cardBg: string;
  cardBorder: string;
  cardSelected: string;
  tagBg: string;
  divider: string;
  scrollbarThumb: string;
  inputBorder: string;
};

export const themeClasses: Record<Theme, ThemeClasses> = {
  light: {
    bg: 'bg-white',
    text: 'text-gray-800',
    textMuted: 'text-gray-500',
    headerBg: 'bg-white',
    headerBorder: 'border-gray-200',
    sidebarBg: 'bg-gray-50',
    sidebarBorder: 'border-gray-200',
    inputBg: 'bg-gray-100',
    inputFocus: 'focus:bg-white',
    cardHover: 'hover:bg-white hover:border-gray-200',
    cardBg: 'bg-white',
    cardBorder: 'border-gray-200',
    cardSelected: 'bg-white border-blue-200 shadow-sm ring-1 ring-blue-100',
    tagBg: 'bg-gray-100',
    divider: 'border-gray-100',
    scrollbarThumb: 'bg-gray-300',
    inputBorder: 'border-gray-200',
  },
  dark: {
    bg: 'bg-gray-900',
    text: 'text-gray-100',
    textMuted: 'text-gray-400',
    headerBg: 'bg-gray-900',
    headerBorder: 'border-gray-800',
    sidebarBg: 'bg-gray-800/50',
    sidebarBorder: 'border-gray-800',
    inputBg: 'bg-gray-800',
    inputFocus: 'focus:bg-gray-800',
    cardHover: 'hover:bg-gray-800 hover:border-gray-700',
    cardBg: 'bg-gray-800',
    cardBorder: 'border-gray-700',
    cardSelected: 'bg-gray-800 border-indigo-500 shadow-sm ring-1 ring-indigo-900',
    tagBg: 'bg-gray-800',
    divider: 'border-gray-800',
    scrollbarThumb: 'bg-gray-600',
    inputBorder: 'border-gray-700',
  },
  eyecare: {
    bg: 'bg-[#C7EDCC]',
    text: 'text-[#2c3e50]',
    textMuted: 'text-[#5d6b75]',
    headerBg: 'bg-[#C7EDCC]',
    headerBorder: 'border-[#a5c6aa]',
    sidebarBg: 'bg-[#baddbf]',
    sidebarBorder: 'border-[#a5c6aa]',
    inputBg: 'bg-[#baddbf]',
    inputFocus: 'focus:bg-[#e6f5e8]',
    cardHover: 'hover:bg-[#e6f5e8] hover:border-[#a5c6aa]',
    cardBg: 'bg-[#e6f5e8]',
    cardBorder: 'border-[#a5c6aa]',
    cardSelected: 'bg-[#e6f5e8] border-[#8cb090] shadow-sm ring-1 ring-[#8cb090]',
    tagBg: 'bg-[#baddbf]',
    divider: 'border-[#a5c6aa]',
    scrollbarThumb: 'bg-[#8cb090]',
    inputBorder: 'border-[#a5c6aa]',
  }
};
