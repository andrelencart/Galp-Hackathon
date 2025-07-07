'use client';

import { useEffect, useState } from "react";
import { Box, Flex, VStack, Text, OrderedList, ListItem } from "@chakra-ui/react";
import Header from "./Header";
import AuthBox from "./AuthBox";
import Image from "next/image";
import { Suspense } from "react";

const images = [
  "/running.jpg",
  "/womandancing.jpg",
  "/womanwalking.jpg"
];

function getRandomIndex(exclude) {
  let idx = Math.floor(Math.random() * images.length);
  while (images.length > 1 && idx === exclude) {
    idx = Math.floor(Math.random() * images.length);
  }
  return idx;
}

export default function SubmitPage() {
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setImgIdx(prev => getRandomIndex(prev));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

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
          <Box
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            bg="rgba(0,0,0,0.5)"
            zIndex={1}
          />
          <Image
            src={images[imgIdx]}
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
            <AuthBox type="submit" />
          </Suspense>
        </Box>
      </Flex>
    </Flex>
  );
}