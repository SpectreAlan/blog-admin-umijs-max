import { parseTime } from '@/utils/index'
export function exportExcel(o) {
  import('@/vendor/Export2Excel').then(excel => {
    const data = formatJson(o.keys, o.list)
    excel.export_json_to_excel({
      header: o.names,
      data,
      filename: document.title.split('-')[0]
    })
  })
}
function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => {
    if (j === 'timestamp') {
      return parseTime(v[j])
    } else {
      return v[j]
    }
  }))
}
