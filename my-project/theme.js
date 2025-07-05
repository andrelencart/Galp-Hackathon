import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    orange: "#FF5A00",
    dark: "#BE2E00",
    light: "#FFD6BC",
    deep: "#7A1400",
  },
  black: "#000",
};

const fonts = {
  body: `'Ping L', sans-serif`,
  heading: `'Ping L', sans-serif`,
};

const fontSizes = {
  sm: "14px",
  md: "16px",
};

const theme = extendTheme({
  colors,
  fonts,
  fontSizes,
  styles: {
    global: {
      "html, body, #__next": {
        bg: "white",
        color: "black",
        minH: "100vh",
        minW: "100vw",
      },
    },
  },
});

export default theme;