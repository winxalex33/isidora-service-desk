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
  githubFallbackUrl: string | null;
}

export const DEMO_SLIDE_CONFIGS: Record<DemoCategoryKey, DemoSlideConfig> = {
  'service-desk': {
    key: 'service-desk',
    partLabel: 'Дел 01 · DEMO',
    title: 'Service Desk — Видео демонстрација',
    subtitle: 'Приказ во живо: поставување прашања на македонски јазик, табели, експорт и дијаграми.',
    expectedFilenameHint: 'Service_Desk_AI.mp4',
    keywords: ['service', 'desk', 'servicedesk', 'sd'],
    githubFallbackUrl: null,
  },
  'rule-generator': {
    key: 'rule-generator',
    partLabel: 'Дел 02 · DEMO',
    title: 'ISIDORA Генератор на правила — Видео демонстрација',
    subtitle: 'Приказ во живо: претворање бизнис текст во машинско правило и автоматска контрола.',
    expectedFilenameHint: 'Generate_Rules_AI_*.mp4',
    keywords: ['rule', 'rules', 'generate_rules', 'pravil', 'generator'],
    githubFallbackUrl:
      'https://raw.githubusercontent.com/winxalex33/isidora-service-desk/main/src/assets/Generate_Rules_AI_2026-09-11_155042_94422c57.mp4',
  },
  'bank-chatbot': {
    key: 'bank-chatbot',
    partLabel: 'Дел 03 · DEMO',
    title: 'ISIDORA Chatbot за клиенти банки — Видео демонстрација',
    subtitle: 'Приказ во живо: инстант упатства за надворешни клиенти банки достапни 24/7.',
    expectedFilenameHint: 'ChatBotOKF_AI_ISIDORA_klientska_*.mp4',
    keywords: ['klientska', 'klient', 'bank', 'banki', 'client'],
    githubFallbackUrl:
      'https://raw.githubusercontent.com/winxalex33/isidora-service-desk/main/src/assets/ChatBotOKF_AI_ISIDORA_klientska_d2d92ca8.mp4',
  },
  'internal-chatbot': {
    key: 'internal-chatbot',
    partLabel: 'Дел 04 · DEMO',
    title: 'ISIDORA Chatbot за интерни корисници — Видео демонстрација',
    subtitle: 'Приказ во живо: брзи процедури и упатства за интерните тимови.',
    expectedFilenameHint: 'ChatBotOKF_AI_ISIDORA_admin_*.mp4',
    keywords: ['admin', 'internal', 'intern'],
    githubFallbackUrl:
      'https://raw.githubusercontent.com/winxalex33/isidora-service-desk/main/src/assets/ChatBotOKF_AI_ISIDORA_admin_2c838125.mp4',
  },
};

const srcAssetVideoModules = import.meta.glob<string>(
  '/src/assets/**/*.{mp4,webm,mov,m4v,ogg,MP4,WEBM,MOV,M4V}',
  { eager: true, import: 'default' }
);

const publicAssetVideoModules = import.meta.glob<string>(
  '/public/assets/**/*.{mp4,webm,mov,m4v,ogg,MP4,WEBM,MOV,M4V}',
  { eager: true, import: 'default' }
);

const CATEGORY_ORDER: DemoCategoryKey[] = [
  'service-desk',
  'rule-generator',
  'bank-chatbot',
  'internal-chatbot',
];

function resolveVideosByCategory(): Record<DemoCategoryKey, string | null> {
  const srcEntries = Object.entries(srcAssetVideoModules).map(([path, url]) => ({
    path,
    url,
  }));

  const publicEntries = Object.entries(publicAssetVideoModules).map(([path]) => ({
    path,
    url: path.replace(/^\/public/, ''),
  }));

  const entries = [...srcEntries, ...publicEntries].sort((a, b) =>
    a.path.localeCompare(b.path, undefined, { numeric: true, sensitivity: 'base' })
  );

  const resolved: Record<DemoCategoryKey, string | null> = {
    'service-desk': null,
    'rule-generator': null,
    'bank-chatbot': null,
    'internal-chatbot': null,
  };

  for (const key of CATEGORY_ORDER) {
    const keywords = DEMO_SLIDE_CONFIGS[key].keywords;
    const match = entries.find(({ path }) => {
      const filename = path.split('/').pop()?.toLowerCase() ?? '';
      return keywords.some((kw) => filename.includes(kw));
    });

    resolved[key] = match ? match.url : DEMO_SLIDE_CONFIGS[key].githubFallbackUrl;
  }

  return resolved;
}

export const DEMO_VIDEO_SOURCES = resolveVideosByCategory();
