'use client';

import { Box, Flex, VStack, Text, OrderedList, ListItem } from "@chakra-ui/react";
import Image from "next/image";
import Header from "./Header";
import AuthBox from "./AuthBox";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <Flex direction="column" minH="100vh" h="100vh" overflow="hidden">
      <Header />
      <Flex flex={1} direction={{ base: "column", md: "row" }} w="100vw" h="100%" minH="0" overflow="hidden">
        <Box
          flex="1 1 0%"
          position="relative"
          minH="0"
          h="100%"
          w="100%"
          overflow="hidden"
          display={{ base: "none", md: "block" }}
        >
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
              <Box
               bg="rgba(0,0,0,0.7)"
               borderRadius="lg"
               boxShadow="lg"
               p={8}
               w="100%"
               maxW="400px"
               mx="auto"
               textAlign="center"
               zIndex={3}
               border="2px solid"
               borderColor="#F6731B"
             >
               <Text color="#FFFFFF" fontWeight="bold" fontSize="24px" textAlign="center" w="100%">
                 Como participar?
               </Text>
               <OrderedList color="#FFFFFF" fontSize="md" spacing={3} textAlign="left" w="100%" mt={4}>
                 <ListItem>
                   <Text color="#FFFFFF" fontWeight="bold">
                     Faça Login ou carregue em Submeter corrida sem login.
                   </Text>
                 </ListItem>
                 <ListItem>
                   <Text color="#FFFFFF" fontWeight="bold">
                     Preencha todos os campos e dê upload de um comprovativo fotográfico.
                   </Text>
                 </ListItem>
                 <ListItem>
                   <Text color="#FFFFFF" fontWeight="bold">
                     Por cada Km percorrido uma refeição será doada.
                   </Text>
                 </ListItem>
               </OrderedList>
             </Box>
            </VStack>
          </Flex>
        </Box>
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
            <AuthBox type="register" />
          </Suspense>
        </Box>
      </Flex>
    </Flex>
  );
}