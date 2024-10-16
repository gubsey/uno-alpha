import Alpine from 'alpinejs'
import './style.css'
import initSqlJs from 'sql.js'
import wasm from 'sql.js/dist/sql-wasm.wasm?url'
import { themes } from './daisy_themes'

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
  window.daisy_themes = themes

  Alpine.start()
} catch (e) {
  alert(e)
}
