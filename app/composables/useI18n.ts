import { ar, en, type Messages } from '~/i18n/messages'

export type Lang = 'EN' | 'AR'

const catalogs: Record<Lang, unknown> = { EN: en, AR: ar }

const lookup = (obj: unknown, path: string): unknown =>
  path.split('.').reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined), obj)

const fill = (s: string, params?: Record<string, string | number>) =>
  params ? s.replace(/\{(\w+)\}/g, (m, k) => (k in params ? String(params[k]) : m)) : s

/** Bidi isolate: keeps numbers / Latin runs (prices, m², S/M/L) intact inside right-to-left text. */
export const isolate = (s: string) => `⁨${s}⁩`

export function useI18n() {
  const lang = useState<Lang>('lang', () => 'EN')
  const isRtl = computed(() => lang.value === 'AR')
  const dir = computed(() => (isRtl.value ? 'rtl' : 'ltr'))
  const htmlLang = computed(() => ({ EN: 'en', AR: 'ar' })[lang.value])

  /** Text by dotted key, e.g. t('common.change'), t('baths.inAll', { finish, n }). Falls back to English. */
  const t = (key: string, params?: Record<string, string | number>): string => {
    const v = lookup(catalogs[lang.value], key) ?? lookup(en, key)
    return typeof v === 'string' ? fill(v, params) : key
  }
  /** Lists (e.g. bathroom names). */
  const tList = (key: string): string[] => {
    const v = lookup(catalogs[lang.value], key) ?? lookup(en, key)
    return Array.isArray(v) ? (v as string[]) : []
  }

  const setLang = (l: Lang) => { lang.value = l }

  return { lang, isRtl, dir, htmlLang, t, tList, setLang }
}

export type { Messages }
