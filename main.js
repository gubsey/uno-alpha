import Alpine from 'alpinejs'
import './style.css'
import initSqlJs from 'sql.js'
import wasm from 'sql.js/dist/sql-wasm.wasm?url'
import * as XLSX from 'xlsx'
/**
 * @param {File} file 
 */
window.xlsx_to_obj = async (file) => {
  const xl = XLSX.read(await file.arrayBuffer())
  return xl.SheetNames.map(name => [name, XLSX.utils.sheet_to_json(xl.Sheets[name])])
}

try {
  const sql = await initSqlJs({
    locateFile: _ => wasm
  })
  const db = new sql.Database()
  db.run('\
    create table fruits (name text, quantity int); \
    insert into fruits values ("apples", 3), ("bananas", 5), ("grapes", 7); \
  ')


  window.db = db
  window.Alpine = Alpine
  window.xlsx = XLSX

  Alpine.start()
} catch (e) {
  alert(e)
}
