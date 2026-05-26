import { Image } from "@chakra-ui/react";
import arrowUp from "../assets/arrow_up.svg";

function ScrollToTop() {
	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<Image
			src={arrowUp}
			alt="Scroll to top"
			position="fixed"
			bottom="30px"
			right="30px"
			zIndex={9999}
			cursor="pointer"
			_hover={{ transform: "scale(1.1)" }}
			transition="all 0.2s"
			onClick={scrollToTop}
		/>
	);
}

export default ScrollToTop;
