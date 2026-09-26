import type { MantineThemeOverride } from "@mantine/core";

// Mantine primitives (Menu, Popover, Modal, inputs) themed to the redesign tokens.
// Bespoke components (buttons, cards, pills, ...) are built directly in src/components/ui
// against the CSS custom properties in src/styles/tokens.css instead of Mantine's variants.
export const theme: MantineThemeOverride = {
  fontFamily: "Inter, sans-serif",
  fontFamilyMonospace: "'Roboto Mono', monospace",
  headings: { fontFamily: "'Roboto Mono', monospace", fontWeight: "700" },
  primaryColor: "grape",
  defaultRadius: "md",
  components: {
    Menu: {
      styles: {
        dropdown: {
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-menu)",
          padding: "var(--space-2)",
        },
        item: {
          borderRadius: "var(--radius-md)",
          color: "var(--text-primary)",
        },
        itemLabel: { fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14 },
        divider: { borderColor: "var(--border-subtle)" },
      },
    },
    Popover: {
      styles: {
        dropdown: {
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-menu)",
        },
      },
    },
    Modal: {
      styles: {
        content: {
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--radius-xl)",
        },
        header: { backgroundColor: "transparent" },
      },
    },
    TextInput: {
      styles: {
        input: {
          backgroundColor: "var(--bg-input)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)",
          color: "var(--text-primary)",
        },
      },
    },
    Textarea: {
      styles: {
        input: {
          backgroundColor: "var(--bg-input)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)",
          color: "var(--text-primary)",
        },
      },
    },
  },
};
