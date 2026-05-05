import { Box, Heading, Text, Button, VStack, HStack } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { getGameLevels } from "../services/gameLevels";
import backArrow from "../assets/Login/back_arrow.svg";
import "../ui/games.css";

function GameLevels() {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const gameData = getGameLevels(gameId);

  if (!gameData) {
    navigate("/games");
    return null;
  }

  const handleSelectLevel = (levelId) => {
    navigate(`/games/${gameId}/play?level=${levelId}`);
  };

  const levels = Object.values(gameData.levels);

  const getBtnClass = () => {
    switch (gameData.theme) {
      case "Focus": return "focus-btn";
      case "Stress": return "stress-btn";
      case "Motivation": return "motivation-btn";
      default: return "focus-btn";
    }
  };

  return (
    <Box className="level-selection">
      <Box
        as="button"
        className="back-arrow"
        onClick={() => navigate("/games")}
      >
        <Box as="img" src={backArrow} alt="Back" />
      </Box>
      <VStack className="level-selection-content" gap={8} align="center">
        <Heading className="games-title" textAlign="center">
          {gameData.name}
        </Heading>
        <Text fontSize="lg" color="#472c1b" textAlign="center" maxW="600px">
          {gameData.theme === "Focus" && "Remember the sequence of colored buttons and repeat it back. Each round gets longer!"}
          {gameData.theme === "Stress" && "Learn to manage pressure by keeping your stress level within a calm zone."}
          {gameData.theme === "Motivation" && "Stay focused on your task while resisting distractions that try to pull you away."}
        </Text>

        <HStack
          gap={6}
          justify="center"
          flexWrap="wrap"
          className="level-cards"
        >
          {levels.map((level) => (
            <Box
              key={level.id}
              className="game-card"
              borderColor="#472c1b"
              p={6}
              flex="1"
              minW="280px"
              maxW="350px"
            >
              <VStack gap={3} align="flex-start">
                <Text
                  fontSize="1.5rem"
                  fontWeight="bold"
                  color="#472c1b"
                  fontFamily="Just Another Hand, cursive"
                >
                  {level.label}
                </Text>
                <Text fontSize="0.9rem" color="#472c1b">
                  {level.description}
                </Text>
                <Button
                  className={`game-card-btn ${getBtnClass()}`}
                  backgroundColor="#472c1b"
                  size="sm"
                  onClick={() => handleSelectLevel(level.id)}
                >
                  Select 
                </Button>
              </VStack>
            </Box>
          ))}
        </HStack>
      </VStack>
    </Box>
  );
}

export default GameLevels;
