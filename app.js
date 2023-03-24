const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
const path = require("path");
const dbpath = path.join(__dirname, "cricketTeam.db");
app.use(express.json());
let db = null;
const startServerAndDB = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is stared");
    });
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};
startServerAndDB();
module.exports = app;

const ConvertingFun = (item) => {
  return {
    playerId: item.player_id,
    playerName: item.player_name,
    jerseyNumber: item.jersey_number,
    role: item.role,
  };
};

app.get("/players/", async (request, response) => {
  const Quereys = `
    SELECT * FROM
    cricket_team;
    `;
  const playerss = await db.all(Quereys);
  response.send(playerss.map((obj) => ConvertingFun(obj)));
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const Quereys = `
    SELECT * FROM
    cricket_team
    WHERE
    player_id=${playerId};
    `;
  const play = await db.get(Quereys);
  response.send(ConvertingFun(play));
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const { playerId } = request.params;
  const updateQue = `
    UPDATE cricket_team
    SET 
    player_name='${playerName}',
    jersey_number=${jerseyNumber},
    role='${role}'
    WHERE 
    player_id=${playerId};`;

  await db.run(updateQue);
  response.send("Player Details Updated");
});
