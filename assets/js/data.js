/* ============================================================
   SAVVA · ساڤا — весь контент сайта.
   Правьте тексты, цены и контакты здесь — код трогать не нужно.
   Каждый текст — пара { en, ar }.
   ============================================================ */
window.SAVVA = {

  /* ---------- контакты ---------- */
  contacts: {
    phone: '+966564370303',
    phoneShown: '056 437 0303',
    whatsapp: '966564370303',
    instagram: 'https://www.instagram.com/savva_cafe/',
    instagramDm: 'https://ig.me/m/savva_cafe',
    instagramChannel: 'https://www.instagram.com/channel/Aba0_CLWL1eCe5pA/',
    tiktok: 'https://www.tiktok.com/@savva_cafe',
    snapchat: 'https://www.snapchat.com/add/savva_cafe',
    keeta: 'https://url.mykeeta.com/MoOK6Kbz',
    hungerstation: 'https://hungerstation.go.link/?c=SA&s=c&v=88194&so=mls&adj_t=1sdhhuza_1spi9ypp',
    menuPdf: 'https://drive.google.com/file/d/1hsfYMPRwrbNqr2L-KM_wjPJQp0wbSzGy/view?usp=sharing',
    maps: 'https://maps.app.goo.gl/KLpbbtp5SRyDRMia8',
    directions: 'https://www.google.com/maps/dir/?api=1&destination=24.4926931,39.5823565',
    /* «Поделиться → Встроить карту» в Google Maps; {lang} подставляется сам */
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1800!2d39.5823565!3d24.4926931!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15bdbf7c00dd71e3%3A0x8c75251d63b13c1!2z2LPYp9mB2Kcgc2F2dmE!5e0!3m2!1s{lang}!2ssa!4v1727450000000',
    lat: 24.4926931, lng: 39.5823565,
    rating: 4.7, reviews: 736
  },

  /* ---------- часы (время Медины). 0 = воскресенье ... 6 = суббота ---------- */
  hours: [
    { day: 0, open: '06:30', close: '02:00' },
    { day: 1, open: '06:30', close: '02:00' },
    { day: 2, open: '06:30', close: '02:00' },
    { day: 3, open: '06:30', close: '02:00' },
    { day: 4, open: '06:30', close: '02:00' },
    { day: 5, open: '13:00', close: '02:00' },
    { day: 6, open: '06:30', close: '02:00' }
  ],

  /* ---------- меню (из PDF кафе, QR-код на столиках) ----------
     cal — калории; hue — цвет напитка для анимации стакана */
  menu: [
    { id: 'hot', title: { en: 'Hot drinks', ar: 'المشروبات الحارة' }, items: [
      { id: 'espresso',   en: 'Espresso',                 ar: 'إسبريسو',        price: 11, cal: 2,   hue: '#3b2417' },
      { id: 'americano',  en: 'Americano',                ar: 'أمريكانو',        price: 12, cal: 2,   hue: '#3f2a1c' },
      { id: 'cortado',    en: 'Cortado',                  ar: 'كورتادو',         price: 14, cal: 50,  hue: '#8a5a3a' },
      { id: 'macchiato',  en: 'Macchiato',                ar: 'ميكاتو',          price: 13, cal: 13,  hue: '#6d4329' },
      { id: 'flatwhite',  en: 'Flat White',               ar: 'فلات وايت',       price: 15, cal: 50,  hue: '#b48660' },
      { id: 'latte',      en: 'Latte',                    ar: 'لاتيه',           price: 16, cal: 75,  hue: '#c79d77' },
      { id: 'cappuccino', en: 'Cappuccino',               ar: 'كابتشينو',        price: 16, cal: 60,  hue: '#b88c63' },
      { id: 'spanish',    en: 'Spanish Latte',            ar: 'سبانش لاتيه',     price: 18, cal: 178, hue: '#c9a07a', star: true },
      { id: 'matcha',     en: 'Matcha Latte',             ar: 'ماتشا لاتيه',     price: 16, cal: 75,  hue: '#9cad6a' },
      { id: 'whitemocha', en: 'White Mocha',              ar: 'وايت موكا',       price: 16, cal: 230, hue: '#d8bb98' },
      { id: 'hotchoc',    en: 'Hot Chocolate',            ar: 'هوت شوكليت',      price: 15, cal: 237, hue: '#5a3421' },
      { id: 'tea',        en: 'English Tea',              ar: 'شاي انجليزي',     price: 6,  cal: 2,   hue: '#8e3f1d' },
      { id: 'turkish',    en: 'Turkish Coffee',           ar: 'تركي سادة',       price: 11, cal: 50,  hue: '#2e1b10' },
      { id: 'turkishmilk',en: 'Turkish Coffee with Milk', ar: 'تركي حليب',       price: 13, cal: 50,  hue: '#7a5236' },
      { id: 'cotd',       en: 'Coffee of the Day · hot / iced', ar: 'قهوة اليوم · حار / بارد', price: '10–13', hue: '#4a2e1c',
        note: { en: 'Ethiopian or Colombian — ask the barista', ar: 'إثيوبي أو كولومبي — اسأل الباريستا' } },
      { id: 'v60',        en: 'Ice Drip · V60',           ar: 'قهوة مقطرة · V60', price: 18, hue: '#6b3b1f', star: true }
    ]},
    { id: 'cold', title: { en: 'Cold drinks', ar: 'المشروبات الباردة' }, items: [
      { id: 'icedamericano', en: 'Iced Americano',            ar: 'ايس أمريكانو',            price: 15, cal: 2,   hue: '#3a2416', iced: true },
      { id: 'alfredo',       en: 'Alfredo',                   ar: 'ألفريدو',                 price: 14, cal: 100, hue: '#a77a55', iced: true },
      { id: 'icedlatte',     en: 'Iced Latte',                ar: 'ايس لاتيه',               price: 17, cal: 100, hue: '#c49a73', iced: true },
      { id: 'icedspanish',   en: 'Iced Spanish Latte',        ar: 'ايس سبانيش لاتيه',        price: 19, cal: 230, hue: '#cda27a', iced: true, star: true },
      { id: 'icedmatcha',    en: 'Iced Matcha Latte',         ar: 'ايس ماتشا لاتيه',         price: 17, cal: 130, hue: '#a3b774', iced: true },
      { id: 'icedmatchasp',  en: 'Iced Matcha Spanish Latte', ar: 'ايس ماتشا سبانيش لاتيه',  price: 19, cal: 230, hue: '#b3c285', iced: true },
      { id: 'savvamatcha',   en: 'Savva Matcha',              ar: 'سافا ماتشا',              price: 22, cal: 2,   hue: '#6f8f3a', iced: true, star: true },
      { id: 'matchaberry',   en: 'Matcha Berry',              ar: 'ماتشا بيري',              price: 24, cal: 230, hue: '#b25a6a', iced: true },
      { id: 'icetea',        en: 'Ice Tea Savva',             ar: 'ايس تي سافا',             price: 17, cal: 189, hue: '#b8612a', iced: true },
      { id: 'hibiscus',      en: 'Ice Hibiscus Savva',        ar: 'ايس كركديه سافا',         price: 17, cal: 180, hue: '#8e1330', iced: true, star: true },
      { id: 'slush',         en: 'Hibiscus Slush Savva',      ar: 'سلاش كركديه سافا',        price: 17, cal: 180, hue: '#b3243f', iced: true },
      { id: 'shaken',        en: 'Ice Shaken',                ar: 'ايس شيكن',                price: 20, cal: 231, hue: '#9b6b45', iced: true },
      { id: 'icedwhitemocha',en: 'Iced White Mocha',          ar: 'ايس وايت موكا',           price: 19, cal: 230, hue: '#d9bd9a', iced: true },
      { id: 'icedchoc',      en: 'Iced Chocolate',            ar: 'ايس شوكلت',               price: 17, cal: 230, hue: '#5b3522', iced: true },
      { id: 'melon',         en: 'Savva Melon',               ar: 'شمام سافا',               price: 16, cal: 50,  hue: '#e2a95b', iced: true }
    ]},
    { id: 'sweet', title: { en: 'Desserts', ar: 'الحلى' }, items: [
      { id: 'madini',     en: 'Madini Cookies',       ar: 'مديني كوكيز',     price: 12, cal: 170, star: true,
        note: { en: 'Cookie meets dates, a flavour of cardamom and nigella seeds on top', ar: 'مزيج من الكوكيز والتمر بنكهة الهيل وحبة البركة التي تزيّنه' } },
      { id: 'danish',     en: 'Cinnamon Danish',      ar: 'دانيش سينابون',   price: 19, cal: 170 },
      { id: 'marble',     en: 'Marble Cake',          ar: 'ماربل كيك',       price: 11, cal: 170 },
      { id: 'crunchy',    en: 'Crunchy Chocolate',    ar: 'كرانشي شوكلت',    price: 8,  cal: 170 },
      { id: 'cheesecake', en: 'Blueberry Cheesecake', ar: 'تشيز كيك بلوبيري', price: 27, cal: 170, star: true },
      { id: 'pecan',      en: 'Pecan Cake',           ar: 'كيكة البيكان',     price: 21, cal: 170 },
      { id: 'chococake',  en: 'Chocolate Cake',       ar: 'كيكة شوكلت',      price: 18, cal: 170 }
    ]},
    { id: 'breakfast', title: { en: 'Breakfast', ar: 'الفطور' }, items: [
      { id: 'turkey',   en: 'Turkey Sandwich',   ar: 'ساندوتش تركي', price: 19, cal: 300 },
      { id: 'halloumi', en: 'Halloumi Sandwich', ar: 'ساندوتش حلوم', price: 18, cal: 300 }
    ]}
  ],

  /* ---------- «Подбери напиток»: temp × base × mood → id из меню ---------- */
  finder: {
    hot: {
      coffee: { strong: 'cortado',       smooth: 'flatwhite',  sweet: 'spanish' },
      matcha: { strong: 'matcha',        smooth: 'matcha',     sweet: 'whitemocha' },
      other:  { strong: 'turkish',       smooth: 'tea',        sweet: 'hotchoc' }
    },
    iced: {
      coffee: { strong: 'icedamericano', smooth: 'icedlatte',  sweet: 'icedspanish' },
      matcha: { strong: 'savvamatcha',   smooth: 'icedmatcha', sweet: 'matchaberry' },
      other:  { strong: 'hibiscus',      smooth: 'icetea',     sweet: 'slush' }
    },
    pair: { coffee: 'madini', matcha: 'cheesecake', other: 'marble' }
  },

  /* ---------- «Один день в Savva»: время → что взять ---------- */
  day: [
    { t: '06:30', item: 'espresso',     with: 'madini',
      en: 'Doors open. First espresso of the city.',          ar: 'نفتح أبوابنا. أول إسبريسو في المدينة.' },
    { t: '09:00', item: 'flatwhite',    with: 'halloumi',
      en: 'Breakfast, slowly. Halloumi and a flat white.',     ar: 'فطور على مهل. حلوم وفلات وايت.' },
    { t: '12:30', item: 'savvamatcha',
      en: 'Midday heat. Something green and ice-cold.',        ar: 'حرّ الظهيرة. شيء أخضر وبارد جداً.' },
    { t: '15:30', item: 'icedspanish',  with: 'pecan',
      en: 'The afternoon slump, solved.',                      ar: 'نعاس العصر؟ لدينا الحل.' },
    { t: '18:30', item: 'slush',
      en: 'Sunset over Madinah. Hibiscus on the terrace.',     ar: 'غروب المدينة. كركديه في الجلسة الخارجية.' },
    { t: '21:00', item: 'v60',          with: 'cheesecake',
      en: 'Friends, a slow V60 and cheesecake to share.',      ar: 'الأصحاب، V60 على مهل وتشيز كيك للمشاركة.' },
    { t: '00:00', item: 'turkishmilk',
      en: 'Past midnight — the quiet hours.',                  ar: 'بعد منتصف الليل — ساعات الهدوء.' },
    { t: '02:00', item: null,
      en: 'We close. See you at 6:30.',                        ar: 'نغلق الآن. نراكم الساعة ٦:٣٠.' }
  ],

  /* ---------- отзывы Google (публичные, сокращены) ---------- */
  reviewTags: [
    { en: 'quietness',       ar: 'الهدوء',            n: 75 },
    { en: 'cheesecake',      ar: 'تشيز كيك',          n: 36 },
    { en: 'Madini cookies',  ar: 'مديني كوكيز',       n: 15 },
    { en: 'outdoor seating', ar: 'جلسات خارجية',      n: 12 }
  ],
  reviews: [
    { name: 'Lujain J', meta: { en: 'Local Guide', ar: 'مرشدة محلية' },
      en: '“The coffee of the day iced was phenomenal — not too bitter nor sour. They let you choose Ethiopian or Colombian beans.”',
      ar: '«قهوة اليوم الباردة كانت مذهلة — لا مُرّة ولا حامضة. ويخيّرونك بين البن الإثيوبي والكولومبي.»' },
    { name: 'Mani', meta: { en: 'Google review', ar: 'تقييم Google' },
      en: '“A cozy and beautifully designed café. The coffee was well balanced — neither too sweet nor too bitter.”',
      ar: '«مقهى دافئ ومصمم بجمال. القهوة متوازنة — لا حلوة زيادة ولا مُرّة.»' },
    { name: 'Family Doctor', meta: { en: 'Local Guide · 240 reviews', ar: 'مرشد محلي · ٢٤٠ تقييماً' },
      en: '“Indoor and outdoor seats, comfy chairs, amazing decoration, great service — and the sweets are delicious.”',
      ar: '«جلسات داخلية وخارجية، كراسٍ مريحة، ديكور رائع، خدمة ممتازة — والحلى لذيذة.»' }
  ],

  /* ---------- галерея: фото из Google Maps и Instagram кафе ---------- */
  gallery: [
    { src: 'assets/img/photos/g06.webp', shape: 'wide', pos: '24% 50%', en: 'Evening on the walkway',  ar: 'مساء على الممشى' },
    { src: 'assets/img/photos/g02.webp', shape: 'arch', en: 'The bar',                 ar: 'البار' },
    { src: 'assets/img/photos/g05.webp', shape: 'arch', en: 'Matcha & cheesecake',     ar: 'ماتشا وتشيز كيك' },
    { video: 'assets/video/tray-540.mp4', poster: 'assets/video/tray-poster.webp', shape: 'bean', en: 'Served on wood', ar: 'تُقدَّم على الخشب' },
    { src: 'assets/img/photos/g08.webp', shape: 'wide', en: 'The lounge',              ar: 'الجلسة' },
    { src: 'assets/img/photos/g04.webp', shape: 'arch', en: 'Coffee for two',          ar: 'قهوة لاثنين' },
    { src: 'assets/img/photos/g09.webp', shape: 'arch', en: 'Three iced, please',      ar: 'ثلاثة باردة من فضلك' },
    { src: 'assets/img/photos/g00.webp', shape: 'arch', en: 'Our door in Bir Uthman',  ar: 'بابنا في بئر عثمان' },
    { src: 'assets/img/photos/g01.webp', shape: 'arch', en: 'Roses on the counter',    ar: 'ورد على الكاونتر' }
  ],

  /* ---------- тексты интерфейса ---------- */
  t: {
    en: {
      'meta.title': 'Savva · ساڤا — Specialty coffee in Madinah',
      'nav.menu': 'Menu', 'nav.finder': 'Your drink', 'nav.day': 'A day in Savva', 'nav.latte': 'Latte art', 'nav.space': 'The space', 'nav.visit': 'Visit',
      'lang': 'ع', 'lang.label': 'التبديل إلى العربية',
      'skip': 'Skip',
      'intro.tag': 'Specialty coffee · Madinah',
      'hero.h1': 'Savva — specialty coffee in Madinah',
      'hero.kicker': 'Specialty coffee · Bir Uthman, Madinah',
      'hero.scroll': 'Scroll into the cup',
      'hero.motto': 'A day in Savva is what you need <em>to be savva.</em>',
      'hero.cta.menu': 'See the menu', 'hero.cta.go': 'Get directions',
      'status.open': 'Open now', 'status.closed': 'Closed now', 'status.until': 'until', 'status.opens': 'opens',
      'status.today': 'today', 'status.tomorrow': 'tomorrow',
      'rating': 'on Google', 'reviews': 'reviews',
      'about.k': 'Hello from Savva',
      'about.h': 'A small café with a <em>big</em> ritual.',
      'about.p': 'Beans from Ethiopia and Colombia, pulled by baristas who actually care. Madini cookies with dates and cardamom. Arched windows, quiet corners and a terrace on the walkway. Open from 6:30 in the morning till 2 at night — so whatever your day looks like, there is a Savva moment in it.',
      'about.n1': 'hours a day', 'about.n2': 'Google rating', 'about.n3': 'reviews', 'about.n4': 'items on the menu', 'about.cookie': 'Madini cookies',
      'menu.k': 'Menu', 'menu.h': 'Printed on the cube. <em>Brewed on the bar.</em>',
      'menu.p': 'The same menu as the QR cube on our tables. Prices in Saudi riyals, calories next to every drink.',
      'menu.cal': 'cal', 'menu.pdf': 'Open PDF menu', 'menu.star': 'Signature',
      'menu.order': 'Order on', 'menu.or': 'or',
      'finder.k': 'Not sure what to order?', 'finder.h': 'Three taps to <em>your drink.</em>',
      'finder.q1': 'Hot or iced?', 'finder.q2': 'What are you in the mood for?', 'finder.q3': 'How do you like it?',
      'finder.hot': 'Hot', 'finder.iced': 'Iced', 'finder.coffee': 'Coffee', 'finder.matcha': 'Matcha', 'finder.other': 'Something else',
      'finder.strong': 'Strong', 'finder.smooth': 'Smooth', 'finder.sweet': 'Sweet',
      'finder.res': 'Your Savva is', 'finder.pair': 'Pair it with', 'finder.again': 'Try again', 'finder.wa': 'Ask on WhatsApp',
      'finder.waText': 'Hi Savva! I would like: ',
      'day.k': 'Our motto, literally', 'day.h': 'A day <em>in Savva.</em>',
      'day.p': 'Drag the sun across our twenty hours. The dot shows the time in Madinah right now.',
      'day.now': 'Now in Madinah', 'day.with': 'with',
      'latte.k': 'Barista for a minute', 'latte.h': 'Draw your <em>latte art.</em>',
      'latte.p': 'Pour milk with your finger or mouse. Or let our barista pour a heart, a tulip or a rosetta.',
      'latte.heart': 'Heart', 'latte.tulip': 'Tulip', 'latte.rosetta': 'Rosetta', 'latte.stir': 'Stir', 'latte.save': 'Save',
      'latte.hint': 'Draw here',
      'space.k': 'The space', 'space.h': 'Arches, wood and <em>quiet corners.</em>',
      'space.p': 'Every photo frame here borrows a shape from the café itself: the arched windows of the façade and the bean-shaped niche by the door.',
      'rev.k': 'What guests say', 'rev.h': '<em>4.7</em> from 736 reviews.', 'rev.tags': 'People mention',
      'rev.all': 'All reviews on Google',
      'visit.k': 'Visit us', 'visit.h': 'Zubairah Al Roumiah, <em>Bir Uthman.</em>',
      'visit.addr': 'Zubairah Al Roumiah, Bir Uthman, Madinah 42331',
      'visit.note': 'Bir Uthman takes its name from the Well of Rumah, which Uthman ibn Affan ؓ bought and gave to the people of Madinah.',
      'visit.hours': 'Opening hours',
      'visit.route': 'Route', 'visit.maps': 'Open in Google Maps',
      'visit.write': 'Write to us', 'visit.order': 'Order delivery', 'visit.follow': 'Follow',
      'c.wa': 'WhatsApp', 'c.call': 'Call', 'c.igdm': 'Instagram Direct', 'c.ig': 'Instagram', 'c.tt': 'TikTok', 'c.snap': 'Snapchat', 'c.ch': 'Savva community', 'c.keeta': 'Keeta', 'c.hs': 'HungerStation',
      'wa.text': 'Hi Savva! ',
      'days': ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
      'foot.motto': 'A day in Savva is what you need to be savva.',
      'foot.made': 'Site by',
      'toast.bean': 'You found the beans ☕',
      'away': '☕ Your coffee is getting cold…',
      'floating.wa': 'Chat on WhatsApp'
    },
    ar: {
      'meta.title': 'ساڤا · Savva — قهوة مختصة في المدينة المنورة',
      'nav.menu': 'المنيو', 'nav.finder': 'مشروبك', 'nav.day': 'يوم في ساڤا', 'nav.latte': 'فن اللاتيه', 'nav.space': 'المكان', 'nav.visit': 'زورونا',
      'lang': 'EN', 'lang.label': 'Switch to English',
      'skip': 'تخطَّ',
      'intro.tag': 'قهوة مختصة · المدينة المنورة',
      'hero.h1': 'ساڤا — قهوة مختصة في المدينة المنورة',
      'hero.kicker': 'قهوة مختصة · بئر عثمان، المدينة المنورة',
      'hero.scroll': 'مرّر إلى داخل الكوب',
      'hero.motto': 'يومٌ في ساڤا <em>هو كل ما تحتاجه.</em>',
      'hero.cta.menu': 'تصفّح المنيو', 'hero.cta.go': 'الاتجاهات',
      'status.open': 'مفتوح الآن', 'status.closed': 'مغلق الآن', 'status.until': 'حتى', 'status.opens': 'يفتح',
      'status.today': 'اليوم', 'status.tomorrow': 'غداً',
      'rating': 'على Google', 'reviews': 'تقييماً',
      'about.k': 'أهلاً من ساڤا',
      'about.h': 'مقهى صغير <em>وطقس كبير.</em>',
      'about.p': 'بنٌّ من إثيوبيا وكولومبيا يحضّره باريستا يهتم فعلاً. مديني كوكيز بالتمر والهيل. نوافذ مقوّسة وزوايا هادئة وجلسة خارجية على الممشى. نفتح من السادسة والنصف صباحاً حتى الثانية ليلاً — فمهما كان يومك، فيه لحظة ساڤا.',
      'about.n1': 'ساعة يومياً', 'about.n2': 'تقييم Google', 'about.n3': 'تقييماً', 'about.n4': 'صنفاً في المنيو', 'about.cookie': 'مديني كوكيز',
      'menu.k': 'المنيو', 'menu.h': 'مطبوع على المكعب. <em>ومحضَّر على البار.</em>',
      'menu.p': 'نفس المنيو الموجود في مكعب الـQR على طاولاتنا. الأسعار بالريال السعودي والسعرات بجانب كل مشروب.',
      'menu.cal': 'سعرة', 'menu.pdf': 'المنيو PDF', 'menu.star': 'مميز',
      'menu.order': 'اطلب عبر', 'menu.or': 'أو',
      'finder.k': 'محتار ماذا تطلب؟', 'finder.h': 'ثلاث نقرات <em>إلى مشروبك.</em>',
      'finder.q1': 'حار أم بارد؟', 'finder.q2': 'ما الذي تشتهيه؟', 'finder.q3': 'كيف تحبه؟',
      'finder.hot': 'حار', 'finder.iced': 'بارد', 'finder.coffee': 'قهوة', 'finder.matcha': 'ماتشا', 'finder.other': 'شيء آخر',
      'finder.strong': 'قوي', 'finder.smooth': 'ناعم', 'finder.sweet': 'حلو',
      'finder.res': 'مشروبك من ساڤا', 'finder.pair': 'ومعه', 'finder.again': 'جرّب مرة أخرى', 'finder.wa': 'اسأل عبر واتساب',
      'finder.waText': 'مرحباً ساڤا! أرغب في: ',
      'day.k': 'شعارنا حرفياً', 'day.h': 'يومٌ <em>في ساڤا.</em>',
      'day.p': 'اسحب الشمس عبر ساعاتنا العشرين. النقطة تشير إلى الوقت الآن في المدينة المنورة.',
      'day.now': 'الآن في المدينة', 'day.with': 'مع',
      'latte.k': 'باريستا لدقيقة', 'latte.h': 'ارسم <em>فن اللاتيه.</em>',
      'latte.p': 'اسكب الحليب بإصبعك أو بالماوس. أو دع الباريستا يرسم قلباً أو توليب أو روزيتا.',
      'latte.heart': 'قلب', 'latte.tulip': 'توليب', 'latte.rosetta': 'روزيتا', 'latte.stir': 'حرّك', 'latte.save': 'احفظ',
      'latte.hint': 'ارسم هنا',
      'space.k': 'المكان', 'space.h': 'أقواس وخشب <em>وزوايا هادئة.</em>',
      'space.p': 'كل إطار صورة هنا مستوحى من المقهى نفسه: نوافذ الواجهة المقوّسة والتجويف على شكل حبة البن بجانب الباب.',
      'rev.k': 'ماذا يقول ضيوفنا', 'rev.h': '<em>4.7</em> من 736 تقييماً.', 'rev.tags': 'يذكر الناس',
      'rev.all': 'كل التقييمات على Google',
      'visit.k': 'زورونا', 'visit.h': 'زبيرة الرومية، <em>بئر عثمان.</em>',
      'visit.addr': 'زبيرة الرومية، بئر عثمان، المدينة المنورة 42331',
      'visit.note': 'سُمّي حيّ بئر عثمان نسبةً إلى بئر رومة التي اشتراها عثمان بن عفان رضي الله عنه وجعلها لأهل المدينة.',
      'visit.hours': 'أوقات العمل',
      'visit.route': 'المسار', 'visit.maps': 'افتح في خرائط Google',
      'visit.write': 'راسلنا', 'visit.order': 'اطلب توصيل', 'visit.follow': 'تابعنا',
      'c.wa': 'واتساب', 'c.call': 'اتصال', 'c.igdm': 'رسالة إنستغرام', 'c.ig': 'إنستغرام', 'c.tt': 'تيك توك', 'c.snap': 'سناب شات', 'c.ch': 'مجتمع ساڤا', 'c.keeta': 'كيتا', 'c.hs': 'هنقرستيشن',
      'wa.text': 'مرحباً ساڤا! ',
      'days': ['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'],
      'foot.motto': 'يومٌ في ساڤا هو كل ما تحتاجه.',
      'foot.made': 'تصميم',
      'toast.bean': 'وجدت حبوب البن ☕',
      'away': '☕ قهوتك تبرد…',
      'floating.wa': 'تواصل عبر واتساب'
    }
  },

  /* подпись разработчика в подвале; пустая строка — скрыть */
  credit: 'SAUDI MADE'
};
