import Navbar from "../components/navbar/Navbar";
import {
	Box,
	Heading,
	Text,
	Button,
	Flex,
	SimpleGrid,
	Image,
	Container,
	Center,
} from "@chakra-ui/react";
import { Link } from "react-router";
import bgHome from "../assets/Homepage/BG_Home.png";
import actionBrown from "../assets/Homepage/Action_brown.png";
import Book from "../assets/Homepage/Book_home.svg";
import Bulb from "../assets/Homepage/lightbulb_home.svg";
import Action from "../assets/Homepage/Action_home.svg";
import "../ui/home.css";

function Home() {
	return (
		<Box>
			<Box
				minH="100vh"
				backgroundImage={`url(${bgHome})`}
				backgroundSize="cover"
				backgroundPosition="center"
				position="relative"
			>
				<Navbar />
				<Flex
					direction="column"
					justify="center"
					align="center"
					minH="calc(100vh - 80px)"
					px={4}
					textAlign="center"
				>
					<Heading className="home-heading">
						Learn and Share
						<Text className="home-subheading"> with Mindly</Text>
					</Heading>
					<Text className="home-text">
						Stress, distraction, and mental fog all have a cause. <br />
						Take a moment to understand what's behind it.
					</Text>
					<Button className="home-button" as={Link} to="/videos" size="lg">
						Watch Videos
					</Button>
				</Flex>
			</Box>

			<Box
				backgroundImage={`url(${actionBrown})`}
				py={120}
				backgroundRepeat={"no-repeat"}
				backgroundPosition="center"
				position="relative"
			>
				<Container maxW="70vw">
					<SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
						<Flex
							direction="column"
							align="center"
							p={6}
							borderRadius="15px"
							border="3px solid"
							borderColor="#fefae0"
							textAlign="center"
						>
							<Image src={Book} alt="Book Icon" mb={4} />
							<Heading className="title_action" mb={4} color="#fefae0">
								Recognize your problem
							</Heading>
							<Text color="#fefae0">
								Feeling stressed, distracted, or unmotivated? Pick a theme.
							</Text>
						</Flex>

						<Flex
							direction="column"
							align="center"
							p={6}
							borderRadius="15px"
							border="3px solid"
							borderColor="#fefae0"
							textAlign="center"
						>
							<Image src={Bulb} alt="Bulb Icon" mb={4} />
							<Heading className="title_action">
								Understand what's happening
							</Heading>
							<Text color="#fefae0">
								Discover why stress happens, why focus is difficult, and how
								motivation works.
							</Text>
						</Flex>

						<Flex
							direction="column"
							align="center"
							p={6}
							borderRadius="15px"
							border="3px solid"
							borderColor="#fefae0"
							textAlign="center"
						>
							<Image src={Action} alt="Action Icon" mb={4} />
							<Heading className="title_action">
								Take action and ask your questions
							</Heading>
							<Text color="#fefae0">
								Expert advice. Anonymous questions. You're not alone.
							</Text>
						</Flex>
					</SimpleGrid>
				</Container>
			</Box>

			
		</Box>
	);
}

export default Home;
