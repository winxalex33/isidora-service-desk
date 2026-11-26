export type DemoCategoryKey =
  | 'service-desk'
  | 'rule-generator'
  | 'bank-chatbot'
  | 'internal-chatbot';

export interface DemoSlideConfig {
  key: DemoCategoryKey;
  partLabel: string;
  title: string;
  subtitle: string;
  expectedFilenameHint: string;
  keywords: string[];
}

export const DEMO_SLIDE_CONFIGS: Record<DemoCategoryKey, DemoSlideConfig> = {
  'service-desk': {
    key: 'service-desk',
    partLabel: 'Дел 01 · DEMO',
    title: 'Service Desk — Видео демонстрација',
    subtitle: 'Приказ во живо: поставување прашања на македонски јазик, табели, експорт и дијаграми.',
    expectedFilenameHint: '1_service_desk.mp4',
    keywords: ['service', 'desk', 'servicedesk', 'sd', '01', '1_'],
  },
  'rule-generator': {
    key: 'rule-generator',
    partLabel: 'Дел 02 · DEMO',
    title: 'ISIDORA Генератор на правила — Видео демонстрација',
    subtitle: 'Приказ во живо: претворање бизнис текст во машинско правило и автоматска контрола.',
    expectedFilenameHint: '2_rule_generator.mp4',
    keywords: ['rule', 'pravil', 'generator', '02', '2_'],
  },
  'bank-chatbot': {
    key: 'bank-chatbot',
    partLabel: 'Дел 03 · DEMO',
    title: 'ISIDORA Chatbot за клиенти банки — Видео демонстрација',
    subtitle: 'Приказ во живо: инстант упатства за надворешни клиенти банки достапни 24/7.',
    expectedFilenameHint: '3_bank_chatbot.mp4',
    keywords: ['bank', 'banki', 'client', 'klient', '03', '3_'],
  },
  'internal-chatbot': {
    key: 'internal-chatbot',
    partLabel: 'Дел 04 · DEMO',
    title: 'ISIDORA Chatbot за интерни корисници — Видео демонстрација',
    subtitle: 'Приказ во живо: брзи процедури и упатства за интерните тимови.',
    expectedFilenameHint: '4_internal_chatbot.mp4',
    keywords: ['internal', 'intern', 'vработен', '04', '4_'],
  },
};

const assetVideoModules = import.meta.glob<string>(
  '/src/assets/**/*.{mp4,webm,mov,m4v,ogg,MP4,WEBM,MOV,M4V}',
  { eager: true, import: 'default' }
);

const CATEGORY_ORDER: DemoCategoryKey[] = [
  'service-desk',
  'rule-generator',
  'bank-chatbot',
  'internal-chatbot',
];

function resolveVideosByCategory(): Record<DemoCategoryKey, string | null> {
  const entries = Object.entries(assetVideoModules).sort(([a], [b]) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
  );

  const resolved: Record<DemoCategoryKey, string | null> = {
    'service-desk': null,
    'rule-generator': null,
    'bank-chatbot': null,
    'internal-chatbot': null,
  };

  const usedPaths = new Set<string>();

  // First pass: match by descriptive filename keywords
  for (const key of CATEGORY_ORDER) {
    const keywords = DEMO_SLIDE_CONFIGS[key].keywords;
    const match = entries.find(([path]) => {
      if (usedPaths.has(path)) return false;
      const filename = path.split('/').pop()?.toLowerCase() ?? '';
      return keywords.some((kw) => filename.includes(kw));
    });

    if (match) {
      resolved[key] = match[1];
      usedPaths.add(match[0]);
    }
  }

  // Second pass: assign any remaining sorted assets sequentially
  const remaining = entries.filter(([path]) => !usedPaths.has(path));
  let remIdx = 0;
  for (const key of CATEGORY_ORDER) {
    if (!resolved[key] && remIdx < remaining.length) {
      resolved[key] = remaining[remIdx][1];
      remIdx += 1;
    }
  }

  return resolved;
}

export const DEMO_VIDEO_SOURCES = resolveVideosByCategory();
