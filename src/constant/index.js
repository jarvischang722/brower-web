import { updateLocale as updateRolesLocale } from './roles'

export * as formLayout from './formLayout'
export roles from './roles'

export const updateLocales = () => {
  updateRolesLocale()
}
