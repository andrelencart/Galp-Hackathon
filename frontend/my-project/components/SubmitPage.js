'use client';

import { Box, Flex, VStack, Text, OrderedList, ListItem } from "@chakra-ui/react";
import Header from "./Header";
import AuthBox from "./AuthBox";
import Image from "next/image";
import { Suspense } from "react";

export default function SubmitPage() {
  return (
    <Flex direction="column" minH="100vh" h="100vh" overflow="hidden">
      <Header />
      <Flex flex={1} direction={{ base: "column", md: "row" }} w="100vw" h="100%" minH="0" overflow="hidden">
        {/* Left Side with background image and instructions */}
        <Box
          flex="1 1 0%"
          position="relative"
          minH="0"
          h="100%"
          w="100%"
          overflow="hidden"
          display={{ base: "none", md: "block" }}
        >
          {/* Background image */}
          <Image
            src="/placeholder.png"
            alt="Placeholder"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 0,
              pointerEvents: "none"
            }}
            width={1200}
            height={1200}
            priority
          />
          <Box
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            bg="rgba(0,0,0,0.2)"
            zIndex={1}
          />
          <Flex
            position="absolute"
            zIndex={2}
            w="100%"
            h="100%"
            align="center"
            justify="center"
            top={0}
            left={0}
          >
            <VStack
              spacing={8}
              align="center"
              w="100%"
              maxW="md"
              px={{ base: 6, md: 12 }}
            >
              <Text color="white" fontWeight="bold" fontSize="24px" textAlign="center" w="100%">
                Como participar?
              </Text>
              <OrderedList color="white" fontSize="md" spacing={3} textAlign="left" w="100%">
                <ListItem>
                  <Text color="white" fontWeight="bold">
                    Faça Login ou carregue em Submeter corrida sem login.
                  </Text>
                </ListItem>
                <ListItem>
                  <Text color="white" fontWeight="bold">
                    Preencha todos os campos e dê upload de um comprovativo fotográfico.
                  </Text>
                </ListItem>
                <ListItem>
                  <Text color="white" fontWeight="bold">
                    Por cada Km percorrido uma refeição será doada.
                  </Text>
                </ListItem>
              </OrderedList>
            </VStack>
          </Flex>
        </Box>
        {/* Right Side - AuthBox */}
        <Box
          flex="1 1 0%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="white"
          minH="0"
          h="100%"
          px={4}
          py={8}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <AuthBox type="submit" />
          </Suspense>
        </Box>
      </Flex>
    </Flex>
  );
}