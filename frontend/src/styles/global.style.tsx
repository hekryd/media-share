import { Global } from "@mantine/core";

const GlobalStyle = () => {
  return (
    <Global
      styles={(theme) => ({
        a: {
          color: "inherit",
          textDecoration: "none",
        },
        // Legacy header styles (scoped)
        ".legacy-hr *": {
          transition: "all 0.3s ease",
          position: "relative",
        },
        ".legacy-hr header": {
          backgroundColor: "#fff",
          display: "block",
          position: "fixed",
          width: "100%",
          zIndex: 2,
          top: 0,
          transform: "translate3d(0, 0, 0)",
          fontFamily: 'Trebuchet MS, Helvetica, sans-serif',
          fontSize: 17,
          lineHeight: "30.6px",
        },
        ".legacy-hr header > hr": {
          border: 0,
          borderTop: "1px solid",
          borderColor: "rgba(221, 221, 197, 0.7)",
        },
        ".legacy-hr .site-header": {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: 100,
        },
        // Mantine header typography
        ".mantine-Header-root": {
          fontFamily: 'Trebuchet MS, Helvetica, sans-serif',
          fontSize: 17,
          lineHeight: "30.6px",
        },
        ".legacy-hr .site-header-inner:hover": {
          cursor: "pointer",
        },
        ".legacy-hr .header-nav-list > li": {
          display: "inline",
        },
        ".legacy-hr .header-nav-list > li > a": {
          padding: "0 15px",
          color: "#7f7f7f",
          fontWeight: 500,
          letterSpacing: "0.6px",
        },
        ".legacy-hr #menu": {
          width: "0vw",
          height: "calc(100vh - 100px)",
          position: "fixed",
          top: 80,
          background: "#fff",
          zIndex: 4,
          opacity: 0,
          textAlign: "end",
          padding: 0,
          paddingRight: "7%",
          WebkitFontSmoothing: "antialiased",
        },
        ".legacy-hr .header-nav a, .legacy-hr #menu a": {
          color: "#7f7f7f",
        },
        ".legacy-hr .header-nav a:hover, .legacy-hr #menu a:hover": {
          color: "#0164c6",
        },
        ".legacy-hr #menuToggle": {
          display: "none",
          position: "relative",
          userSelect: "none",
          WebkitUserSelect: "none",
        },
        ".legacy-hr .bar1, .legacy-hr .bar2, .legacy-hr .bar3": {
          width: 24,
          height: 2,
          background: "#8c8c8c",
          marginBottom: 6,
          transition: "0.4s",
        },
        ".legacy-hr .change .bar1": {
          transform: "rotate(45deg) translate(3px, 9px)",
        },
        ".legacy-hr .change .bar2": { opacity: 0 },
        ".legacy-hr .change .bar3": {
          transform: "rotate(-45deg) translate(2px, -8px)",
        },
        "@media (max-width: 1000px)": {
          ".legacy-hr .header-nav": { display: "none" },
          ".legacy-hr #menuToggle": { display: "block" },
        },
        footer: {
          fontSize: "12.75px",
          lineHeight: "22.95px",
          backgroundColor: "#edefef",
          color: "#4a4a4a",
          marginTop: 60,
          fontFamily: 'Trebuchet MS, Helvetica, sans-serif',
        },
        "footer ul": {
          padding: 0,
        },
        ".footer-content": {
          padding: "60px 0 20px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        },
        ".footer-content li": {
          display: "inline",
        },
        ".indent": {
          maxWidth: "90%",
          margin: "0 auto",
          width: 1200,
        },
        // Ensure there is always scroll to reach the footer
        body: {
          minHeight: `calc(100vh + var(--footer-height, 0px))`,
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
      })}
    />
  );
};
export default GlobalStyle;
