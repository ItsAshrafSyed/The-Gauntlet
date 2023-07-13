import {
	Box,
	HStack,
	Text,
	VStack,
	Image,
	Card,
	Button,
	CardHeader,
	CardBody,
	IconButton,
	Input,
	InputGroup,
	Icon,
	Center,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Flex,
	InputLeftElement,
	Spacer,
} from "@chakra-ui/react";
import { ChevronDownIcon, Search2Icon } from "@chakra-ui/icons";
import { DailyChallenge } from "../../../components/DailyChallenge";

export default function Challenges() {
	return (
		<Box position={"relative"}>
			<DailyChallenge />
			<Box m="32">
				<HStack>
					<Button
						variant="link"
						color={"white"}
						fontSize={24}
						fontWeight={"500"}
					>
						All
					</Button>
					{/* <Text
						color={"white"}
						fontSize={24}
						fontWeight={"500"}
						fontFamily={"Inter"}
					>
						/
					</Text>
					<Button
						variant="link"
						color={"white"}
						fontSize={24}
						fontWeight={"500"}
					>
						Sol Socail Club
					</Button>
					<Text
						color={"white"}
						fontSize={24}
						fontWeight={"500"}
						fontFamily={"Inter"}
					>
						/
					</Text>
					<Button
						variant="link"
						color={"white"}
						fontSize={24}
						fontWeight={"500"}
					>
						New York Hacker House
					</Button> */}
				</HStack>
				<HStack mt={"7"} spacing={4} position={"absolute"}>
					<Box>
						<InputGroup>
							<InputLeftElement
								width={10}
								height={10}
								// eslint-disable-next-line react/no-children-prop
								children={<Search2Icon color={"#848895"} />}
							/>
							<Input
								fontSize={16}
								fontWeight={400}
								fontFamily={"Inter"}
								width={"45vh"}
								placeholder="Search Challenges"
								backgroundColor={"#111"}
								borderRadius={"16"}
								border={"1px solid var(--grey, #848895)"}
							/>
						</InputGroup>
					</Box>
					<Box>
						<Menu>
							<MenuButton
								fontSize={16}
								fontWeight={400}
								width={"33vh"}
								color={"white"}
								fontFamily={"Inter"}
								placeholder="Search Challenges"
								backgroundColor={"#111"}
								borderRadius={"16"}
								border={"1px solid var(--grey, #848895)"}
								as={Button}
								rightIcon={<ChevronDownIcon />}
							>
								All Categories
							</MenuButton>
							<MenuList>
								<MenuItem>Download</MenuItem>
							</MenuList>
						</Menu>
					</Box>
					<Box>
						<Menu>
							<MenuButton
								fontSize={16}
								fontWeight={400}
								width={"33vh"}
								color={"white"}
								fontFamily={"Inter"}
								placeholder="Search Challenges"
								backgroundColor={"#111"}
								borderRadius={"16"}
								border={"1px solid var(--grey, #848895)"}
								as={Button}
								rightIcon={<ChevronDownIcon />}
							>
								All Difficulties
							</MenuButton>
							<MenuList>
								<MenuItem>Download</MenuItem>
							</MenuList>
						</Menu>
					</Box>
				</HStack>
			</Box>
			<Card
				mx={"32"}
				position={"absolute"}
				color={"white"}
				width={"80vw"}
				height={"60vh"}
				borderRadius={"16"}
				border={"1px solid var(--grey, #848895)"}
				backgroundColor={"#111"}
			>
				<Text>dynamic data from db</Text>
			</Card>
		</Box>
	);
}
