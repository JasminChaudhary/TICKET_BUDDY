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
  'nav.myTickets': {
    en: 'My Tickets',
    es: 'Mis Entradas',
    fr: 'Mes Billets',
    de: 'Meine Tickets',
    zh: '我的门票',
    ja: '私のチケット',
  },
  'nav.adminPanel': {
    en: 'Admin Panel',
    es: 'Panel de Administración',
    fr: 'Panneau d\'Administration',
    de: 'Admin-Panel',
    zh: '管理面板',
    ja: '管理パネル',
  },
  'nav.myDashboard': {
    en: 'My Dashboard',
    es: 'Mi Panel',
    fr: 'Mon Tableau de Bord',
    de: 'Mein Dashboard',
    zh: '我的仪表板',
    ja: '私のダッシュボード',
  },
  'nav.logout': {
    en: 'Logout',
    es: 'Cerrar Sesión',
    fr: 'Déconnexion',
    de: 'Abmelden',
    zh: '登出',
    ja: 'ログアウト',
  },
  'nav.login': {
    en: 'Login',
    es: 'Iniciar Sesión',
    fr: 'Connexion',
    de: 'Anmelden',
    zh: '登录',
    ja: 'ログイン',
  },
  'nav.signup': {
    en: 'Sign up',
    es: 'Registrarse',
    fr: 'S\'inscrire',
    de: 'Registrieren',
    zh: '注册',
    ja: 'サインアップ',
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
  // About page
  'about.pageTitle': {
    en: 'About Our Museum',
    es: 'Acerca de Nuestro Museo',
    fr: 'À propos de Notre Musée',
    de: 'Über Unser Museum',
    zh: '关于我们的博物馆',
    ja: '当館について',
  },
  'about.pageSubtitle': {
    en: 'Discover our story, mission, and the team that brings art and culture to life.',
    es: 'Descubre nuestra historia, misión y el equipo que da vida al arte y la cultura.',
    fr: 'Découvrez notre histoire, notre mission et l\'équipe qui donne vie à l\'art et à la culture.',
    de: 'Entdecken Sie unsere Geschichte, Mission und das Team, das Kunst und Kultur zum Leben erweckt.',
    zh: '了解我们的故事、使命和为艺术和文化注入生命的团队。',
    ja: '私たちの物語、使命、そして芸術と文化に命を吹き込むチームを発見してください。',
  },
  'about.aboutUsTab': {
    en: 'About Us',
    es: 'Sobre Nosotros',
    fr: 'À Propos de Nous',
    de: 'Über Uns',
    zh: '关于我们',
    ja: '私たちについて',
  },
  'about.visitTab': {
    en: 'Visit',
    es: 'Visitar',
    fr: 'Visiter',
    de: 'Besuch',
    zh: '参观',
    ja: '訪問',
  },
  'about.ourStory': {
    en: 'Our Story',
    es: 'Nuestra Historia',
    fr: 'Notre Histoire',
    de: 'Unsere Geschichte',
    zh: '我们的故事',
    ja: '私たちの物語',
  },
  'about.storyText1': {
    en: 'Founded in 1975, our museum has grown from a small gallery to a world-renowned cultural institution. For over four decades, we\'ve been dedicated to collecting, preserving, and exhibiting significant works of art and cultural artifacts from around the world.',
    es: 'Fundado en 1975, nuestro museo ha crecido de una pequeña galería a una institución cultural de renombre mundial. Durante más de cuatro décadas, nos hemos dedicado a recolectar, preservar y exhibir obras significativas de arte y artefactos culturales de todo el mundo.',
    fr: 'Fondé en 1975, notre musée est passé d\'une petite galerie à une institution culturelle de renommée mondiale. Pendant plus de quatre décennies, nous nous sommes consacrés à la collecte, à la préservation et à l\'exposition d\'œuvres d\'art importantes et d\'artefacts culturels du monde entier.',
    de: 'Unser Museum wurde 1975 gegründet und hat sich von einer kleinen Galerie zu einer weltbekannten Kulturinstitution entwickelt. Seit über vier Jahrzehnten widmen wir uns dem Sammeln, Bewahren und Ausstellen bedeutender Kunstwerke und kultureller Artefakte aus aller Welt.',
    zh: '我们的博物馆成立于1975年，已从一个小型画廊发展成为世界知名的文化机构。四十多年来，我们致力于收集、保存和展示来自世界各地的重要艺术品和文化文物。',
    ja: '1975年に設立された当館は、小さなギャラリーから世界的に有名な文化施設へと成長しました。40年以上にわたり、世界中の重要な芸術作品や文化的工芸品の収集、保存、展示に専念してきました。',
  },
  'about.storyText2': {
    en: 'Our collection spans thousands of years, from ancient civilizations to contemporary expressions, reflecting the diversity and richness of human creativity and cultural heritage.',
    es: 'Nuestra colección abarca miles de años, desde civilizaciones antiguas hasta expresiones contemporáneas, reflejando la diversidad y riqueza de la creatividad humana y el patrimonio cultural.',
    fr: 'Notre collection s\'étend sur des milliers d\'années, des civilisations anciennes aux expressions contemporaines, reflétant la diversité et la richesse de la créativité humaine et du patrimoine culturel.',
    de: 'Unsere Sammlung umfasst Tausende von Jahren, von antiken Zivilisationen bis hin zu zeitgenössischen Ausdrucksformen, und spiegelt die Vielfalt und den Reichtum menschlicher Kreativität und kulturellen Erbes wider.',
    zh: '我们的收藏跨越数千年，从古代文明到当代表达，反映了人类创造力和文化遗产的多样性和丰富性。',
    ja: '私たちのコレクションは古代文明から現代的な表現まで数千年にわたり、人間の創造性と文化遺産の多様性と豊かさを反映しています。',
  },
  'about.ourMission': {
    en: 'Our Mission',
    es: 'Nuestra Misión',
    fr: 'Notre Mission',
    de: 'Unsere Mission',
    zh: '我们的使命',
    ja: '私たちの使命',
  },
  'about.missionText': {
    en: 'We are committed to making art and culture accessible to all, fostering understanding and appreciation across different cultures and time periods. Through our exhibitions, educational programs, and community outreach, we strive to inspire curiosity, creativity, and lifelong learning.',
    es: 'Estamos comprometidos a hacer que el arte y la cultura sean accesibles para todos, fomentando la comprensión y apreciación entre diferentes culturas y períodos de tiempo. A través de nuestras exhibiciones, programas educativos y alcance comunitario, nos esforzamos por inspirar la curiosidad, la creatividad y el aprendizaje permanente.',
    fr: 'Nous nous engageons à rendre l\'art et la culture accessibles à tous, en favorisant la compréhension et l\'appréciation à travers différentes cultures et périodes. Par nos expositions, nos programmes éducatifs et nos activités communautaires, nous cherchons à susciter la curiosité, la créativité et l\'apprentissage tout au long de la vie.',
    de: 'Wir setzen uns dafür ein, Kunst und Kultur für alle zugänglich zu machen und Verständnis und Wertschätzung für verschiedene Kulturen und Zeitperioden zu fördern. Durch unsere Ausstellungen, Bildungsprogramme und Gemeinschaftsarbeit wollen wir Neugierde, Kreativität und lebenslanges Lernen anregen.',
    zh: '我们致力于使艺术和文化为所有人所接触，促进对不同文化和时代的理解和欣赏。通过我们的展览、教育项目和社区外展活动，我们努力激发好奇心、创造力和终身学习。',
    ja: '私たちは芸術と文化をすべての人にアクセスしやすくし、異なる文化や時代にわたる理解と評価を育むことに取り組んでいます。展示会、教育プログラム、コミュニティアウトリーチを通じて、好奇心、創造性、生涯学習を促進するよう努めています。',
  },
  'about.established': {
    en: 'Established',
    es: 'Establecido',
    fr: 'Établi',
    de: 'Gegründet',
    zh: '成立时间',
    ja: '設立',
  },
  'about.collection': {
    en: 'Collection',
    es: 'Colección',
    fr: 'Collection',
    de: 'Sammlung',
    zh: '收藏',
    ja: 'コレクション',
  },
  'about.annualVisitors': {
    en: 'Annual Visitors',
    es: 'Visitantes Anuales',
    fr: 'Visiteurs Annuels',
    de: 'Jährliche Besucher',
    zh: '年访客量',
    ja: '年間訪問者',
  },
  'about.awards': {
    en: 'Awards',
    es: 'Premios',
    fr: 'Prix',
    de: 'Auszeichnungen',
    zh: '奖项',
    ja: '受賞歴',
  },
  'about.joinUs': {
    en: 'Join Us in Our Journey',
    es: 'Únete a Nuestro Viaje',
    fr: 'Rejoignez-nous dans Notre Voyage',
    de: 'Begleiten Sie uns auf Unserer Reise',
    zh: '加入我们的旅程',
    ja: '私たちの旅に参加しましょう',
  },
  'about.supportText': {
    en: 'Support our mission by becoming a member, volunteering, or making a donation. Your contribution helps us continue to provide exceptional art experiences and educational programs.',
    es: 'Apoya nuestra misión convirtiéndote en miembro, voluntario o haciendo una donación. Tu contribución nos ayuda a seguir ofreciendo experiencias artísticas excepcionales y programas educativos.',
    fr: 'Soutenez notre mission en devenant membre, en faisant du bénévolat ou en faisant un don. Votre contribution nous aide à continuer à offrir des expériences artistiques exceptionnelles et des programmes éducatifs.',
    de: 'Unterstützen Sie unsere Mission, indem Sie Mitglied werden, sich freiwillig engagieren oder eine Spende machen. Ihr Beitrag hilft uns, weiterhin außergewöhnliche Kunsterlebnisse und Bildungsprogramme anzubieten.',
    zh: '通过成为会员、志愿者或捐款来支持我们的使命。您的贡献帮助我们继续提供卓越的艺术体验和教育计划。',
    ja: '会員になる、ボランティアをする、または寄付をすることで私たちの使命をサポートしてください。あなたの貢献は、私たちが引き続き卓越した芸術体験と教育プログラムを提供するのに役立ちます。',
  },
  'about.bookVisit': {
    en: 'Book a Visit',
    es: 'Reservar una Visita',
    fr: 'Réserver une Visite',
    de: 'Besuch Buchen',
    zh: '预约参观',
    ja: '訪問を予約',
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
