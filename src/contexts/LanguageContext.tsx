
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define supported languages
export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja';

// Translation type
type Translations = {
  [key: string]: {
    [key in Language]?: string;
  };
};

// Language context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  availableLanguages: { code: Language; name: string }[];
}

// Translations data
const translations: Translations = {
  // Navbar
  'nav.home': {
    en: 'Home',
    es: 'Inicio',
    fr: 'Accueil',
    de: 'Startseite',
    zh: '首页',
    ja: 'ホーム',
  },
  'nav.tickets': {
    en: 'Tickets',
    es: 'Entradas',
    fr: 'Billets',
    de: 'Tickets',
    zh: '门票',
    ja: 'チケット',
  },
  'nav.exhibitions': {
    en: 'Exhibitions',
    es: 'Exposiciones',
    fr: 'Expositions',
    de: 'Ausstellungen',
    zh: '展览',
    ja: '展示会',
  },
  'nav.about': {
    en: 'About',
    es: 'Acerca de',
    fr: 'À propos',
    de: 'Über uns',
    zh: '关于我们',
    ja: '私たちについて',
  },
  // Home page
  'home.welcome': {
    en: 'Welcome to the Museum',
    es: 'Bienvenido al Museo',
    fr: 'Bienvenue au Musée',
    de: 'Willkommen im Museum',
    zh: '欢迎来到博物馆',
    ja: '博物館へようこそ',
  },
  'home.subtitle': {
    en: 'Discover art, history and culture',
    es: 'Descubre arte, historia y cultura',
    fr: 'Découvrez l\'art, l\'histoire et la culture',
    de: 'Entdecken Sie Kunst, Geschichte und Kultur',
    zh: '探索艺术、历史和文化',
    ja: '芸術、歴史、文化を発見する',
  },
  'home.getTickets': {
    en: 'Get Tickets',
    es: 'Obtener Entradas',
    fr: 'Obtenir des Billets',
    de: 'Tickets Buchen',
    zh: '获取门票',
    ja: 'チケットを取得',
  },
  'home.exploreExhibitions': {
    en: 'Explore Exhibitions',
    es: 'Explorar Exposiciones',
    fr: 'Explorer les Expositions',
    de: 'Ausstellungen Erkunden',
    zh: '探索展览',
    ja: '展示会を探索',
  },
  // Chatbot
  'chatbot.welcome': {
    en: 'Hello! I\'m your virtual assistant. How can I help you with your museum visit today?',
    es: '¡Hola! Soy tu asistente virtual. ¿Cómo puedo ayudarte con tu visita al museo hoy?',
    fr: 'Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider pour votre visite au musée aujourd\'hui ?',
    de: 'Hallo! Ich bin Ihr virtueller Assistent. Wie kann ich Ihnen heute bei Ihrem Museumsbesuch helfen?',
    zh: '您好！我是您的虚拟助手。今天我能为您的博物馆参观提供什么帮助？',
    ja: 'こんにちは！私はあなたの仮想アシスタントです。今日の博物館訪問のお手伝いをさせていただきます。',
  },
  'chatbot.placeholder': {
    en: 'Type your message here...',
    es: 'Escribe tu mensaje aquí...',
    fr: 'Tapez votre message ici...',
    de: 'Geben Sie Ihre Nachricht hier ein...',
    zh: '在此处输入您的消息...',
    ja: 'メッセージをここに入力してください...',
  },
  'chatbot.send': {
    en: 'Send',
    es: 'Enviar',
    fr: 'Envoyer',
    de: 'Senden',
    zh: '发送',
    ja: '送信',
  },
  // Tickets
  'tickets.title': {
    en: 'Book Your Tickets',
    es: 'Reserva tus Entradas',
    fr: 'Réservez vos Billets',
    de: 'Buchen Sie Ihre Tickets',
    zh: '预订门票',
    ja: 'チケットを予約する',
  },
  'tickets.date': {
    en: 'Select Date',
    es: 'Seleccionar Fecha',
    fr: 'Sélectionner une Date',
    de: 'Datum Auswählen',
    zh: '选择日期',
    ja: '日付を選択',
  },
  'tickets.type': {
    en: 'Ticket Type',
    es: 'Tipo de Entrada',
    fr: 'Type de Billet',
    de: 'Ticket-Typ',
    zh: '门票类型',
    ja: 'チケットタイプ',
  },
  'tickets.adult': {
    en: 'Adult',
    es: 'Adulto',
    fr: 'Adulte',
    de: 'Erwachsener',
    zh: '成人',
    ja: '大人',
  },
  'tickets.child': {
    en: 'Child',
    es: 'Niño',
    fr: 'Enfant',
    de: 'Kind',
    zh: '儿童',
    ja: '子供',
  },
  'tickets.senior': {
    en: 'Senior',
    es: 'Adulto Mayor',
    fr: 'Senior',
    de: 'Senior',
    zh: '老年人',
    ja: 'シニア',
  },
  'tickets.student': {
    en: 'Student',
    es: 'Estudiante',
    fr: 'Étudiant',
    de: 'Student',
    zh: '学生',
    ja: '学生',
  },
  'tickets.price': {
    en: 'Price',
    es: 'Precio',
    fr: 'Prix',
    de: 'Preis',
    zh: '价格',
    ja: '価格',
  },
  'tickets.quantity': {
    en: 'Quantity',
    es: 'Cantidad',
    fr: 'Quantité',
    de: 'Menge',
    zh: '数量',
    ja: '数量',
  },
  'tickets.total': {
    en: 'Total',
    es: 'Total',
    fr: 'Total',
    de: 'Gesamt',
    zh: '总计',
    ja: '合計',
  },
  'tickets.checkout': {
    en: 'Checkout',
    es: 'Pagar',
    fr: 'Paiement',
    de: 'Zur Kasse',
    zh: '结账',
    ja: '精算',
  },
  // Payment
  'payment.title': {
    en: 'Payment Details',
    es: 'Detalles de Pago',
    fr: 'Détails de Paiement',
    de: 'Zahlungsdetails',
    zh: '支付详情',
    ja: '支払い詳細',
  },
  'payment.cardNumber': {
    en: 'Card Number',
    es: 'Número de Tarjeta',
    fr: 'Numéro de Carte',
    de: 'Kartennummer',
    zh: '卡号',
    ja: 'カード番号',
  },
  'payment.expiry': {
    en: 'Expiry Date',
    es: 'Fecha de Vencimiento',
    fr: 'Date d\'Expiration',
    de: 'Ablaufdatum',
    zh: '有效期',
    ja: '有効期限',
  },
  'payment.cvc': {
    en: 'CVC',
    es: 'CVC',
    fr: 'CVC',
    de: 'CVC',
    zh: 'CVC',
    ja: 'CVC',
  },
  'payment.name': {
    en: 'Name on Card',
    es: 'Nombre en la Tarjeta',
    fr: 'Nom sur la Carte',
    de: 'Name auf der Karte',
    zh: '持卡人姓名',
    ja: 'カード名義人',
  },
  'payment.email': {
    en: 'Email',
    es: 'Correo Electrónico',
    fr: 'Email',
    de: 'E-Mail',
    zh: '电子邮件',
    ja: 'メール',
  },
  'payment.pay': {
    en: 'Pay Now',
    es: 'Pagar Ahora',
    fr: 'Payer Maintenant',
    de: 'Jetzt Bezahlen',
    zh: '立即支付',
    ja: '今すぐ支払う',
  },
  'payment.success': {
    en: 'Payment Successful!',
    es: '¡Pago Exitoso!',
    fr: 'Paiement Réussi !',
    de: 'Zahlung Erfolgreich!',
    zh: '支付成功！',
    ja: '支払い成功！',
  },
  // General
  'general.loading': {
    en: 'Loading',
    es: 'Cargando',
    fr: 'Chargement',
    de: 'Wird geladen',
    zh: '加载中',
    ja: '読み込み中',
  },
  'general.error': {
    en: 'An error occurred',
    es: 'Ocurrió un error',
    fr: 'Une erreur est survenue',
    de: 'Ein Fehler ist aufgetreten',
    zh: '发生错误',
    ja: 'エラーが発生しました',
  },
  'general.retry': {
    en: 'Retry',
    es: 'Reintentar',
    fr: 'Réessayer',
    de: 'Wiederholen',
    zh: '重试',
    ja: '再試行',
  },
  'general.confirm': {
    en: 'Confirm',
    es: 'Confirmar',
    fr: 'Confirmer',
    de: 'Bestätigen',
    zh: '确认',
    ja: '確認',
  },
  'general.cancel': {
    en: 'Cancel',
    es: 'Cancelar',
    fr: 'Annuler',
    de: 'Abbrechen',
    zh: '取消',
    ja: 'キャンセル',
  },
};

// Available languages
const availableLanguages = [
  { code: 'en' as Language, name: 'English' },
  { code: 'es' as Language, name: 'Español' },
  { code: 'fr' as Language, name: 'Français' },
  { code: 'de' as Language, name: 'Deutsch' },
  { code: 'zh' as Language, name: '中文' },
  { code: 'ja' as Language, name: '日本語' },
];

// Create context
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
  availableLanguages,
});

// Language provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get browser language or default to English
  const getBrowserLanguage = (): Language => {
    const browserLang = navigator.language.split('-')[0];
    return (availableLanguages.some(lang => lang.code === browserLang) ? browserLang : 'en') as Language;
  };

  // State for current language
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get from localStorage first
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || getBrowserLanguage();
  });

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][language] || translations[key]['en'] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = () => useContext(LanguageContext);
