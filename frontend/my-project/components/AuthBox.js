'use client';

import {
  Box,
  VStack,
  Heading,
  Input,
  Button,
  Text,
  Link as ChakraLink,
  Select,
  Radio,
  RadioGroup,
  Stack,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { districts, councilsByDistrict } from "../utils/portugal.js";
import { useToast } from "@chakra-ui/react";
import { registerUser, loginUser, submitRun } from "../utils/api"

const countryList = [
  "Portugal",
  "Espanha",
  "Mocambique",
  "Angola",
  "Cabo Verde",
  "Brasil",
];

export default function AuthBox({ type = "main" }) {
  const router = useRouter();
  const toast = useToast();

  // COMMON FORM FIELDS
  const [isGalpWorker, setIsGalpWorker] = useState("no");
  const [country, setCountry] = useState("Portugal");
  const [district, setDistrict] = useState("");
  const [council, setCouncil] = useState("");
  const [email, setEmail] = useState("");

  // REGISTER ONLY
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // SUBMIT ONLY (Kms field)
  const [kms, setKms] = useState("");
  const [steps, setSteps] = useState("");
  const [distanceType, setDistanceType] = useState("kms");
  // Calendar fields
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const districtOptions = districts;
  const councilOptions = district ? councilsByDistrict[district] || [] : [];
  const showDistrictCouncil = country === "Portugal";
  const passwordsMatch = password === confirmPassword || (!password && !confirmPassword);

  function handleCountryChange(e) {
    setCountry(e.target.value);
    if (e.target.value !== "Portugal") {
      setDistrict("");
      setCouncil("");
    }
  }
  function handleDistrictChange(e) {
    setDistrict(e.target.value);
    setCouncil("");
  }

  function handleKmsChange(e) {
    // Only allow numbers and at most one decimal point
    let value = e.target.value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    setKms(value);
  }

  // --- MAIN PAGE ---
  if (type === "main") {
    return (
      <Box as="form" w="100%" maxW="sm" mx="auto" p={8} borderWidth={1} borderRadius="lg" boxShadow="0 4px 12px 0 #ED893655">
        <VStack spacing={6}>
          <Button colorScheme="orange" w="100%" onClick={() => router.push("/login")}>
            Login
          </Button>
          <Button colorScheme="orange" w="100%" onClick={() => router.push("/submit")}>
            Submeter sem Login
          </Button>
          <Button variant="outline" colorScheme="orange" w="100%" onClick={() => router.push("/register")}>
            Criar conta
          </Button>
        </VStack>
      </Box>
    );
  }

  // --- LOGIN PAGE ---
  const handleLogin = async (e) => {
	  e.preventDefault();
    try {
      const data = await loginUser(email, password);
      toast({
        title: "Login bem-sucedido!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/"); // or wherever you want to redirect
    } catch (err) {
		toast({
        title: "Erro no login",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
	});
}
};

if (type === "login") {
    return (
      <Box as="form" onSubmit={handleLogin} w="100%" maxW="sm" mx="auto" p={8} borderWidth={1} borderRadius="lg" boxShadow="0 4px 12px 0 #ED893655">
        <VStack spacing={4}>
          <Heading size="md">Entrar</Heading>
          <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button colorScheme="orange" w="100%" type="submit">
            Login
          </Button>
          <Button colorScheme="orange" w="100%" onClick={() => window.location.href = "http://localhost:5000/google/login"}>
            Utilizar conta Google
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

  // --- REGISTER PAGE ---
  if (type === "register") {
   async function handleSubmit(e) {
  e.preventDefault();
  setSubmitted(true);
  if (!passwordsMatch) return;
  try {
   await registerUser(
      name,
      email,
      password,
      isGalpWorker === "yes" ? country : "Portugal",
      district,
      council
    );
    // Show success toast
    toast({
      title: "Registo feito com sucesso!",
      description: "Pode agora fazer login.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });
    // Optionally redirect to login after a short delay:
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch (err) {
    // Show error toast
    toast({
      title: "Erro no registo",
      description: err.message,
      status: "error",
      duration: 4000,
      isClosable: true,
    });
  }
}

    return (
      <Box
        as="form"
        onSubmit={handleSubmit}
        w="100%"
        maxW="sm"
        mx="auto"
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="0 4px 12px 0 #ED893655"
      >
        <VStack spacing={4} align="stretch">
          <Heading size="md" textAlign="center">
            Criar Conta
          </Heading>
          <FormControl>
            <FormLabel>E trabalhador da Galp?</FormLabel>
            <RadioGroup value={isGalpWorker} onChange={setIsGalpWorker}>
              <Stack direction="row">
                <Radio value="yes" colorScheme="orange">Sim</Radio>
                <Radio value="no" colorScheme="orange">Não</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          <Input placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />
          <Input
            placeholder={isGalpWorker === "yes" ? "Email Galp" : "Email"}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <FormControl isRequired>
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired isInvalid={submitted && !passwordsMatch}>
            <Input
              placeholder="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            <FormErrorMessage>Passwords nao sao iguais</FormErrorMessage>
          </FormControl>
          {isGalpWorker === "yes" && (
            <FormControl>
              <FormLabel>País</FormLabel>
              <Select value={country} onChange={handleCountryChange}>
                {countryList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </FormControl>
          )}
          {showDistrictCouncil && (
            <>
              <FormControl>
                <FormLabel>Distrito</FormLabel>
                <Select
                  placeholder="Selecione o distrito"
                  value={district}
                  onChange={handleDistrictChange}
                >
                  {districtOptions.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Concelho</FormLabel>
                <Select
                  placeholder="Selecione o concelho"
                  value={council}
                  onChange={e => setCouncil(e.target.value)}
                  isDisabled={!district}
                >
                  {councilOptions.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
          <Button type="submit" colorScheme="orange" w="100%" isDisabled={!passwordsMatch}>
            Registar
          </Button>
          <Text textAlign="center">
            Já tem conta?{" "}
            <ChakraLink color="brand.orange" onClick={() => router.push("/login")}>
              Entrar
            </ChakraLink>
          </Text>
        </VStack>
      </Box>
    );
  }

  // --- SUBMIT PAGE ---
  if (type === "submit") {
    const handleSubmit = async (e) => {
    e.preventDefault();
    const distance_km = distanceType === "kms" ? kms : null;
    const stepsValue = distanceType === "steps" ? steps : null;
  
    if (!distance_km && !stepsValue) {
      toast({
        title: "Preencha Kms ou Passos",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
  
    try {
      await submitRun(
        email,
        startDate,
        distance_km,
        stepsValue
      );
      toast({
        title: "Corrida submetida!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // Optionally reset fields or redirect here
    } catch (err) {
      toast({
        title: "Erro ao submeter corrida",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };


    return (
      <Box
        as="form"
        onSubmit={handleSubmit}
        w="100%"
        maxW="sm"
        mx="auto"
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="0 4px 12px 0 #ED893655"
      >
        <VStack spacing={4} align="stretch">
          <Heading size="md" textAlign="center">
            Submeter Corrida
          </Heading>
          <FormControl>
            <FormLabel>E trabalhador da Galp?</FormLabel>
            <RadioGroup value={isGalpWorker} onChange={setIsGalpWorker}>
              <Stack direction="row">
                <Radio value="yes" colorScheme="orange">Sim</Radio>
                <Radio value="no" colorScheme="orange">Não</Radio>
              </Stack>
            </RadioGroup>
          <FormControl>
            <FormLabel>Nome</FormLabel>
            <Input
              placeholder="Nome"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </FormControl>
          </FormControl>
          <Input
            placeholder={isGalpWorker === "yes" ? "Email Galp" : "Email"}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          {/* Kms field, only allow numbers and decimals */}
          <FormControl>
            <FormLabel>Tipo de registo</FormLabel>
            <RadioGroup value={distanceType} onChange={setDistanceType}>
              <Stack direction="row">
                <Radio value="kms" colorScheme="orange">Kms</Radio>
                <Radio value="steps" colorScheme="orange">Passos</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          
          {distanceType === "kms" && (
            <FormControl>
              <FormLabel>Kms Percorridos</FormLabel>
              <Input
                placeholder="Introduza os kms percorridos"
                value={kms}
                onChange={e => setKms(e.target.value.replace(/[^0-9.]/g, ""))}
                inputMode="decimal"
              />
            </FormControl>
          )}
          
          {distanceType === "steps" && (
            <FormControl>
              <FormLabel>Passos Percorridos</FormLabel>
              <Input
                placeholder="Introduza o número de passos"
                value={steps}
                onChange={e => setSteps(e.target.value.replace(/\D/, ""))}
                inputMode="numeric"
              />
            </FormControl>
          )}

          {/* Calendar booking style date range */}
          <FormControl>
            <FormLabel>Data de Início</FormLabel>
            <Input
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={e => setStartDate(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Data de Fim</FormLabel>
            <Input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={e => setEndDate(e.target.value)}
            />
          </FormControl>
          {isGalpWorker === "yes" && (
            <FormControl>
              <FormLabel>País</FormLabel>
              <Select value={country} onChange={handleCountryChange}>
                {countryList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </FormControl>
          )}
          {showDistrictCouncil && (
            <>
              <FormControl>
                <FormLabel>Distrito</FormLabel>
                <Select
                  placeholder="Selecione o distrito"
                  value={district}
                  onChange={handleDistrictChange}
                >
                  {districtOptions.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Concelho</FormLabel>
                <Select
                  placeholder="Selecione o concelho"
                  value={council}
                  onChange={e => setCouncil(e.target.value)}
                  isDisabled={!district}
                >
                  {councilOptions.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
          <Button type="submit" colorScheme="orange" w="100%">
            Submeter
          </Button>
          <Text textAlign="center">
            Já tem conta?{" "}
            <ChakraLink color="brand.orange" onClick={() => router.push("/login")}>
              Entrar
            </ChakraLink>
          </Text>
        </VStack>
      </Box>
    );
  }

  return null;
}

