// import { Flex, Box, Stack } from "@mantine/core";
// import { Flex, Text, Divider, Box} from "@mantine/core";
import { Flex, Box} from "@mantine/core";
import MyClubs from "../components/HomePage/MyClubs";
import Admin from "../components/HomePage/Admin";
import Heading from "../components/HomePage/Heading"
import Hero from "../components/HomePage/Hero"
// import EventCard from "../components/HomePage/EventCard"
// import Section from "../components/HomePage/Section"
// import View from "../components/HomePage/View"
// import logo from "../assets/logo.png";
// import flyer from "../assets/card.png"; 
// import { useState } from "react";
import EventList from "../components/Events/EventList";


export default function Home() {
    // const [active, setActive] = useState("My Clubs");
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
            
            
            {/* Micahel you work here */}
            <Box py="lg">
                <EventList
                    title="Upcoming Events"
                    views={["guh"]}
                    // onChangeView={}
                    events={[]}
                />
            </Box>
        </Flex>
    );
}
