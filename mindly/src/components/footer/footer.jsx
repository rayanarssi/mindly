import { Box, Flex, Text, VStack, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import logoImg from "../../assets/Footer/Logo_footer.png";
import bgImg from "../../assets/Footer/Footer.png";
function Footer() {
	return (
		<Box
			color="white"
			py={40}
			backgroundImage={`url(${bgImg})`}
			backgroundSize="cover"
			backgroundPosition="center"
			maxW="100vw"
		>
			<Flex
				maxW="90vw"
				mx="auto"
				gap={10}
				flexWrap="wrap"
				justify="space-between"
				align="flex-start"
			>
				<VStack align="flex-start" spacing={4} maxW="200px">
					<Box as="img" src={logoImg} alt="Mindly" h="10  0px" />
				</VStack>

				<VStack>
					<Text fontSize="sm" color="#fefae0" maxW="200px">
						A safe place for young people to learn more about stress, focus and
						motivation
					</Text>
				</VStack>

				<VStack align="flex-start" spacing={3}>
					<Text fontWeight="bold" fontSize="lg" mb={2} color="#fefae0">
						Topics
					</Text>
					<Link
						as={RouterLink}
						to="/stress"
						color="#fefae0"
						_hover={{ color: "white" }}
					>
						Stress
					</Link>
					<Link
						as={RouterLink}
						to="/focus"
						color="#fefae0"
						_hover={{ color: "white" }}
					>
						Focus
					</Link>
					<Link
						as={RouterLink}
						to="/motivation"
						color="#fefae0"
						_hover={{ color: "white" }}
					>
						Motivation
					</Link>
				</VStack>

				<VStack align="flex-start" spacing={3}>
					<Text fontWeight="bold" fontSize="lg" mb={2} color="#fefae0">
						Discover
					</Text>
					<Link
						as={RouterLink}
						to="/videos"
						color="#fefae0"
						_hover={{ color: "white" }}
					>
						Videos
					</Link>
					<Link
						as={RouterLink}
						to="/forum"
						color="#fefae0"
						_hover={{ color: "white" }}
					>
						Forum
					</Link>
				</VStack>

				<VStack align="flex-start" spacing={3} maxW="280px">
					<Text fontWeight="bold" fontSize="lg" mb={2} color="#fefae0">
						Important
					</Text>
					<Text fontSize="sm" color="#fefae0">
						This website provides educational information and is not a
						substitute for professional help.
					</Text>
				</VStack>
			</Flex>
		</Box>
	);
}

export default Footer;
