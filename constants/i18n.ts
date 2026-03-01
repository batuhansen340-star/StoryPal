type TranslationKeys = {
  // Tabs
  home: string;
  create: string;
  library: string;
  settings: string;
  // Home
  greeting: string;
  homeTitle: string;
  createNewStory: string;
  ctaSubtitle: string;
  start: string;
  popularThemes: string;
  meetCharacters: string;
  freeStoriesToday: string;
  themesAvailable: string;
  charactersToChoose: string;
  // Create flow
  createStory: string;
  chooseAgeGroup: string;
  pickTheme: string;
  themeSubtitle: string;
  chooseCharacter: string;
  characterSubtitle: string;
  selectLanguage: string;
  languageSubtitle: string;
  back: string;
  // Personalization
  personalize: string;
  personalizeSubtitle: string;
  childName: string;
  childNamePlaceholder: string;
  gender: string;
  genderGirl: string;
  genderBoy: string;
  genderPreferNot: string;
  hairColor: string;
  skinTone: string;
  glasses: string;
  glassesYes: string;
  glassesNo: string;
  continueBtn: string;
  premiumFeature: string;
  unlockPersonalization: string;
  // Generating
  writingStory: string;
  paintingCover: string;
  drawingPages: string;
  storyComplete: string;
  oops: string;
  tryAgain: string;
  goBack: string;
  // Viewer
  aStoryPalAdventure: string;
  done: string;
  play: string;
  pause: string;
  bedtimeMode: string;
  sweetDreams: string;
  autoPlay: string;
  speed: string;
  slow: string;
  normal: string;
  fast: string;
  // Library
  myLibrary: string;
  storiesCreated: string;
  noStoriesYet: string;
  noStoriesText: string;
  // Settings
  settingsTitle: string;
  notifications: string;
  storyReminders: string;
  language: string;
  defaultAgeGroup: string;
  manageSubscription: string;
  restorePurchases: string;
  helpCenter: string;
  contactUs: string;
  rateStoryPal: string;
  privacyPolicy: string;
  signOut: string;
  general: string;
  subscription: string;
  support: string;
  account: string;
  // Age tips
  ageTip: string;
  pages: string;
  wordsPerPage: string;
};

