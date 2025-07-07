"use client";

import {
  Box,
  Flex,
  Text,
  Button,
  CircularProgress,
  CircularProgressLabel,
  VStack,
  useBreakpointValue,
  Progress,
  Heading,
} from "@chakra-ui/react";
import Header from "./Header";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";

const username = "André";

function useFirstTimeUser(user) {
  const [firstTime, setFirstTime] = useState(true);

  useEffect(() => {
    const key = `hasVisited_${user}`;
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem(key)) {
        setFirstTime(false);
      } else {
        window.localStorage.setItem(key, "yes");
        setFirstTime(true);
      }
    }
  }, [user]);

  return firstTime;
}

function usePersonalBest(user) {
  return {
    distance: 15.8,
    unit: "Km",
    date: "12/11/2025",
  };
}

export default function ProfilePage() {
  const userLevel = 3;
  const expPercent = 65;
  const mealsGiven = 15;
  const mealsTotal = 1000000;
  const mealsProgress = mealsGiven / mealsTotal;

  const router = useRouter();

  const peopleData = [
    { name: "Henrique Reis", score: 23 },
    { name: "André Lencart", score: 18.9 },
    { name: "Diogo Gouveia", score: 15.8 },
    { name: "Renato Mota", score: 13.6 },
  ];
  const districtData = [
    { name: "Lisboa", score: 50123 },
    { name: "Porto", score: 49123 },
    { name: "Setúbal", score: 40123 },
    { name: "Santarém", score: 38100 },
  ];

  const leftColRef = useRef(null);
  const [leftColHeight, setLeftColHeight] = useState(0);

  const circleSize = useBreakpointValue({ base: "120px", md: "160px", lg: "180px" });
  const ringBoxWidth = useBreakpointValue({ base: "140px", md: "180px" });
  const leaderboardBoxWidth = useBreakpointValue({ base: "95vw", md: "370px" });
  const progressBarWidth =
    useBreakpointValue({ base: "95vw", md: `${2 * 370 + 32}px` }) || "772px";
  const buttonWidth =
    typeof progressBarWidth === "string"
      ? `calc(${progressBarWidth} - ${ringBoxWidth} - 32px)`
      : progressBarWidth - (parseInt(ringBoxWidth, 10) || 180) - 32;
  const rightBoxExtra = useBreakpointValue({ base: 32, md: 48, lg: 56 });

  const firstTime = useFirstTimeUser(username);
  const personalBest = usePersonalBest(username);

  function formatDate(date) {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d)) return date;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  useEffect(() => {
    function setHeight() {
      if (leftColRef.current) {
        setLeftColHeight(leftColRef.current.offsetHeight);
      }
    }
    setHeight();
    window.addEventListener("resize", setHeight);
    return () => window.removeEventListener("resize", setHeight);
  }, []);

  return (
    <Box
      minH="100dvh"
      minW="100vw"
      bg="white"
      overflow="hidden"
      style={{ height: "100dvh", boxSizing: "border-box" }}
    >
      <Header />
      <Flex
        direction="column"
        w="100%"
        minH="calc(100dvh - 80px)"
        maxH="calc(100dvh - 80px)"
        align="center"
        justify="center"
        px={[2, 4, 10]}
        pt={[2, 4]}
        pb={[2, 4]}
        overflow="hidden"
      >
        <Flex
          direction={["column", "row"]}
          w="100%"
          maxW="1400px"
          flex={1}
          mx="auto"
          align="center"
          justify="center"
          gap={[8, 12, 20]}
          overflow="hidden"
        >
          <Flex
            ref={leftColRef}
            direction="column"
            align="center"
            flex="1 1 0"
            maxW={["100%", "880px"]}
            minW={["100%", "600px", "650px"]}
            overflow="hidden"
          >
            <Flex
              direction="row"
              align="center"
              justify="center"
              w={progressBarWidth}
              mb={8}
              gap={8}
            >
              <Box
                minW={ringBoxWidth}
                maxW={ringBoxWidth}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <CircularProgress
                  value={expPercent}
                  size={circleSize}
                  thickness="10px"
                  color="#F6731B"
                  trackColor="#FDE9D8"
                  capIsRound
                >
                  <CircularProgressLabel>
                    <VStack spacing={0}>
                      <Text fontSize={["2xl", "3xl"]} color="#A45B18" fontWeight="bold">
                        {userLevel}
                      </Text>
                      <Text fontSize={["xs", "sm"]} color="#83532B" fontWeight="semibold">
                        Nível
                      </Text>
                    </VStack>
                  </CircularProgressLabel>
                </CircularProgress>
              </Box>
              <Link href="/submit" passHref>
                <Button
                  as="a"
                  colorScheme="orange"
                  borderRadius="xl"
                  size="xl"
                  fontWeight="bold"
                  w={buttonWidth}
                  minW="180px"
                  maxW="100%"
                  h={["60px", "80px"]}
                  fontSize={["xl", "2xl"]}
                  boxShadow="lg"
                  alignSelf="center"
                >
                  Submeter Corrida
                </Button>
              </Link>
            </Flex>
            <Box
              w={progressBarWidth}
              maxW={progressBarWidth}
              minW={progressBarWidth}
              mb={10}
              bg="white"
              alignSelf="center"
            >
              <Text fontSize={["sm", "md"]} mb={1} color="#83532B" fontWeight="bold">
                Refeições doadas
              </Text>
              <Progress
                value={mealsProgress * 100}
                size="lg"
                colorScheme="orange"
                bg="#FDE9D8"
                borderRadius="xl"
                h="18px"
                w="100%"
              />
              <Flex justify="space-between" mt={1}>
                <Text fontSize="xs" color="#83532B" fontWeight="bold">
                  0
                </Text>
                <Text fontSize="xs" color="#83532B" fontWeight="bold">
                  1.000.000
                </Text>
              </Flex>
            </Box>
            <Flex
              direction={["column", "row"]}
              w={progressBarWidth}
              justify="center"
              align="stretch"
              gap={[5, 8, 8]}
              mb={[10, 0]}
              overflow="hidden"
            >
              <LeaderboardBox title="Ranking Individual" data={peopleData} highlight="DKingues (You)" />
              <LeaderboardBox title="Ranking Distritos" data={districtData} highlight="Your District" />
            </Flex>
          </Flex>
          <Flex
            flex="1 1 0"
            maxW={["100%", "350px"]}
            minW={["100%", "300px", "350px"]}
            align="center"
            justify="center"
            overflow="hidden"
          >
            <Box
              bg="#FDE9D8"
              borderRadius="2xl"
              boxShadow="lg"
              w="100%"
              maxW={["100%", "350px"]}
              minH={[
                leftColHeight
                  ? `${leftColHeight + (rightBoxExtra || 40)}px`
                  : "180px",
              ]}
              h={[
                null,
                leftColHeight
                  ? `${leftColHeight + (rightBoxExtra || 40)}px`
                  : "auto",
              ]}
              ml={[0, 0, 0]}
              mt={[10, 0, 0]}
              p={[6, 10]}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="space-between"
              transition="min-height 0.2s"
              overflow="hidden"
            >
              <Box w="100%" textAlign="center" pt={2}>
                <Text color="#A45B18" fontWeight="bold" fontSize="xl" mb={5}>
                  {firstTime
                    ? `Bem vindo ${username}!`
                    : `Bem vindo de volta ${username}!`}
                </Text>
                <Box
                  mt={4}
                  mb={8}
                  w="100%"
                  maxW="340px"
                  mx="auto"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text
                    color="#A45B18"
                    fontWeight="semibold"
                    fontSize="lg"
                    mb={6}
                    textAlign="center"
                  >
                    Informação pessoal
                  </Text>
                  <Text
                    color="#83532B"
                    fontWeight="medium"
                    fontSize="md"
                    mb={1}
                    textAlign="center"
                  >
                    Refeicoes doadas
                  </Text>
                  <Text
                    color="#A45B18"
                    fontSize="3xl"
                    fontWeight="bold"
                    mb={6}
                    textAlign="center"
                  >
                    {mealsGiven}
                  </Text>
                  <Text
                    color="#83532B"
                    fontWeight="medium"
                    fontSize="md"
                    mb={1}
                    textAlign="center"
                  >
                    Melhor Corrida
                  </Text>
                  <Text
                    color="#F6731B"
                    fontSize="2xl"
                    fontWeight="bold"
                    mt={1}
                    textAlign="center"
                  >
                    {personalBest.distance}{personalBest.unit}
                  </Text>
                  <Text
                    color="#83532B"
                    fontSize="md"
                    mt={1}
                    mb={2}
                    textAlign="center"
                  >
                    {personalBest.date ? formatDate(personalBest.date) : ""}
                  </Text>
                </Box>
                <VStack w="100%" maxW="300px" mx="auto" spacing={3} mb={3}>
                  <Button
                    leftIcon={<span style={{ fontSize: "1.2em" }}>🏅</span>}
                    colorScheme="orange"
                    variant="solid"
                    fontWeight="bold"
                    w="100%"
                    onClick={() => router.push("/achievements")}
                  >
                    Ver Conquistas
                  </Button>
                  <Button
                    colorScheme="orange"
                    variant="outline"
                    fontWeight="bold"
                    w="100%"
                    onClick={() => router.push("/conta")}
                  >
                    Conta
                  </Button>
                  <Button
                    colorScheme="orange"
                    variant="outline"
                    fontWeight="bold"
                    w="100%"
                    onClick={() => router.push("/registo-corridas")}
                  >
                    Registo de Corridas
                  </Button>
                  <Button
                    colorScheme="orange"
                    variant="outline"
                    fontWeight="bold"
                    w="100%"
                    onClick={() => router.push("/login")}
                  >
                    Terminar Sessão
                  </Button>
                </VStack>
              </Box>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}

