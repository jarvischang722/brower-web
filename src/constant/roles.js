const roles = [
  { value: 0, code: 'superadmin' },
  { value: 1, code: 'agent' },
  { value: 2, code: 'client' },
]

export const updateLocale = () => {
  roles.forEach(item => { item.text = i18n.t(`role.${item.code}`) })
}

export default roles
