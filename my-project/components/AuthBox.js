'use client';

import {
  Box,
  VStack,
  Heading,
  Input,
  Button,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function AuthBox({ type = "main" }) {
  const router = useRouter();

  if (type === "main") {
    return (
      <VStack spacing={6} w="100%" maxW="sm" mx="auto">
        <Button colorScheme="orange" w="100%" onClick={() => router.push("/login")}>
          Login
        </Button>
        <Button variant="outline" colorScheme="orange" w="100%" onClick={() => router.push("/register")}>
          Criar conta
        </Button>
      </VStack>
    );
  }

  if (type === "login") {
    return (
      <Box as="form" w="100%" maxW="sm" mx="auto" p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
        <VStack spacing={4}>
          <Heading size="md">Entrar</Heading>
          <Input placeholder="Email" type="email" />
          <Input placeholder="Password" type="password" />
          <Button colorScheme="orange" w="100%">
            Login
          </Button>
          <Text>
            Não tem conta?{" "}
            <ChakraLink color="brand.orange" onClick={() => router.push("/register")}>
              Registe-se
            </ChakraLink>
          </Text>
        </VStack>
      </Box>
    );
  }

  if (type === "register") {
    return (
      <Box as="form" w="100%" maxW="sm" mx="auto" p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
        <VStack spacing={4}>
          <Heading size="md">Criar Conta</Heading>
          <Input placeholder="Nome" />
          <Input placeholder="Email" type="email" />
          <Input placeholder="Password" type="password" />
          <Button colorScheme="orange" w="100%">
            Registar
          </Button>
          <Text>
            Já tem conta?{" "}
            <ChakraLink color="brand.orange" onClick={() => router.push("/login")}>
              Entrar
            </ChakraLink>
          </Text>
        </VStack>
      </Box>
    );
  }

  if (type === "submit") {
    return (
      <Box w="100%" maxW="sm" mx="auto" p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
        <VStack spacing={4}>
          <Heading size="md">Submeter</Heading>
          <Input placeholder="Título" />
          <Input placeholder="Descrição" />
          <Button colorScheme="orange" w="100%">
            Submeter
          </Button>
        </VStack>
      </Box>
    );
  }

  return null;
}