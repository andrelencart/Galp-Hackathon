'use client';

import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Progress,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Center,
  CircularProgress,
  CircularProgressLabel,
  Divider,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

// Dummy data
const userLevel = 7;
const userProgress = 50; // percent
const millionProgress = 73; // percent (towards 1.000.000, e.g., 730,000/1,000,000)
const userName = "João da Silva";
const userDistrict = "Lisboa";
const userPersonalRank = 12;
const userDistrictRank = 3;

export default function ProfilePage() {
  const router = useRouter();
  const barBg = useColorModeValue("orange.100", "orange.800");
  const accent = useColorModeValue("orange.400", "orange.300");

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.800")}>
      {/* Header */}
      <Box px={8} py={4} boxShadow="sm" bg="white">
        <Flex align="center" justify="space-between">
          <Heading size="lg" color={accent} letterSpacing="tight">
            Perfil do Utilizador
          </Heading>
          <Button colorScheme="orange" onClick={() => router.push("/")}>
            Terminar Sessão
          </Button>
        </Flex>
      </Box>

      <Box maxW="1100px" mx="auto" mt={8} px={[2, 4]}>
        <Flex gap={6} direction={["column", "row"]}>
          {/* Left column: Progress + Rankings */}
          <Box flex="2" minW={["100%", "380px"]}>
            <Flex align="center" gap={8} mb={4} position="relative">
              {/* 50% Circular Progress with Level */}
              <Center position="relative" w="110px" h="110px">
                <CircularProgress
                  value={userProgress}
                  size="110px"
                  thickness="12px"
                  color="orange.400"
                  capIsRound
                  trackColor={barBg}
                  style={{ borderTopLeftRadius: "110px", borderBottomLeftRadius: "110px" }}
                  // only show 50% of circle by masking
                />
                {/* Mask left half */}
                <Box
                  position="absolute"
                  left={0}
                  top={0}
                  w="55px"
                  h="110px"
                  bg={useColorModeValue("gray.50", "gray.800")}
                  borderLeftRadius="55px"
                  zIndex={2}
                />
                {/* Level number */}
                <Center
                  position="absolute"
                  left="0"
                  top="0"
                  w="110px"
                  h="110px"
                  pointerEvents="none"
                  zIndex={3}
                >
                  <VStack spacing={-1}>
                    <Text fontSize="xl" fontWeight="bold" color={accent}>
                      {userLevel}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      Nível
                    </Text>
                  </VStack>
                </Center>
              </Center>

              {/* Top right: Buttons and Progress */}
              <VStack align="start" spacing={4} flex="1">
                <Button
                  colorScheme="orange"
                  size="lg"
                  w={["100%", "230px"]}
                  onClick={() => router.push("/submit")}
                >
                  Submeter Corrida
                </Button>
                <Box w={["100%", "230px"]}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                    Progresso para 1.000.000 Kms
                  </Text>
                  <Progress
                    value={millionProgress}
                    colorScheme="orange"
                    size="md"
                    borderRadius="md"
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {Math.floor((millionProgress / 100) * 1000000).toLocaleString("pt-PT")} / 1.000.000 Kms
                  </Text>
                </Box>
              </VStack>
            </Flex>

            {/* Rankings Card */}
            <Box
              mt={2}
              bg="white"
              p={6}
              borderRadius="xl"
              boxShadow="md"
              minH="260px"
              position="relative"
            >
              <Tabs variant="enclosed">
                <TabList>
                  <Tab>Ranking Pessoal</Tab>
                  <Tab>Ranking Distrito</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold">Nome:</Text>
                      <Text mb={2}>{userName}</Text>
                      <Text fontWeight="bold">Ranking Pessoal:</Text>
                      <Text mb={2}>{userPersonalRank}º</Text>
                      {/* Add more personal stats here */}
                    </VStack>
                  </TabPanel>
                  <TabPanel>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold">Distrito:</Text>
                      <Text mb={2}>{userDistrict}</Text>
                      <Text fontWeight="bold">Ranking Distrito:</Text>
                      <Text mb={2}>{userDistrictRank}º</Text>
                      {/* Add more district stats here */}
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Box>

          {/* Right column */}
          <Flex flex="1" direction="column" justify="flex-end" minW={["100%", "220px"]}>
            <Box
              ml={[0, 8]}
              mt={[8, 0]}
              mb={2}
              minH="210px"
              bg="white"
              p={6}
              borderRadius="xl"
              boxShadow="md"
              alignSelf={["stretch", "flex-end"]}
            >
              {/* Empty square for future content */}
            </Box>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}