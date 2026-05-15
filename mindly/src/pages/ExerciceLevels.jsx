import { Box, Heading, Text, Button, VStack, HStack } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { getExerciceLevels } from "../services/exerciceLevels";
import backArrow from "../assets/Login/back_arrow.svg";
import "../ui/exercices.css";

function ExerciceLevels() {
  const navigate = useNavigate();
  const { exerciceId } = useParams();
  const exerciceData = getExerciceLevels(exerciceId);

  if (!exerciceData) {
    navigate("/exercices");
    return null;
  }

  const handleSelectLevel = (levelId) => {
    navigate(`/exercices/${exerciceId}/play?level=${levelId}`);
  };

  const levels = Object.values(exerciceData.levels);

  const getBtnClass = () => {
    switch (exerciceData.theme) {
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
        onClick={() => navigate("/exercices")}
      >
        <Box as="img" src={backArrow} alt="Back" />
      </Box>
      <VStack className="level-selection-content" gap={8} align="center">
        <Heading className="exercices-title" textAlign="center">
          {exerciceData.name}
        </Heading>
        <Text fontSize="lg" color="#472c1b" textAlign="center" maxW="600px">
          {exerciceData.theme === "Focus" && "Remember the sequence of colored buttons and repeat it back. Each round gets longer!"}
          {exerciceData.theme === "Stress" && "Learn to manage pressure by keeping your stress level within a calm zone."}
          {exerciceData.theme === "Motivation" && "Stay focused on your task while resisting distractions that try to pull you away."}
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
              className="exercice-card"
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
                  className={`exercice-card-btn ${getBtnClass()}`}
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

export default ExerciceLevels;
