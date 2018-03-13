import moment from 'moment'
import I18n from 'react-i18nify/build/lib/I18n'
import zh_CN from './zh_CN'
import en from './en'

I18n.setTranslations({ zh_CN, en })

global.i18n = {
  l: (value, options) => I18n.l(value, options),
  t(key, replacement) {
    const arr = key.split('+')
    return arr.map(k => I18n.t(k.trim(), replacement)).join(I18n.t(''))
  },
  forceComponentsUpdate() {
    I18n.forceComponentsUpdate()
  },
  setLocale(locale, rerenderComponents) {
    I18n.setLocale(locale, rerenderComponents)
  }
}

moment.locale('en')
i18n.setLocale('en')
