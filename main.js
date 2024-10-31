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

  /**
   * 
   * @param {[string, any[]][]} res 
   * @param {string} cmd
   */
  window.cmd_submit = (res, cmd) => {
    try {
      res.push([cmd, db.exec(cmd)])
    } catch (e) { alert(e) }
  }

  window.reset_scroll = () => {
    let x = document.getElementById('sql_terminal');
    x.scrollTop = x.scrollHeight
  }

  window.sheet_obj_upload = (nname, obj) => {
    const keys = Object.keys(obj[0])
    const name = `"${nname}"`

    try {
      db.run(`create table ${name} (${keys.map(k => `"${k}"`).join(", ")})`)
    } catch (e) {
      alert(`create failed ${e}`)
    }

    for (const row of obj) {
      db.run(`insert into ${name} values (${keys.map(_ => '?').join(', ')})`, keys.map(k => row[k]))
    }
  }

  window.db = db
  window.Alpine = Alpine
  window.xlsx = XLSX

  Alpine.start()
} catch (e) {
  alert(e)
}
