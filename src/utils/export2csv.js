// http://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
export default (filename, rows) => {
  const processRow = (row) => {
    let finalVal = ''
    for (let j = 0; j < row.length; j++) {
      const m = row[j]
      let innerValue = m === null || m === undefined ? '' : row[j].toString()
      if (m instanceof Date) {
        innerValue = m.toLocaleString()
      }
      let result = innerValue.replace(/"/g, '""')
      if (result.search(/("|,|\n)/g) >= 0) result = `"${result}"`
      if (j > 0) finalVal += ','
      finalVal += result
    }
    return `${finalVal}\n`
  }

  let csvFile = ''
  for (let i = 0; i < rows.length; i++) {
    csvFile += processRow(rows[i])
  }

  const blob = new Blob(['\ufeff', csvFile], { type: 'text/csv;charset=utf-8;' })
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, filename)
  } else {
    const link = document.createElement('a')
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