const translations: Record<string, TranslationKeys> = {
  en: {
    home: 'Home',
    create: 'Create',
    library: 'Library',
    settings: 'Settings',
    greeting: 'Hello there!',
    homeTitle: 'What story shall\nwe create today?',
    createNewStory: 'Create New Story',
    ctaSubtitle: 'Pick a theme, choose a character, and let AI create magic!',
    start: 'Start',
    popularThemes: 'Popular Themes',
    meetCharacters: 'Meet the Characters',
    freeStoriesToday: 'Free stories\ntoday',
    themesAvailable: 'Themes\navailable',
    charactersToChoose: 'Characters\nto choose',
    createStory: 'Create a Story',
    chooseAgeGroup: 'First, choose the age group for your story',
    pickTheme: 'Pick a Theme',
    themeSubtitle: 'Where should your adventure take place?',
    chooseCharacter: 'Choose a Character',
    characterSubtitle: 'Who will be the hero of your story?',
    selectLanguage: 'Choose Language',
    languageSubtitle: 'What language should your story be in?',
    back: 'Back',
    personalize: 'Make It Personal',
    personalizeSubtitle: 'Put your child in the story!',
    childName: 'Child\'s Name',
    childNamePlaceholder: 'Enter name...',
    gender: 'Gender',
    genderGirl: 'Girl',
    genderBoy: 'Boy',
    genderPreferNot: 'Skip',
    hairColor: 'Hair Color',
    skinTone: 'Skin Tone',
    glasses: 'Glasses',
    glassesYes: 'Yes',
    glassesNo: 'No',
    continueBtn: 'Continue',
    premiumFeature: 'Premium Feature',
    unlockPersonalization: 'Unlock personalization — make YOUR child the hero!',
    writingStory: 'Writing your story...',
    paintingCover: 'Painting the cover...',
    drawingPages: 'Drawing page illustrations...',
    storyComplete: 'Story complete!',
    oops: 'Oops!',
    tryAgain: 'Try Again',
    goBack: 'Go Back',
    aStoryPalAdventure: 'A StoryPal Adventure',
    done: 'Done',
    play: 'Play',
    pause: 'Pause',
    bedtimeMode: 'Bedtime Mode',
    sweetDreams: 'Sweet dreams...',
    autoPlay: 'Auto-Play',
    speed: 'Speed',
    slow: 'Slow',
    normal: 'Normal',
    fast: 'Fast',
    myLibrary: 'My Library',
    storiesCreated: 'stories created',
    noStoriesYet: 'No stories yet!',
    noStoriesText: 'Create your first magical story and it will appear here',
    settingsTitle: 'Settings',
    notifications: 'Notifications',
    storyReminders: 'Story reminders',
    language: 'Language',
    defaultAgeGroup: 'Default Age Group',
    manageSubscription: 'Manage Subscription',
    restorePurchases: 'Restore Purchases',
    helpCenter: 'Help Center',
    contactUs: 'Contact Us',
    rateStoryPal: 'Rate StoryPal',
    privacyPolicy: 'Privacy Policy',
    signOut: 'Sign Out',
    general: 'General',
    subscription: 'Subscription',
    support: 'Support',
    account: 'Account',
    ageTip: 'Younger ages get simpler stories with bigger pictures. Older ages get longer adventures with richer details!',
    pages: 'pages',
    wordsPerPage: 'words/page',
  },
  tr: {
    home: 'Ana Sayfa',
    create: 'Olustur',
    library: 'Kutuphane',
    settings: 'Ayarlar',
    greeting: 'Merhaba!',
    homeTitle: 'Bugun hangi hikayeyi\nyazalim?',
    createNewStory: 'Yeni Hikaye Olustur',
    ctaSubtitle: 'Bir tema sec, karakter sec ve yapay zekanin sihir yaratmasina izin ver!',
    start: 'Basla',
    popularThemes: 'Populer Temalar',
    meetCharacters: 'Karakterlerle Tanis',
    freeStoriesToday: 'Bugunluk\nucretsiz hikaye',
    themesAvailable: 'Mevcut\ntema',
    charactersToChoose: 'Secebilecegin\nkarakter',
    createStory: 'Hikaye Olustur',
    chooseAgeGroup: 'Oncelikle hikayeniz icin yas grubunu secin',
    pickTheme: 'Tema Sec',
    themeSubtitle: 'Macera nerede gecmeli?',
    chooseCharacter: 'Karakter Sec',
    characterSubtitle: 'Hikayenin kahramani kim olsun?',
    selectLanguage: 'Dil Sec',
    languageSubtitle: 'Hikaye hangi dilde olsun?',
    back: 'Geri',
    personalize: 'Kisillestir',
    personalizeSubtitle: 'Cocugunuzu hikayeye koyun!',
    childName: 'Cocugun Adi',
    childNamePlaceholder: 'Isim girin...',
    gender: 'Cinsiyet',
    genderGirl: 'Kiz',
    genderBoy: 'Erkek',
    genderPreferNot: 'Atla',
    hairColor: 'Sac Rengi',
    skinTone: 'Ten Rengi',
    glasses: 'Gozluk',
    glassesYes: 'Var',
    glassesNo: 'Yok',
    continueBtn: 'Devam Et',
    premiumFeature: 'Premium Ozellik',
    unlockPersonalization: 'Kisisellesirmeyi ac — cocugunuz kahraman olsun!',
    writingStory: 'Hikayen yaziliyor...',
    paintingCover: 'Kapak ciziliyor...',
    drawingPages: 'Sayfa resimleri ciziliyor...',
    storyComplete: 'Hikaye tamam!',
    oops: 'Hay aksi!',
    tryAgain: 'Tekrar Dene',
    goBack: 'Geri Don',
    aStoryPalAdventure: 'Bir StoryPal Macerasi',
    done: 'Bitti',
    play: 'Oynat',
    pause: 'Duraklat',
    bedtimeMode: 'Uyku Modu',
    sweetDreams: 'Tatli ruyalar...',
    autoPlay: 'Otomatik Oynat',
    speed: 'Hiz',
    slow: 'Yavas',
    normal: 'Normal',
    fast: 'Hizli',
    myLibrary: 'Kutuphanem',
    storiesCreated: 'hikaye olusturuldu',
    noStoriesYet: 'Henuz hikaye yok!',
    noStoriesText: 'Ilk sihirli hikayeni olustur ve burada gorsun',
    settingsTitle: 'Ayarlar',
    notifications: 'Bildirimler',
    storyReminders: 'Hikaye hatirlatmalari',
    language: 'Dil',
    defaultAgeGroup: 'Varsayilan Yas Grubu',
    manageSubscription: 'Aboneligi Yonet',
    restorePurchases: 'Satin Almalari Geri Yukle',
    helpCenter: 'Yardim Merkezi',
    contactUs: 'Bize Ulasin',
    rateStoryPal: "StoryPal'i Degerlendir",
    privacyPolicy: 'Gizlilik Politikasi',
    signOut: 'Cikis Yap',
    general: 'Genel',
    subscription: 'Abonelik',
    support: 'Destek',
    account: 'Hesap',
    ageTip: 'Kucuk yaslar daha basit hikayeler ve buyuk resimler alir. Buyuk yaslar daha uzun maceralar ve zengin detaylar alir!',
    pages: 'sayfa',
    wordsPerPage: 'kelime/sayfa',
  },
  es: {
    home: 'Inicio',
    create: 'Crear',
    library: 'Biblioteca',
    settings: 'Ajustes',
    greeting: '\u00A1Hola!',
    homeTitle: '\u00BFQue historia\ncrearemos hoy?',
    createNewStory: 'Crear Nueva Historia',
    ctaSubtitle: '\u00A1Elige un tema, escoge un personaje y deja que la IA cree magia!',
    start: 'Empezar',
    popularThemes: 'Temas Populares',
    meetCharacters: 'Conoce los Personajes',
    freeStoriesToday: 'Historias\ngratis hoy',
    themesAvailable: 'Temas\ndisponibles',
    charactersToChoose: 'Personajes\npara elegir',
    createStory: 'Crear Historia',
    chooseAgeGroup: 'Primero, elige el grupo de edad para tu historia',
    pickTheme: 'Elige un Tema',
    themeSubtitle: '\u00BFDonde deberia tener lugar tu aventura?',
    chooseCharacter: 'Elige un Personaje',
    characterSubtitle: '\u00BFQuien sera el heroe de tu historia?',
    selectLanguage: 'Elige Idioma',
    languageSubtitle: '\u00BFEn que idioma debe estar tu historia?',
    back: 'Volver',
    personalize: 'Personalizar',
    personalizeSubtitle: '\u00A1Pon a tu hijo en la historia!',
    childName: 'Nombre del nino',
    childNamePlaceholder: 'Ingresa nombre...',
    gender: 'Genero',
    genderGirl: 'Nina',
    genderBoy: 'Nino',
    genderPreferNot: 'Omitir',
    hairColor: 'Color de Pelo',
    skinTone: 'Tono de Piel',
    glasses: 'Gafas',
    glassesYes: 'Si',
    glassesNo: 'No',
    continueBtn: 'Continuar',
    premiumFeature: 'Funcion Premium',
    unlockPersonalization: '\u00A1Desbloquea la personalizacion — haz que TU hijo sea el heroe!',
    writingStory: 'Escribiendo tu historia...',
    paintingCover: 'Pintando la portada...',
    drawingPages: 'Dibujando ilustraciones...',
    storyComplete: '\u00A1Historia completa!',
    oops: '\u00A1Ups!',
    tryAgain: 'Intentar de Nuevo',
    goBack: 'Volver',
    aStoryPalAdventure: 'Una Aventura StoryPal',
    done: 'Listo',
    play: 'Reproducir',
    pause: 'Pausar',
    bedtimeMode: 'Modo Dormir',
    sweetDreams: 'Dulces suenos...',
    autoPlay: 'Auto-Reproducir',
    speed: 'Velocidad',
    slow: 'Lenta',
    normal: 'Normal',
    fast: 'Rapida',
    myLibrary: 'Mi Biblioteca',
    storiesCreated: 'historias creadas',
    noStoriesYet: '\u00A1Aun no hay historias!',
    noStoriesText: 'Crea tu primera historia magica y aparecera aqui',
    settingsTitle: 'Ajustes',
    notifications: 'Notificaciones',
    storyReminders: 'Recordatorios de historias',
    language: 'Idioma',
    defaultAgeGroup: 'Grupo de Edad',
    manageSubscription: 'Gestionar Suscripcion',
    restorePurchases: 'Restaurar Compras',
    helpCenter: 'Centro de Ayuda',
    contactUs: 'Contactanos',
    rateStoryPal: 'Califica StoryPal',
    privacyPolicy: 'Politica de Privacidad',
    signOut: 'Cerrar Sesion',
    general: 'General',
    subscription: 'Suscripcion',
    support: 'Soporte',
    account: 'Cuenta',
    ageTip: '\u00A1Las edades mas pequenas obtienen historias mas simples con imagenes mas grandes. Las edades mayores obtienen aventuras mas largas con detalles mas ricos!',
    pages: 'paginas',
    wordsPerPage: 'palabras/pag',
  },
  ar: {
    home: '\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629',
    create: '\u0625\u0646\u0634\u0627\u0621',
    library: '\u0627\u0644\u0645\u0643\u062A\u0628\u0629',
    settings: '\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A',
    greeting: '\u0645\u0631\u062D\u0628\u0627!',
    homeTitle: '\u0623\u064A \u0642\u0635\u0629 \u0633\u0646\u0643\u062A\u0628\n\u0627\u0644\u064A\u0648\u0645\u061F',
    createNewStory: '\u0625\u0646\u0634\u0627\u0621 \u0642\u0635\u0629 \u062C\u062F\u064A\u062F\u0629',
    ctaSubtitle: '\u0627\u062E\u062A\u0631 \u0645\u0648\u0636\u0648\u0639\u0627\u064B \u0648\u0634\u062E\u0635\u064A\u0629 \u0648\u062F\u0639 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u064A\u0635\u0646\u0639 \u0627\u0644\u0633\u062D\u0631!',
    start: '\u0627\u0628\u062F\u0623',
    popularThemes: '\u0645\u0648\u0627\u0636\u064A\u0639 \u0634\u0627\u0626\u0639\u0629',
    meetCharacters: '\u062A\u0639\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0634\u062E\u0635\u064A\u0627\u062A',
    freeStoriesToday: '\u0642\u0635\u0635 \u0645\u062C\u0627\u0646\u064A\u0629\n\u0627\u0644\u064A\u0648\u0645',
    themesAvailable: '\u0645\u0648\u0627\u0636\u064A\u0639\n\u0645\u062A\u0627\u062D\u0629',
    charactersToChoose: '\u0634\u062E\u0635\u064A\u0627\u062A\n\u0644\u0644\u0627\u062E\u062A\u064A\u0627\u0631',
    createStory: '\u0625\u0646\u0634\u0627\u0621 \u0642\u0635\u0629',
    chooseAgeGroup: '\u0627\u062E\u062A\u0631 \u0627\u0644\u0641\u0626\u0629 \u0627\u0644\u0639\u0645\u0631\u064A\u0629 \u0644\u0642\u0635\u062A\u0643',
    pickTheme: '\u0627\u062E\u062A\u0631 \u0645\u0648\u0636\u0648\u0639',
    themeSubtitle: '\u0623\u064A\u0646 \u064A\u062C\u0628 \u0623\u0646 \u062A\u062C\u0631\u064A \u0645\u063A\u0627\u0645\u0631\u062A\u0643\u061F',
    chooseCharacter: '\u0627\u062E\u062A\u0631 \u0634\u062E\u0635\u064A\u0629',
    characterSubtitle: '\u0645\u0646 \u0633\u064A\u0643\u0648\u0646 \u0628\u0637\u0644 \u0642\u0635\u062A\u0643\u061F',
    selectLanguage: '\u0627\u062E\u062A\u0631 \u0627\u0644\u0644\u063A\u0629',
    languageSubtitle: '\u0628\u0623\u064A \u0644\u063A\u0629 \u064A\u062C\u0628 \u0623\u0646 \u062A\u0643\u0648\u0646 \u0642\u0635\u062A\u0643\u061F',
    back: '\u0631\u062C\u0648\u0639',
    personalize: '\u062A\u062E\u0635\u064A\u0635',
    personalizeSubtitle: '\u0636\u0639 \u0637\u0641\u0644\u0643 \u0641\u064A \u0627\u0644\u0642\u0635\u0629!',
    childName: '\u0627\u0633\u0645 \u0627\u0644\u0637\u0641\u0644',
    childNamePlaceholder: '\u0623\u062F\u062E\u0644 \u0627\u0644\u0627\u0633\u0645...',
    gender: '\u0627\u0644\u062C\u0646\u0633',
    genderGirl: '\u0628\u0646\u062A',
    genderBoy: '\u0648\u0644\u062F',
    genderPreferNot: '\u062A\u062E\u0637\u064A',
    hairColor: '\u0644\u0648\u0646 \u0627\u0644\u0634\u0639\u0631',
    skinTone: '\u0644\u0648\u0646 \u0627\u0644\u0628\u0634\u0631\u0629',
    glasses: '\u0646\u0638\u0627\u0631\u0627\u062A',
    glassesYes: '\u0646\u0639\u0645',
    glassesNo: '\u0644\u0627',
    continueBtn: '\u0645\u062A\u0627\u0628\u0639\u0629',
    premiumFeature: '\u0645\u064A\u0632\u0629 \u0645\u0645\u064A\u0632\u0629',
    unlockPersonalization: '\u0627\u0641\u062A\u062D \u0627\u0644\u062A\u062E\u0635\u064A\u0635 \u2014 \u0627\u062C\u0639\u0644 \u0637\u0641\u0644\u0643 \u0627\u0644\u0628\u0637\u0644!',
    writingStory: '\u062C\u0627\u0631\u064A \u0643\u062A\u0627\u0628\u0629 \u0642\u0635\u062A\u0643...',
    paintingCover: '\u062C\u0627\u0631\u064A \u0631\u0633\u0645 \u0627\u0644\u063A\u0644\u0627\u0641...',
    drawingPages: '\u062C\u0627\u0631\u064A \u0631\u0633\u0645 \u0627\u0644\u0635\u0641\u062D\u0627\u062A...',
    storyComplete: '\u0627\u0643\u062A\u0645\u0644\u062A \u0627\u0644\u0642\u0635\u0629!',
    oops: '\u0639\u0630\u0631\u0627!',
    tryAgain: '\u062D\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649',
    goBack: '\u0631\u062C\u0648\u0639',
    aStoryPalAdventure: '\u0645\u063A\u0627\u0645\u0631\u0629 StoryPal',
    done: '\u062A\u0645',
    play: '\u062A\u0634\u063A\u064A\u0644',
    pause: '\u0625\u064A\u0642\u0627\u0641',
    bedtimeMode: '\u0648\u0636\u0639 \u0627\u0644\u0646\u0648\u0645',
    sweetDreams: '\u0623\u062D\u0644\u0627\u0645 \u0633\u0639\u064A\u062F\u0629...',
    autoPlay: '\u062A\u0634\u063A\u064A\u0644 \u062A\u0644\u0642\u0627\u0626\u064A',
    speed: '\u0627\u0644\u0633\u0631\u0639\u0629',
    slow: '\u0628\u0637\u064A\u0621',
    normal: '\u0639\u0627\u062F\u064A',
    fast: '\u0633\u0631\u064A\u0639',
    myLibrary: '\u0645\u0643\u062A\u0628\u062A\u064A',
    storiesCreated: '\u0642\u0635\u0635 \u0645\u0646\u0634\u0623\u0629',
    noStoriesYet: '\u0644\u0627 \u062A\u0648\u062C\u062F \u0642\u0635\u0635 \u0628\u0639\u062F!',
    noStoriesText: '\u0623\u0646\u0634\u0626 \u0623\u0648\u0644 \u0642\u0635\u0629 \u0633\u062D\u0631\u064A\u0629 \u0648\u0633\u062A\u0638\u0647\u0631 \u0647\u0646\u0627',
    settingsTitle: '\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A',
    notifications: '\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A',
    storyReminders: '\u062A\u0630\u0643\u064A\u0631\u0627\u062A \u0627\u0644\u0642\u0635\u0635',
    language: '\u0627\u0644\u0644\u063A\u0629',
    defaultAgeGroup: '\u0627\u0644\u0641\u0626\u0629 \u0627\u0644\u0639\u0645\u0631\u064A\u0629',
    manageSubscription: '\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643',
    restorePurchases: '\u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0627\u0644\u0645\u0634\u062A\u0631\u064A\u0627\u062A',
    helpCenter: '\u0645\u0631\u0643\u0632 \u0627\u0644\u0645\u0633\u0627\u0639\u062F\u0629',
    contactUs: '\u0627\u062A\u0635\u0644 \u0628\u0646\u0627',
    rateStoryPal: '\u0642\u064A\u0645 StoryPal',
    privacyPolicy: '\u0633\u064A\u0627\u0633\u0629 \u0627\u0644\u062E\u0635\u0648\u0635\u064A\u0629',
    signOut: '\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C',
    general: '\u0639\u0627\u0645',
    subscription: '\u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643',
    support: '\u0627\u0644\u062F\u0639\u0645',
    account: '\u0627\u0644\u062D\u0633\u0627\u0628',
    ageTip: '\u0627\u0644\u0623\u0639\u0645\u0627\u0631 \u0627\u0644\u0623\u0635\u063A\u0631 \u062A\u062D\u0635\u0644 \u0639\u0644\u0649 \u0642\u0635\u0635 \u0623\u0628\u0633\u0637 \u0645\u0639 \u0635\u0648\u0631 \u0623\u0643\u0628\u0631. \u0627\u0644\u0623\u0639\u0645\u0627\u0631 \u0627\u0644\u0623\u0643\u0628\u0631 \u062A\u062D\u0635\u0644 \u0639\u0644\u0649 \u0645\u063A\u0627\u0645\u0631\u0627\u062A \u0623\u0637\u0648\u0644!',
    pages: '\u0635\u0641\u062D\u0627\u062A',
    wordsPerPage: '\u0643\u0644\u0645\u0629/\u0635\u0641\u062D\u0629',
  },
  ja: {
    home: '\u30DB\u30FC\u30E0',
    create: '\u4F5C\u6210',
    library: '\u30E9\u30A4\u30D6\u30E9\u30EA',
    settings: '\u8A2D\u5B9A',
    greeting: '\u3053\u3093\u306B\u3061\u306F\uFF01',
    homeTitle: '\u4ECA\u65E5\u306F\u3069\u3093\u306A\u304A\u8A71\u3092\n\u4F5C\u308A\u307E\u3057\u3087\u3046\uFF1F',
    createNewStory: '\u65B0\u3057\u3044\u304A\u8A71\u3092\u4F5C\u308B',
    ctaSubtitle: '\u30C6\u30FC\u30DE\u3092\u9078\u3073\u3001\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC\u3092\u9078\u3093\u3067\u3001AI\u306B\u9B54\u6CD5\u3092\u304B\u3051\u3066\u3082\u3089\u304A\u3046\uFF01',
    start: '\u30B9\u30BF\u30FC\u30C8',
    popularThemes: '\u4EBA\u6C17\u30C6\u30FC\u30DE',
    meetCharacters: '\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC\u7D39\u4ECB',
    freeStoriesToday: '\u4ECA\u65E5\u306E\n\u7121\u6599\u304A\u8A71',
    themesAvailable: '\u30C6\u30FC\u30DE\n\u6570',
    charactersToChoose: '\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC\n\u6570',
    createStory: '\u304A\u8A71\u3092\u4F5C\u308B',
    chooseAgeGroup: '\u307E\u305A\u3001\u304A\u8A71\u306E\u5BFE\u8C61\u5E74\u9F62\u3092\u9078\u3093\u3067\u304F\u3060\u3055\u3044',
    pickTheme: '\u30C6\u30FC\u30DE\u3092\u9078\u3076',
    themeSubtitle: '\u5192\u967A\u306E\u821E\u53F0\u306F\u3069\u3053\uFF1F',
    chooseCharacter: '\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC\u3092\u9078\u3076',
    characterSubtitle: '\u304A\u8A71\u306E\u4E3B\u4EBA\u516C\u306F\u8AB0\uFF1F',
    selectLanguage: '\u8A00\u8A9E\u3092\u9078\u3076',
    languageSubtitle: '\u304A\u8A71\u306F\u4F55\u8A9E\u3067\u4F5C\u308A\u307E\u3059\u304B\uFF1F',
    back: '\u623B\u308B',
    personalize: '\u30AB\u30B9\u30BF\u30DE\u30A4\u30BA',
    personalizeSubtitle: '\u304A\u5B50\u3055\u307E\u3092\u304A\u8A71\u306B\u767B\u5834\u3055\u305B\u3088\u3046\uFF01',
    childName: '\u304A\u5B50\u3055\u307E\u306E\u540D\u524D',
    childNamePlaceholder: '\u540D\u524D\u3092\u5165\u529B...',
    gender: '\u6027\u5225',
    genderGirl: '\u5973\u306E\u5B50',
    genderBoy: '\u7537\u306E\u5B50',
    genderPreferNot: '\u30B9\u30AD\u30C3\u30D7',
    hairColor: '\u9AEA\u306E\u8272',
    skinTone: '\u808C\u306E\u8272',
    glasses: '\u30E1\u30AC\u30CD',
    glassesYes: '\u3042\u308A',
    glassesNo: '\u306A\u3057',
    continueBtn: '\u7D9A\u3051\u308B',
    premiumFeature: '\u30D7\u30EC\u30DF\u30A2\u30E0\u6A5F\u80FD',
    unlockPersonalization: '\u30AB\u30B9\u30BF\u30DE\u30A4\u30BA\u3092\u89E3\u9664 \u2014 \u304A\u5B50\u3055\u307E\u3092\u30D2\u30FC\u30ED\u30FC\u306B\uFF01',
    writingStory: '\u304A\u8A71\u3092\u66F8\u3044\u3066\u3044\u307E\u3059...',
    paintingCover: '\u8868\u7D19\u3092\u63CF\u3044\u3066\u3044\u307E\u3059...',
    drawingPages: '\u30DA\u30FC\u30B8\u306E\u7D75\u3092\u63CF\u3044\u3066\u3044\u307E\u3059...',
    storyComplete: '\u304A\u8A71\u304C\u5B8C\u6210\u3057\u307E\u3057\u305F\uFF01',
    oops: '\u304A\u3063\u3068\uFF01',
    tryAgain: '\u3082\u3046\u4E00\u5EA6',
    goBack: '\u623B\u308B',
    aStoryPalAdventure: 'StoryPal\u306E\u5192\u967A',
    done: '\u5B8C\u4E86',
    play: '\u518D\u751F',
    pause: '\u4E00\u6642\u505C\u6B62',
    bedtimeMode: '\u304A\u3084\u3059\u307F\u30E2\u30FC\u30C9',
    sweetDreams: '\u3044\u3044\u5922\u3092...',
    autoPlay: '\u81EA\u52D5\u518D\u751F',
    speed: '\u901F\u5EA6',
    slow: '\u9045\u3044',
    normal: '\u666E\u901A',
    fast: '\u901F\u3044',
    myLibrary: '\u30DE\u30A4\u30E9\u30A4\u30D6\u30E9\u30EA',
    storiesCreated: '\u4F5C\u6210\u3055\u308C\u305F\u304A\u8A71',
    noStoriesYet: '\u307E\u3060\u304A\u8A71\u304C\u3042\u308A\u307E\u305B\u3093\uFF01',
    noStoriesText: '\u6700\u521D\u306E\u9B54\u6CD5\u306E\u304A\u8A71\u3092\u4F5C\u308B\u3068\u3053\u3053\u306B\u8868\u793A\u3055\u308C\u307E\u3059',
    settingsTitle: '\u8A2D\u5B9A',
    notifications: '\u901A\u77E5',
    storyReminders: '\u304A\u8A71\u30EA\u30DE\u30A4\u30F3\u30C0\u30FC',
    language: '\u8A00\u8A9E',
    defaultAgeGroup: '\u30C7\u30D5\u30A9\u30EB\u30C8\u5E74\u9F62',
    manageSubscription: '\u30B5\u30D6\u30B9\u30AF\u30EA\u30D7\u30B7\u30E7\u30F3\u7BA1\u7406',
    restorePurchases: '\u8CFC\u5165\u3092\u5FA9\u5143',
    helpCenter: '\u30D8\u30EB\u30D7\u30BB\u30F3\u30BF\u30FC',
    contactUs: '\u304A\u554F\u3044\u5408\u308F\u305B',
    rateStoryPal: 'StoryPal\u3092\u8A55\u4FA1',
    privacyPolicy: '\u30D7\u30E9\u30A4\u30D0\u30B7\u30FC\u30DD\u30EA\u30B7\u30FC',
    signOut: '\u30B5\u30A4\u30F3\u30A2\u30A6\u30C8',
    general: '\u4E00\u822C',
    subscription: '\u30B5\u30D6\u30B9\u30AF\u30EA\u30D7\u30B7\u30E7\u30F3',
    support: '\u30B5\u30DD\u30FC\u30C8',
    account: '\u30A2\u30AB\u30A6\u30F3\u30C8',
    ageTip: '\u5C0F\u3055\u3044\u5B50\u306F\u30B7\u30F3\u30D7\u30EB\u306A\u304A\u8A71\u3068\u5927\u304D\u306A\u7D75\u3002\u5927\u304D\u3044\u5B50\u306F\u9577\u3044\u5192\u967A\u3068\u8C4A\u304B\u306A\u30C7\u30A3\u30C6\u30FC\u30EB\uFF01',
    pages: '\u30DA\u30FC\u30B8',
    wordsPerPage: '\u5358\u8A9E/\u30DA\u30FC\u30B8',
  },
};

export function t(key: keyof TranslationKeys, languageCode: string = 'en'): string {
  const lang = translations[languageCode] ?? translations.en;
  return lang[key] ?? translations.en[key] ?? key;
}

export function getAvailableTranslations(): string[] {
  return Object.keys(translations);
}
