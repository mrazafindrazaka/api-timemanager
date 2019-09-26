'use strict'
const sqlite3 = require('sqlite3').verbose()

class Db {
  constructor (file) {
    this.db = new sqlite3.Database(file)
    // this.dropTable()
    this.createAllTable()
  }

  dropTable () {
    // this.db.run(`DROP TABLE user`)
    // this.db.run(`DROP TABLE team`)
    // this.db.run(`DROP TABLE role`)
  }

  createAllTable () {
    this.createTableUser()
    this.createTableTeam()
    this.createTableRole()
  }

  createTableUser () {
    const sql = `
            CREATE TABLE IF NOT EXISTS user (
                id integer PRIMARY KEY, 
                first_name text, 
                last_name text, 
                id_team integer, 
                id_role integer, 
                email text UNIQUE, 
                password text
                )
                `
    return this.db.run(sql)
  }

  createTableTeam () {
    const sql = `
            CREATE TABLE IF NOT EXISTS team (
                id integer PRIMARY KEY, 
                team_name text
                )
                `
    return this.db.run(sql)
  }

  createTableRole () {
    const sql = `
            CREATE TABLE IF NOT EXISTS role (
                id integer PRIMARY KEY, 
                role text
                )
                `
    return this.db.run(sql)
  }

  selectUserByEmail (email, callback) {
    const sql = `SELECT * FROM user WHERE email = ?`
    return this.db.get(sql, [email], (err, row) => {
      callback(err, row)
    })
  }

  selectUserById (id, callback) {
    const sql = `SELECT * FROM user WHERE id = ?`
    return this.db.get(sql, [id], (err, row) => {
      callback(err, row)
    })
  }

  selectAllUser (callback) {
    return this.db.all(`SELECT * FROM user`, function (err, rows) {
      callback(err, rows)
    })
  }

  insertUser (user, callback) {
    return this.db.run(
      `INSERT INTO user (first_name,last_name,id_team,id_role,email,password) VALUES (?,?,?,?,?,?)`,
      user, (err) => {
        callback(err)
      })
  }

  updateUser (user, callback) {
    return this.db.run(
      `UPDATE user SET first_name=?,last_name=?,id_team=?,id_role=?,email=? WHERE id=?`,
      user, (err) => {
        callback(err)
      })
  }

  deleteUser (id, callback) {
    const sql = `DELETE FROM user WHERE id = ?`
    return this.db.run(sql, [id], (err) => {
      callback(err)
    })
  }

  selectAllTeam (callback) {
    return this.db.all(`SELECT * FROM team`, function (err, rows) {
      callback(err, rows)
    })
  }

  selectTeamById (id, callback) {
    const sql = `SELECT * FROM team WHERE id = ?`
    return this.db.get(sql, [id], (err, row) => {
      callback(err, row)
    })
  }

  insertTeam (team, callback) {
    return this.db.run(
      `INSERT INTO team (team_name) VALUES (?)`,
      team, (err) => {
        callback(err)
      })
  }

  deleteTeam (id, callback) {
    const sql = `DELETE FROM team WHERE id = ?`
    return this.db.run(sql, [id], (err) => {
      callback(err)
    })
  }
  selectAllRole (callback) {
    return this.db.all(`SELECT * FROM role`, function (err, rows) {
      callback(err, rows)
    })
  }

  selectRoleById (id, callback) {
    const sql = `SELECT * FROM role WHERE id = ?`
    return this.db.get(sql, [id], (err, row) => {
      callback(err, row)
    })
  }

  insertRole (role, callback) {
    return this.db.run(
      `INSERT INTO role (role) VALUES (?)`,
      role, (err) => {
        callback(err)
      })
  }

  deleteRole (id, callback) {
    const sql = `DELETE FROM role WHERE id = ?`
    return this.db.run(sql, [id], (err) => {
      callback(err)
    })
  }
}

module.exports = Db
