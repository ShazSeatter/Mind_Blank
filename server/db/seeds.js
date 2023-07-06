use game;
db.dropDatabase();

db.highscores.insertMany([
    {
        highscore: 100
    },
    {
        highscore: 150
    },
    {
        highscore: 200
    }
    // { highscore: x if its greater than the current highscore}
])