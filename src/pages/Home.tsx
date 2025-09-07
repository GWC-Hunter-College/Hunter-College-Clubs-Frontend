// import { Flex, Box, Stack } from "@mantine/core";
import { Flex } from "@mantine/core";
import MyClubs from "../components/HomePage/MyClubs"
import Admin from "../components/HomePage/Admin"
import Heading from "../components/HomePage/Heading"
import Hero from "../components/HomePage/Hero"

export default function Home() {
    return (
        
        <Flex gap="2rem" direction="row" align="stretch">

            <Flex direction="row" gap="2rem">
                <Heading />
                <Hero />
            </Flex>

            <Flex gap= "2rem" direction="column" align='stretch'>
                <MyClubs />
                <Admin />
            </Flex>

        </Flex>

    );
}
