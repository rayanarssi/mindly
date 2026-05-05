import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/footer";
import { Box, Heading, Text, Flex, Image, Container } from "@chakra-ui/react";
import brownForum from "../assets/Forum/brown_forum.svg";
import communityIcon from "../assets/Forum/community_icon.svg";
import "../ui/forum.css";

function Forum() {
	return (
		<Box className="forum-page" bg="#fefae0" minH="100vh">
			<Navbar />

			<Box pt={16} pb={10}>
				<Container maxW="90vw">
					<Heading className="forum-heading">Forum</Heading>
					<Text className="forum-description" maxW="600px">
						Ask any questions that come to mind. <br /> You decide whether you
						want to ask them anonymously.
					</Text>
				</Container>
			</Box>

			<Box
				backgroundImage={`url(${brownForum})`}
				backgroundSize="cover"
				backgroundPosition="center"
				backgroundRepeat="no-repeat"
				py={35}
				position="relative"
			>
				<Container maxW="90vw">
					<Flex
						direction="row"
						align="center"
						justify="left"
						textAlign="left"
						gap={4}
					>
						<Image src={communityIcon} alt="Community Icon" w="20px" h="20px" />

						<Text
							className="community-guidelines-text"
							color="#fefae0"
							maxW="1000px"
						>
							Community guidelines: Be respectful to others. Do not share
							personal information. All questions are reviewed before being
							published.
						</Text>
					</Flex>
				</Container>
			</Box>

			<Footer />
		</Box>
	);
}

export default Forum;
