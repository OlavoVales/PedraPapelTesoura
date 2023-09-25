import { useEffect, useState } from "react";
import { ActionsGame } from "./components/actions-game";
import { Button } from "./components/button";
import { Input } from "./components/input";
import { Modal } from "./components/modal";
import { Score } from "./components/score";
import * as C from "./styles";

const messages = {
  user: {
    title: "Usuário",
    message: "Preencha um nome para o jogador",
  },
  computerWin: {
    title: "Que pena!",
    message:
      "Não foi dessa vez, mais tente novamente aposto que você consegue !",
  },
  playerWin: {
    title: "Parabéns !",
    message: "Voce venceu, quero ver ganhar de novo !",
  },
};

const valueTypeEnum = {
  ROCK: 1,
  PAPER: 2,
  SCISSORS: 3,
};

const actions = [
  {
    value: 1,
    label: "👊🏻",
    description: "Rock",
  },
  {
    value: 2,
    label: "🖐🏻",
    description: "Paper",
  },
  {
    value: 3,
    label: "✌🏻",
    description: "Scissors",
  },
];

function App() {
  const [titleModal, setTitleModal] = useState("");
  const [messageModal, setMessageModal] = useState("");
  const [open, setOpen] = useState(false);
  const [textGame, setTextGame] = useState("Iniciar jogo !");
  const [scorePlayerValue, setScorePlayerValue] = useState(0);
  const [scoreComputerValue, setScoreComputerValue] = useState(0);
  const [userAction, setUserAction] = useState("X");
  const [computerAction, setComputerAction] = useState("X");
  const [userName, setUserName] = useState("USER");
  const [playGame, setPlayGame] = useState(false);
  const SCORE_TO_WIN = 5;

  const handleOpenModal = (type) => {
    if (!type) {
      setOpen(false);
      setTitleModal("");
      setMessageModal("");
      return;
    }
    setTitleModal(messages?.[type]?.title);
    setMessageModal(messages?.[type]?.message);
    setOpen(true);
  };

  const randomActionComputer = () => {
    const number = Math.floor(Math.random() * actions.length);
    return actions[number];
  };

  const handleClick = (value) => {
    setUserAction(value.label);
    const actionComputer = randomActionComputer();
    setComputerAction(actionComputer.label);
    checkWinner(value.value, actionComputer.value);
  };

  const checkWinner = (playerValue, computerValue) => {
    const playerRockWin =
      playerValue === valueTypeEnum.ROCK &&
      computerValue === valueTypeEnum.SCISSORS;
    const playerPaperWin =
      playerValue === valueTypeEnum.PAPER &&
      computerValue === valueTypeEnum.ROCK;
    const playerScissorsWin =
      playerValue === valueTypeEnum.SCISSORS &&
      computerValue === valueTypeEnum.PAPER;
    const drawerResult = playerValue === computerValue;
    const playerWin = playerRockWin || playerPaperWin || playerScissorsWin;

    if (drawerResult) return setTextGame("Empate jogue novamente !");
    if (playerWin) {
      setScorePlayerValue((state) => state + 1);
      return setTextGame("Vitoria jogue novamente !");
    }
    setScoreComputerValue((state) => state + 1);
    return setTextGame("Derrota jogue novamente !");
  };

  const handleUserName = (value) => {
    if (!value) return setUserName("JOGADOR");
    setUserName(value);
  };

  const startGame = () => {
    if (userName === "JOGADOR") {
      handleOpenModal("user");
      return;
    }
    if (playGame) return resetValues();
    setPlayGame(true);
  };

  const resetValues = () => {
    setTextGame("Iniciar o jogo !");
    setPlayGame(false);
    setScorePlayerValue(0);
    setScoreComputerValue(0);
    setUserAction("X");
    setComputerAction("X");
  };

  useEffect(() => {
    const checkVictory = () => {
      const playerWin = scorePlayerValue === SCORE_TO_WIN;
      const computerWin = scoreComputerValue === SCORE_TO_WIN;
      if (playerWin) return handleOpenModal("playerWin");
      if (computerWin) return handleOpenModal("computerWin");
    };

    checkVictory();
  }, [scorePlayerValue, scoreComputerValue]);

  return (
    <C.Container>
      <C.Flex direction="column">
        <C.Typography fontWeight="400" size="30px" lineHeight="48px">
          Pedra Papel Tesoura
        </C.Typography>
        <Input
          placeholder="Digite o nome do jogador"
          onChange={(value) => handleUserName(value)}
        />
        <Score
          userName={userName}
          scorePlayer={scorePlayerValue}
          scoreComputer={scoreComputerValue}
        />
        <C.Spacer margin="10px" />
        <C.Flex justify="space-around">
          <C.Typography size="32px">{userAction}</C.Typography>
          <C.Typography size="32px">{computerAction}</C.Typography>
        </C.Flex>

        <ActionsGame
          actions={actions}
          onClick={(value) => handleClick(value)}
          disabled={!playGame}
        />

        <Modal
          open={open}
          titleModal={titleModal}
          messageModal={messageModal}
          handleOpenModal={() => handleOpenModal(null)}
        />
        <Button onClick={startGame}>{playGame ? "Parar" : "Iniciar"}</Button>
      </C.Flex>
    </C.Container>
  );
}

export default App;
