const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, './cricketMatchDetails.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

const convertDbObjectToResponseObject = dbObject => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    matchId: dbObject.match_id,
    match: dbObject.match,
    year: dbObject.year,
    playerMatchId: player_match_id,
    score: dbObject.score,
    fours: dbObject.fours,
    sixes: dbObject.sixes,
  }
}
// APIs 1
app.get('/players/', async (request, response) => {
  const getPlayers = `
    SELECT * 
    FROM player_details;`
  const playerDetails = await db.all(getPlayers)
  response.send(
    playerDetails.map(eachPlayer =>
      convertDbObjectToResponseObject(eachPlayer),
    ),
  )
})

// APIs 2
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayerQuery = `
    SELECT * 
    FROM player_details
    WHERE 
    player_id = ${playerId};`

  const player = await db.get(getPlayerQuery)
  response.send(convertDbObjectToResponseObject(player))
})

// APIs 3

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDeatils = request.body
  const {playerName} = playerDeatils
  const updateQuery = `
  UPDATE player_details
  SET player_name = '${playerName}'
  WHERE 
  player_id = ${playerId};`

  await db.run(updateQuery)
  response.send('Player Details Updated')
})

// APIs 4

app.get('/matches/:matchId/', async (request, response) => {
  const {matchId} = request.params
  const getPlayerMatch = `
  SELECT * 
  FROM match_details
  WHERE 
  match_id = ${matchId};`
  const player = await db.get(getPlayerMatch)
  response.send(convertDbObjectToResponseObject(player))
})

module.exports = app
 
