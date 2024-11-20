import { Global } from "@mantine/core";

const GlobalStyle = () => {
  return (
    <Global
      styles={(theme) => ({
        a: {
          color: "inherit",
          textDecoration: "none",
        },
        "table.md, table.md th:nth-of-type(odd), table.md td:nth-of-type(odd)":
          {
            background:
              theme.colorScheme == "dark"
                ? "rgba(50, 50, 50, 0.5)"
                : "rgba(220, 220, 220, 0.5)",
          },
        "table.md td": {
          paddingLeft: "0.5em",
          paddingRight: "0.5em",
        },
        ".mantine-Modal-overlay": {
          backgroundColor: "transparent", // Remove the background color
        },
        ".sign-in-page > .mantine-Container-root": {
          marginLeft: "0", // Override margin for this page only
          marginTop: "0"
        },
        ".mantine-Container-root": {
            maxWidth: "none", // Override Mantine Container max-width
        },
      })}
    />
  );
};
export default GlobalStyle;
