// import { Flex, Box, Stack } from "@mantine/core";
import { Flex, Text, Divider } from "@mantine/core";
import MyClubs from "../components/HomePage/MyClubs";
import Admin from "../components/HomePage/Admin";
import Heading from "../components/HomePage/Heading"
import Hero from "../components/HomePage/Hero"
import EventCard from "../components/HomePage/EventCard"
import Section from "../components/HomePage/Section"
import View from "../components/HomePage/View"
import logo from "../assets/logo.png";
import flyer from "../assets/card.png"; 
import { useState } from "react";

export default function Home() {
    const [active, setActive] = useState("My Clubs");
    return (
        <Flex gap="5rem" direction="column" align="stretch" style={{ paddingTop: "3.5rem" }} > 
        
            <Flex gap="3rem" direction="row" align="stretch" >

                <Flex direction="row" gap="2rem">
                    <Heading />
                    <Hero />
                </Flex>

                <Flex gap= "2rem" direction="column" align='stretch'>
                    <MyClubs />
                    <Admin />
                </Flex>

            </Flex>
            <Flex align="center" gap="1rem">
                <Divider style={{ flex: 1, backgroundColor: "white", height: 2 }} />
                <Text
                fw={700}
                size="4.0625rem"
                style={{
                    fontFamily: "Roboto Mono, monospace",
                    textTransform: "uppercase",
                    color: "white",
                    letterSpacing: "2px",
                }}
                >
                Upcoming Events
                </Text>
                <Divider style={{ flex: 1, backgroundColor: "white", height: 2 }} />
            </Flex>
            <Flex gap="1rem">
                <View
                    label="My Clubs"
                    active={active === "My Clubs"}
                    onClick={() => setActive("My Clubs")}
                />
                <View
                    label="Global"
                    active={active === "Global"}
                    onClick={() => setActive("Global")}
                />
            </Flex>
            <Flex direction ="column" gap="2rem"> 
                <Section month="SEPTEMBER 2025"/>
                <Flex direction={{ base: "column", md: "row" }}  gap="2rem" align="center" justify="center"  wrap="wrap" >
                    <EventCard logo={logo} flyer={flyer} />
                    <EventCard logo={logo} flyer={flyer} />
                    <EventCard logo={logo} flyer={flyer} />

                </Flex>
            </Flex>

            <Flex direction ="column" gap="2rem"> 
                <Section month="OCTOBER 2025"/>
                <Flex direction={{ base: "column", md: "row" }}  gap="2rem" align="center" justify="center"  wrap="wrap" >
                    <EventCard logo={logo} flyer={flyer} />
                    <EventCard logo={logo} flyer={flyer} />
                    <EventCard logo={logo} flyer={flyer} />
                </Flex>
            </Flex>
        </Flex>
    );
}
