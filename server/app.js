'use strict'
const express = require('express')
const DB = require('./db')
const config = require('./config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

const db = new DB('sqlitedb')
const app = express()
const router = express.Router()

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

// CORS middleware
const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
}

app.use(allowCrossDomain)

router.post('/user', function (req, res) {
  db.insertUser(
    [
      req.body.first_name,
      req.body.last_name,
      req.body.id_team,
      req.body.id_role,
      req.body.email,
      bcrypt.hashSync(req.body.password, 8)
    ],
    function (err) {
      if (err) {
        console.log(err)
        return res
          .status(500)
          .send('There was a problem registering the user.')
      }
      res.status(201).send('User registered')
    }
  )
})

router.put('/user/:id', function (req, res) {
  db.updateUser(
    [
      req.body.first_name,
      req.body.last_name,
      req.body.id_team,
      req.body.id_role,
      req.body.email,
      req.params.id
    ],
    function (err) {
      if (err) {
        console.log(err)
        return res.status(500).send('There was a problem updating the user.')
      }
      res.status(200).send('User updated')
    }
  )
})

router.post('/login', (req, res) => {
  db.selectUserByEmail(req.body.email, (err, user) => {
    if (err) return res.status(500).send('Error on the server.')
    if (!user) return res.status(404).send('No user found.')
    let passwordIsValid = bcrypt.compareSync(req.body.password, user.password)
    if (!passwordIsValid) { return res.status(401).send({ auth: false, token: null }) }
    let token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400
    })
    res.status(200).send({ auth: true, token: token, user: user })
  })
})

router.get('/users', (req, res) => {
  db.selectAllUser((err, user) => {
    if (err) return res.status(500).send('Error on the server.')
    if (!user) return res.status(404).send('No users found.')
    res.status(200).send(user)
  })
})

router.get('/user/:id', (req, res) => {
  db.selectUserById(req.params.id, (err, user) => {
    if (err) return res.status(500).send('Error on the server.')
    if (!user) return res.status(404).send('No user found.')
    res.status(200).send(user)
  })
})

router.delete('/user/:id', (req, res) => {
  db.deleteUser(req.params.id, err => {
    if (err) return res.status(500).send('Error on the server.')
    res.status(200).send('User ' + req.params.id + ' deleted')
  })
})

router.post('/team', function (req, res) {
  db.insertTeam([req.body.team_name], function (err) {
    if (err) {
      console.log(err)
      return res.status(500).send('There was a problem registering the team.')
    }
    res.status(201).send('Team registered')
  })
})

router.delete('/team/:id', (req, res) => {
  db.deleteTeam(req.params.id, err => {
    if (err) return res.status(500).send('Error on the server.')
    res.status(200).send('Team ' + req.params.id + ' deleted')
  })
})

router.get('/teams', (req, res) => {
  db.selectAllTeam((err, team) => {
    if (err) return res.status(500).send('Error on the server.')
    if (!team) return res.status(404).send('No teams found.')
    res.status(200).send(team)
  })
})

router.get('/team/:id', (req, res) => {
  db.selectTeamById(req.params.id, (err, team) => {
    if (err) return res.status(500).send('Error on the server.')
    if (!team) return res.status(404).send('No team found.')
    res.status(200).send(team)
  })
})

router.post('/role', function (req, res) {
  db.insertRole([req.body.role], function (err) {
    if (err) {
      console.log(err)
      return res.status(500).send('There was a problem registering the role.')
    }
    res.status(201).send('Role registered')
  })
})

router.delete('/role/:id', (req, res) => {
  db.deleteRole(req.params.id, err => {
    if (err) return res.status(500).send('Error on the server.')
    res.status(200).send('Role ' + req.params.id + ' deleted')
  })
})

router.get('/roles', (req, res) => {
  db.selectAllRole((err, role) => {
    if (err) return res.status(500).send('Error on the server.')
    if (!role) return res.status(404).send('No roles found.')
    res.status(200).send(role)
  })
})

router.get('/role/:id', (req, res) => {
  db.selectRoleById(req.params.id, (err, role) => {
    if (err) return res.status(500).send('Error on the server.')
    if (!role) return res.status(404).send('No team found.')
    res.status(200).send(role)
  })
})

app.use(router)

let port = process.env.PORT || 3000

let server = app.listen(port, function () {
  console.log('Express server listening on port ' + port)
})
