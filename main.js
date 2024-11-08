import Alpine from 'alpinejs'
import './style.css'
import initSqlJs, { Database } from 'sql.js'
// @ts-ignore
import wasm from 'sql.js/dist/sql-wasm.wasm?url'
import * as XLSX from 'xlsx'


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

  window.cmd_submit = (res, cmd) => {
    try {
      res.push([cmd, db.exec(cmd)])
    } catch (e) { alert(e) }
  }

  window.reset_scroll = (id) => {
    let x = document.getElementById(id);
    if (x === null) {
      alert(`"${id}" is not the id of any element`)
      return
    }
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

  window.tables_component = () => {
    return {
      /** @type {string[]} */
      table_names: [],
      init() {
        setInterval(() => {
          this.table_names = db.exec('SELECT name FROM sqlite_schema')[0].values
        }, 1000);
      },
      get_columns(name) {
        return db.exec(`SELECT * FROM ${name} LIMIT 0`)[0].columns
      }
    }
  }

  window.db = db
  window.Alpine = Alpine
  window.xlsx = XLSX

  Alpine.start()
} catch (e) {
  alert(e)
}
