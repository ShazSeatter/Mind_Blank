import { useState, useEffect } from "react";
import GameEnd from "../components/GameEnd/GameEnd";
import { GameMenu } from "../components/GameMenu";
import Loading from "../components/Loading";
import QuizContainer from "./QuizContainer";
import { getHighscores, postHighscores } from "../HighscoreService";

export default function GameContainer() {
  const [data, setData] = useState([]);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [startGame, setStartGame] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [highscores, setHighscores] = useState([]);

  async function getData() {
    const urlCategory = category.toLowerCase().replace(/ /g, "_");
    const url = `https://the-trivia-api.com/api/questions?${
      category && `categories=${urlCategory}`
    }&limit=50&${difficulty && `difficulty=${difficulty.toLowerCase()}`}`;
    const response = await fetch(url);
    const jsonData = await response.json();
    setData(jsonData);
  }

  useEffect(() => {
    getData();
  }, [category, difficulty]);

  //  BACKEND SCORE DATA SECTION
  useEffect(() => {
    getHighscores().then((allHighscores) => {
      setHighscores(allHighscores);
    });
  }, []);

  const eachHighScore = highscores.map((highscore) => {
    return highscore.highscore;
  });
  // this gets back an array of scores

  let highestScore;
  if (highscores.length) {
    highestScore = Math.max.apply(Math, eachHighScore);
  } else {
    highestScore = 0;
  }

  if (gameEnded && score > highestScore) {
    setHighscores([...highscores, {highscore: score}]);
    postHighscores({ highscore: score });
  }

  // if (gameEnded && score > highestScore) {
  //   const updatedHighscores = [...highscores, { highscore: score }];
  //   setHighscores(updatedHighscores);
  //   postHighscores({ highscores: updatedHighscores });
  // }

  console.log("highscores", eachHighScore);

  console.log("highscores", highscores);

  if (!data.length) return <Loading />;

  if (!startGame) {
    return (
      <div>
        <div className="logo">
          <b>
            M<span>in</span>d<span></span> <span>B</span>lan<span>k</span>
          </b>
        </div>
        <GameMenu
          setStartGame={setStartGame}
          setCategory={setCategory}
          setDifficulty={setDifficulty}
          difficulty={difficulty}
          category={category}
        />
      </div>
    );
  }

  if (gameEnded) {
    return (
      <div>
        <GameEnd
          score={score}
          setStartGame={setStartGame}
          setGameEnded={setGameEnded}
          setScore={setScore}
          getData={getData}
        />
      </div>
    );
  }

  return (
    <div>
      <QuizContainer
        data={data}
        gameEnded={gameEnded}
        setGameEnded={setGameEnded}
        setStartGame={setStartGame}
        getData={getData}
        highestScore={highestScore}
        score={score}
        setScore={setScore}
        setCategory={setCategory}
      />
    </div>
  );
}
