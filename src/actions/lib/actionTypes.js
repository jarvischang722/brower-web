export const promiseTypeSuffixes = ['LOADING', 'SUCCESS', 'FAILURE']

export function constructAsyncActionTypes(type) {
  const values = promiseTypeSuffixes.map(item => `${type}_${item}`)
  const [LOADING, SUCCESS, FAILURE] = values

  return {
    LOADING, SUCCESS, FAILURE,
    ORIGIN: type,
    async: payload =>
      ({
        type,
        payload,
      }),
  }
}
