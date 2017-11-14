import queryString from '../../utils/queryString'

const mapping = (filters, map) => {
  if (!map) return filters
  return Object.assign({}, ...Object.keys(filters).map(key => {
    if (map[key]) return { [map[key]]: filters[key] }
    return { [key]: filters[key] }
  }))
}

export default (pagination = {}, filters = {}, map) => {
  const page = pagination.current
  const pagesize = pagination.pageSize
  return queryString({ page, pagesize, ...mapping(filters, map) })
}
