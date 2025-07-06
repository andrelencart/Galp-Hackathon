'use client';

import {
  Box,
  Flex,
  Image,
  VStack,
  OrderedList,
  ListItem,
  Text,
} from "@chakra-ui/react";
import Header from "./Header";
import AuthBox from "./AuthBox";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <Flex
      direction="column"
      minH="100svh"
      h="100svh"
      overflow="hidden"
    >
      <Header />
      <Flex
        flex="1 1 0%"
        direction={{ base: "column", md: "row" }}
        w="100vw"
        h="100%"
        minH="0"
        overflow="hidden"
      >
        {/* Caixa do lado esquerdo */}
        <Box
          flex="1 1 0%"
          position="relative"
          minH="0"
          h="100%"
          w="100%"
          overflow="hidden"
        >
          {/* Imagem de background */}
          <Image
            src="/placeholder.png"
            alt="Placeholder"
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            objectFit="cover"
            zIndex={0}
            pointerEvents="none"
          />
          {/* Overlay de background para melhorar a leitura*/}
          <Box
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            bg="rgba(0,0,0,0.2)"
            zIndex={1}
          />
          {/* Conteudo */}
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
               bg="white"
               borderRadius="lg"
               boxShadow="lg"
               p={8}
               w="100%"
               maxW="400px"
               mx="auto"
               textAlign="center"
               zIndex={3}
             >
               <Text color="#FF7900" fontWeight="bold" fontSize="24px" textAlign="center" w="100%">
                 Como participar?
               </Text>
               <OrderedList color="#FF7900" fontSize="md" spacing={3} textAlign="left" w="100%" mt={4}>
                 <ListItem>
                   <Text color="#FF7900" fontWeight="bold">
                     Faça Login ou carregue em Submeter corrida sem login.
                   </Text>
                 </ListItem>
                 <ListItem>
                   <Text color="#FF7900" fontWeight="bold">
                     Preencha todos os campos e dê upload de um comprovativo fotográfico.
                   </Text>
                 </ListItem>
                 <ListItem>
                   <Text color="#FF7900" fontWeight="bold">
                     Por cada Km percorrido uma refeição será doada.
                   </Text>
                 </ListItem>
               </OrderedList>
             </Box>
           </VStack>
          </Flex>
        </Box>
        {/*Lado Direito*/}
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
           <AuthBox type="/" />
          </Suspense>
        </Box>
      </Flex>
    </Flex>
  );
}