function LeaderboardBox({ title, data, highlight }) {
  const leaderboardBoxWidth = useBreakpointValue({ base: "95vw", md: "370px" });

  return (
    <Box
      bg="#FDE9D8"
      borderRadius="2xl"
      boxShadow="md"
      minW={leaderboardBoxWidth}
      maxW={leaderboardBoxWidth}
      minH="260px"
      p={[3, 5, 6]}
      mx="auto"
      mb={[5, 0]}
      flex="1"
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      overflow="hidden"
    >
      <Heading as="h3" size="md" mb={4} color="#A45B18" textAlign="center">
        {title}
      </Heading>
      <VStack align="stretch" spacing={2} flex="1">
        {data.map((entry, idx) => (
          <Flex
            key={entry.name}
            justify="space-between"
            align="center"
            bg={entry.name === highlight ? "#F6731B22" : "transparent"}
            px={3}
            py={2}
            borderRadius="md"
          >
            <Text
              fontWeight={entry.name === highlight ? "bold" : "normal"}
              color="#A45B18"
              fontSize={["md", "lg"]}
            >
              {idx + 1}. {entry.name}
            </Text>
            <Text fontWeight="bold" color="#A45B18" fontSize={["md", "lg"]}>
              {entry.score.toLocaleString()}
            </Text>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
}