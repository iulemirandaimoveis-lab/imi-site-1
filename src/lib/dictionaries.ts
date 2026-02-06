
import 'server-only'

const dictionaries = {
    pt: () => import('@/dictionaries/pt.json').then((module) => module.default),
    en: () => import('@/dictionaries/en.json').then((module) => module.default),
    ja: () => import('@/dictionaries/ja.json').then((module) => module.default),
}

export const getDictionary = async (locale: keyof typeof dictionaries) => {
    return dictionaries[locale] ? dictionaries[locale]() : dictionaries.pt()
}
