import queryString from '../../utils/queryString'

const mapping = (filters, map) => {
  if (!filters) return {}
  if (!map) return { ...filters }
  return Object.assign({}, ...Object.keys(filters).map(key => {
    if (map[key]) return { [map[key]]: filters[key] }
    return { [key]: filters[key] }
  }))
}

export default (pagination, filters, map) => {
  const params = mapping(filters, map)
  if (pagination) {
    const page = pagination.current
    const pagesize = pagination.pageSize
    if (page > 1) params.page = page
    if (pagesize !== 10) params.pagesize = pagesize
  }
  return queryString(params)
}
