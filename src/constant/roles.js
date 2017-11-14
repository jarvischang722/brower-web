const roles = [
  { value: 0, code: 'superadmin' },
  { value: 2, code: 'agent' },
  { value: 3, code: 'client' },
]

export const updateLocale = () => {
  roles.forEach(item => { item.text = i18n.t(`role.${item.code}`) })
}

export default roles
