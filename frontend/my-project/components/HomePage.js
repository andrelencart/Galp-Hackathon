'use client';

import {
  Box,
  Flex,
  Image,
  VStack,
  Link as ChakraLink,
} from "@chakra-ui/react";
import Header from "./Header";
import AuthBox from "./AuthBox";

export default function HomePage() {
  return (
    <Flex direction="column" minH="100vh">
      <Header />
      <Flex flex={1} direction={{ base: "column", md: "row" }} w="100%" h="100%">
        {/* Left Side */}
        <Box
          flex={1}
          bg="brand.light"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minH={{ base: "200px", md: "100vh" }}
          px={4}
          py={8}
        >
          <VStack spacing={8} align="center" w="100%">
            <Image
              src="/placeholder.png"
              alt="Placeholder"
              boxSize={{ base: "120px", md: "180px" }}
              objectFit="contain"
              mx="auto"
            />
            <ol style={{ color: "#B57219", fontSize: "md", width: "100%" }}>
              <li>
                <ChakraLink href="#" color="brand.orange">
                  Passo 1: Lorem Ipsum
                </ChakraLink>
              </li>
              <li>
                <ChakraLink href="#" color="brand.orange">
                  Passo 2: Dolor Sit
                </ChakraLink>
              </li>
              <li>
                <ChakraLink href="#" color="brand.orange">
                  Passo 3: Amet Consectetur
                </ChakraLink>
              </li>
            </ol>
          </VStack>
        </Box>
        {/* Right Side */}
        <Box
          flex={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="white"
          minH={{ base: "300px", md: "100vh" }}
          px={4}
          py={8}
        >
          <AuthBox type="main" />
        </Box>
      </Flex>
    </Flex>
  );
}