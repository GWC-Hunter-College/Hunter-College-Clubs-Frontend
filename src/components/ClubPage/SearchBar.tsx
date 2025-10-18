import { Flex, TextInput, Button, rem } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

export default function SearchBar({ placeholder = "Search clubs...", onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  return (
    <Flex gap="md" align="center" mt="lg" justify="center">
      {/* Input with icon */}
      <TextInput
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
        placeholder={placeholder}
        radius="xl"
        rightSection={<IconSearch size={rem(18)} color="white" />}
        styles={{
          input: {
            backgroundColor: "#2F283D", // dark background
            border: "2px solid white",
            color: "white",
            fontFamily: "Roboto Mono, monospace",
            fontWeight: 500,
            fontSize: "16px",
            height: "3rem",
            width: "600px",
            "::placeholder": { color: "#BFBFBF" },
          },
          section: { pointerEvents: "none" },
        }}
      />

      {/* Search Button */}
      <Button
        radius="xl"
        variant="outline"
        size="md"
        onClick={() => onSearch(query)}
        style={{
          border: "2px solid white",
          color: "white",
          fontFamily: "Roboto Mono, monospace",
          fontWeight: 700,
          fontStyle: "italic",
          letterSpacing: "0.5px",
          height: "3rem",
          padding: "0 2rem",
        }}
      >
        SEARCH
      </Button>
    </Flex>
  );
}
