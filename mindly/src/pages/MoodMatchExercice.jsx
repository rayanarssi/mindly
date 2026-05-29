import { Box, Heading, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import MoodMatchGame from "../components/exercices/MoodMatchGame";
import "../ui/exercices.css";

function MoodMatchExercice() {
  const navigate = useNavigate();

  return (
    <Box className="exercices-page">
      <Box
        className="exercices-container"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minH="calc(100vh - 100px)"
      >
        <MoodMatchGame onBack={() => navigate("/exercices")} />
      </Box>
    </Box>
  );
}

export default MoodMatchExercice;
