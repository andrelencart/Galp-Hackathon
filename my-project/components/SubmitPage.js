'use client';

import { Box, Flex } from "@chakra-ui/react";
import Header from "./Header";
import AuthBox from "./AuthBox";

export default function SubmitPage() {
  return (
    <Flex direction="column" minH="100vh">
      <Header />
      <Flex flex={1} direction={{ base: "column", md: "row" }} w="100%" h="100%">
        <Box flex={1} bg="brand.light" />
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
          <AuthBox type="submit" />
        </Box>
      </Flex>
    </Flex>
  );
}