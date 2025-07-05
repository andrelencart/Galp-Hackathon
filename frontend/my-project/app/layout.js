import ChakraProviders from "../components/ChakraProviders";

export const metadata = {
  title: "Todos os Passos Contam",
  description: "A Next.js & Chakra UI Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ChakraProviders>{children}</ChakraProviders>
      </body>
    </html>
  );
}