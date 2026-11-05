// Interface texts. `en` is the source; other locales may leave keys out (they fall back to English).
// Placeholders: {name}, {n}, … are filled by t(key, params).
// Arabic is a first pass — have a native speaker review it before launch.

export const en = {
  meta: { title: 'Configure {name} · NestFinder' },
  model: { name: 'Saqr' },
  common: {
    allHomes: 'All homes',
    backToHomes: 'Back to homes',
    language: 'Language',
    units: 'Units',
    estimatedTotal: 'Estimated total',
    review: 'Review and get quote',
    requestQuote: 'Request my quote',
    change: 'Change',
    edit: 'Edit',
    close: 'Close',
    included: 'Included',
    none: 'None',
    noneSelected: 'None selected',
    more: '+{n} more',
    bedrooms: 'bedrooms',
    bathrooms: 'bathrooms',
    currency: 'AED',
    yourModel: 'Your {name}',
    configureAria: 'Configure your home',
    chooseHint: 'Choose a part of the home to change it.',
    tapHint: 'Tap a part to change it'
  },
  stage: {
    panorama: '360° panorama · {room}',
    dragHint: ' · drag to look around',
    view: 'View',
    pano: '360°',
    plan: 'Plan',
    panoramaAria: 'Panorama',
    planAria: 'Floor plan',
    floorPlan: 'Floor plan · {name}, {beds} bedrooms',
    miniPlan: 'Mini plan',
    openPlan: 'Open floor plan',
    youAreIn: 'You are in:'
  },
  cards: { layout: 'Size', kitchen: 'Kitchen', baths: 'Bathrooms', extras: 'Extras' },
  size: { title: 'Size {code}' },
  rooms: { layout: 'Living room', kitchen: 'Kitchen', baths: 'Bathroom', extras: 'Terrace', bathOf: '{name} bathroom' },
  kitchen: { finish: 'Kitchen finish', none: 'Without kitchen' },
  baths: {
    sameFinish: 'Same finish in all bathrooms',
    all: 'All bathrooms',
    inAll: '{finish} in all {n}',
    separately: '{n} bathrooms, finished separately',
    rowLabel: '{name} bath',
    names: ['Main bedroom', 'Guest', 'Bedroom 2', 'Bedroom 3', 'Hallway']
  },
  extras: {
    type: 'Extras type',
    int: 'Interior',
    ext: 'Exterior',
    about: 'About {name}',
    items: {
      int0: { name: 'Home Automation', desc: 'Complete home automation: lighting, climate control and security.' },
      int1: { name: 'Underfloor Heating', desc: 'Underfloor radiant heating throughout the home.' },
      int2: { name: 'Air Conditioning', desc: 'Centralized air conditioning with zone control.' },
      int3: { name: 'Dual-Flow Ventilation', desc: 'Double-flow mechanical ventilation with heat recovery.' },
      ext0: { name: 'Swimming Pool', desc: 'Private pool with integrated filtration system.' },
      ext1: { name: 'Solar Panels', desc: 'Rooftop photovoltaic solar panel installation.' },
      ext2: { name: 'Garage / 2-Car Pergola', desc: 'Two-car parking structure.' }
    }
  },
  homes: {
    title: 'All homes',
    text: 'This screen ("2 · Homes") is not part of the rooms v3 handoff yet.',
    back: 'Back to the configurator'
  }
}

type DeepPartial<T> = { [K in keyof T]?: T[K] extends readonly unknown[] ? T[K] : T[K] extends object ? DeepPartial<T[K]> : T[K] }
export type Messages = typeof en

export const ar: DeepPartial<Messages> = {
  meta: { title: 'تخصيص {name} · NestFinder' },
  model: { name: 'صقر' },
  common: {
    allHomes: 'كل المنازل',
    backToHomes: 'العودة إلى المنازل',
    language: 'اللغة',
    units: 'الوحدات',
    estimatedTotal: 'الإجمالي التقديري',
    review: 'المراجعة وطلب عرض السعر',
    requestQuote: 'اطلب عرض السعر',
    change: 'تغيير',
    edit: 'تعديل',
    close: 'إغلاق',
    included: 'مشمول',
    none: 'لا شيء',
    noneSelected: 'لم يتم اختيار شيء',
    more: '+{n} أخرى',
    bedrooms: 'غرف نوم',
    bathrooms: 'حمّامات',
    currency: 'درهم',
    yourModel: 'منزلك {name}',
    configureAria: 'خصّص منزلك',
    chooseHint: 'اختر جزءًا من المنزل لتغييره.',
    tapHint: 'اضغط على جزء لتغييره'
  },
  stage: {
    panorama: 'بانوراما 360° · {room}',
    dragHint: ' · اسحب للتجوّل',
    view: 'طريقة العرض',
    pano: '360°',
    plan: 'المخطط',
    panoramaAria: 'بانوراما',
    planAria: 'مخطط الطابق',
    floorPlan: 'مخطط الطابق · {name}، {beds} غرف نوم',
    miniPlan: 'مخطط مصغّر',
    openPlan: 'فتح مخطط الطابق',
    youAreIn: 'أنت في:'
  },
  cards: { layout: 'الحجم', kitchen: 'المطبخ', baths: 'الحمّامات', extras: 'الإضافات' },
  size: { title: 'الحجم {code}' },
  rooms: { layout: 'غرفة المعيشة', kitchen: 'المطبخ', baths: 'الحمّام', extras: 'التراس', bathOf: 'حمّام {name}' },
  kitchen: { finish: 'تشطيب المطبخ', none: 'بدون مطبخ' },
  baths: {
    sameFinish: 'نفس التشطيب في جميع الحمّامات',
    all: 'جميع الحمّامات',
    inAll: '{finish} في جميع الحمّامات ({n})',
    separately: '{n} حمّامات، تشطيب منفصل لكل منها',
    rowLabel: 'حمّام {name}',
    names: ['غرفة النوم الرئيسية', 'الضيوف', 'غرفة النوم 2', 'غرفة النوم 3', 'الممر']
  },
  extras: {
    type: 'نوع الإضافات',
    int: 'داخلية',
    ext: 'خارجية',
    about: 'حول {name}',
    items: {
      int0: { name: 'المنزل الذكي', desc: 'أتمتة كاملة للمنزل: الإضاءة والتحكم في المناخ والأمان.' },
      int1: { name: 'التدفئة تحت الأرضية', desc: 'تدفئة إشعاعية تحت الأرضية في جميع أنحاء المنزل.' },
      int2: { name: 'تكييف الهواء', desc: 'تكييف مركزي مع التحكم حسب المناطق.' },
      int3: { name: 'تهوية مزدوجة التدفق', desc: 'تهوية ميكانيكية مزدوجة التدفق مع استرداد الحرارة.' },
      ext0: { name: 'مسبح', desc: 'مسبح خاص مع نظام ترشيح مدمج.' },
      ext1: { name: 'ألواح شمسية', desc: 'تركيب ألواح شمسية كهروضوئية على السطح.' },
      ext2: { name: 'مرآب / مظلة لسيارتين', desc: 'مظلة لركن سيارتين.' }
    }
  },
  homes: {
    title: 'كل المنازل',
    text: 'هذه الشاشة («2 · المنازل») ليست ضمن تسليم rooms v3 بعد.',
    back: 'العودة إلى أداة التخصيص'
  }
}
