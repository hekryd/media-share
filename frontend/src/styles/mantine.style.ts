import { MantineThemeOverride } from "@mantine/core";

export default <MantineThemeOverride>{
  fontFamily: "Trebuchet MS, Helvetica, sans-serif",
  colors: {
    victoria: [
      "#E2E1F1",
      "#C2C0E7",
      "#A19DE4",
      "#7D76E8",
      "#544AF4",
      "#4940DE",
      "#4239C8",
      "#463FA8",
      "#47428E",
      "#464379",
    ],
  },
  primaryColor: "victoria",
  breakpoints: {
    xs: "36em",
    sm: "48em",
    md: "1024px",
    lg: "1280px",
    xl: "1440px",
  },
  components: {
    Modal: {
      styles: (theme) => ({
        title: {
          fontSize: theme.fontSizes.lg,
          fontWeight: 700,
        },
      }),
    },
    Container: {
      defaultProps: {
        size: "xl",
      },
      styles: (theme, _params, { size }) => ({
        root: {
          paddingLeft: 0,
          paddingRight: 0,
          ...(size === "xl" && { width: "90%", maxWidth: 1200 }),
        },
      }),
    },
  },
};
