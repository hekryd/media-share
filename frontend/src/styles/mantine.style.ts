import { MantineThemeOverride } from "@mantine/core";

export default <MantineThemeOverride>{
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
        // Mantine default is 62rem (roughly 992px) for lg; force a custom size token
        size: "xl",
      },
      styles: (theme, _params, { size }) => ({
        root: {
          ...(size === "xl" && { maxWidth: 1200 }),
        },
      }),
    },
  },
};
