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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  HStack,
  Flex,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { districts, councilsByDistrict } from "../utils/portugal.js";
import { useToast } from "@chakra-ui/react";
import { registerUser, loginUser, submitRun } from "../utils/api";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

// Helper to format yyyy-mm-dd to dd/mm/yyyy
function formatDateDMY(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

// Helper to format dd/mm/yyyy to yyyy-mm-dd
function formatDateYMD(dateStr) {
  if (!dateStr) return "";
  const [d, m, y] = dateStr.split("/");
  return `${y}-${m}-${d}`;
}

// DateRangePicker using Chakra Popover and 2 date fields, closes only after both are selected or reset
function DateRangeField({ value, onChange }) {
  // value is {start, end} in dd/mm/yyyy
  const [temp, setTemp] = useState({
    start: value?.start || "",
    end: value?.end || ""
  });
  const [isOpen, setIsOpen] = useState(false);
  const startRef = useRef(null);

  // Open popover and focus start input
  const handleOpen = () => {
    setTemp({ start: value?.start || "", end: value?.end || "" });
    setIsOpen(true);
    setTimeout(() => {
      if (startRef.current) startRef.current.focus();
    }, 50);
  };

  // When either start or end changes
  const handleChange = (e) => {
    const { name, value: val } = e.target;
    // Always convert to dd/mm/yyyy
    let formatted = "";
    if (val && val.match(/^\d{4}-\d{2}-\d{2}$/)) {
      formatted = formatDateDMY(val);
    }
    setTemp((prev) => {
      const updated = { ...prev, [name]: formatted };
      // If both dates are picked and end >= start, commit and close
      if (
        updated.start &&
        updated.end &&
        formatDateYMD(updated.end) >= formatDateYMD(updated.start)
      ) {
        onChange(updated);
        setIsOpen(false);
      }
      return updated;
    });
  };

  const handleClear = () => {
    setTemp({ start: "", end: "" });
    onChange({ start: "", end: "" });
    setIsOpen(false);
  };

  // Value shown in field - always dd/mm/yyyy
  const displayValue =
    value?.start && value?.end
      ? `${value.start} até ${value.end}`
      : value?.start
        ? `${value.start} até ...`
        : "";

  return (
    <Popover isOpen={isOpen} onClose={() => setIsOpen(false)} closeOnBlur>
      <PopoverTrigger>
        <Input
          readOnly
          placeholder="Selecionar data início e fim"
          value={displayValue}
          onClick={handleOpen}
          cursor="pointer"
          bg="white"
        />
      </PopoverTrigger>
      <PopoverContent w="250px">
        <PopoverArrow />
        <PopoverCloseButton onClick={handleClear} />
        <PopoverBody>
          <VStack spacing={3} align="stretch">
            <FormLabel fontSize="sm" mb={0}>Data de início</FormLabel>
            <Input
              type="date"
              name="start"
              ref={startRef}
              value={temp.start ? formatDateYMD(temp.start) : ""}
              max={temp.end ? formatDateYMD(temp.end) : undefined}
              onChange={handleChange}
              autoFocus
            />
            <FormLabel fontSize="sm" mb={0}>Data de fim</FormLabel>
            <Input
              type="date"
              name="end"
              value={temp.end ? formatDateYMD(temp.end) : ""}
              min={temp.start ? formatDateYMD(temp.start) : undefined}
              onChange={handleChange}
            />
            <Button onClick={handleClear} size="sm" mt={2} colorScheme="gray">Limpar</Button>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

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

  // SUBMIT ONLY (Kms field & date range state)
  const [kms, setKms] = useState("");
  const [steps, setSteps] = useState("");
  const [distanceType, setDistanceType] = useState("kms");
  // Calendar fields in dd/mm/yyyy
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const dateRange = { start: startDate, end: endDate };
  const searchParams = useSearchParams();
  const google_id = searchParams.get("google_id");
  const googleName = searchParams.get("name");
  const googleEmail = searchParams.get("email");
  const isGoogle = !!google_id;

  // Image upload for distance over threshold
  const [imageFile, setImageFile] = useState(null);

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
    let value = e.target.value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    setKms(value);
  }

  // Check if image field should appear
  const kmsValue = parseFloat(kms);
  const stepsValueInt = parseInt(steps, 10);
  const showImageField =
    (distanceType === "kms" && !isNaN(kmsValue) && kmsValue >= 10) ||
    (distanceType === "steps" && !isNaN(stepsValueInt) && stepsValueInt >= 14000);

  // File input is always present, but the UI is only visible if showImageField is true
  function handleImageChange(e) {
    const file = e.target.files[0];
    setImageFile(file || null);
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

useEffect(() => {
  if (isGoogle) {
    setName(googleName || "");
    setEmail(googleEmail || "");
    setPassword("");
    setConfirmPassword("");
  }
  // eslint-disable-next-line
}, [isGoogle, googleName, googleEmail]);

if (type === "register") {
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    if (!isGoogle && !passwordsMatch) return;
    try {
      await registerUser(
        name,
        email,
        isGoogle ? undefined : password,
        isGalpWorker === "yes" ? country : "Portugal",
        district,
        council,
        google_id // Add this param to your registerUser utility!
      );
      // Show success toast
      toast({
        title: "Registo feito com sucesso!",
        description: "Pode agora fazer login.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
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
    <Box as="form" onSubmit={handleSubmit} w="100%" maxW="sm" mx="auto" p={8} borderWidth={1} borderRadius="lg" boxShadow="0 4px 12px 0 #ED893655">
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
        <Input
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={isGoogle}
        />
        <Input
          placeholder={isGalpWorker === "yes" ? "Email Galp" : "Email"}
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={isGoogle}
        />
        {/* Only show password fields if NOT Google */}
        {!isGoogle && (
          <>
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
          </>
        )}
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
        <Button
          type="submit"
          colorScheme="orange"
          w="100%"
          isDisabled={!passwordsMatch && !isGoogle}
        >
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

      // Convert dd/mm/yyyy to yyyy-mm-dd for backend
      const backendStart = startDate ? formatDateYMD(startDate) : '';
      const backendEnd = endDate ? formatDateYMD(endDate) : '';

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
    await submitRun({
      run_email: email,
      name,
      country,
      district,
      council,
    //   group_type: groupType,
    //   activity,
      date: backendStart,
      distance_km,
      steps: stepsValue
    });
    toast({
      title: "Corrida submetida!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setImageFile(null); // Optional: reset image after submit
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

if (type === "submit") {
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
        </FormControl>
        {/* Nome field without label */}
        <Input
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <Input
          placeholder={isGalpWorker === "yes" ? "Email Galp" : "Email"}
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        {/* Kms/Passos fields and selector */}
        <HStack spacing={0} align="center" w="100%">
          <RadioGroup value={distanceType} onChange={setDistanceType}>
            <Stack direction="row" spacing={2} align="center">
              <Radio value="kms" colorScheme="orange">Kms</Radio>
              <Radio value="steps" colorScheme="orange">Passos</Radio>
            </Stack>
          </RadioGroup>
          {distanceType === "kms" && (
            <Input
              ml={3}
              placeholder="Kms percorridos"
              value={kms}
              onChange={e => setKms(e.target.value.replace(/[^0-9.]/g, ""))}
              inputMode="decimal"
              maxW="260px"
              w="100%"
              alignSelf="center"
              height="40px"
            />
          )}
          {distanceType === "steps" && (
            <Input
              ml={3}
              placeholder="Passos percorridos"
              value={steps}
              onChange={e => setSteps(e.target.value.replace(/\D/, ""))}
              inputMode="numeric"
              maxW="260px"
              w="100%"
              alignSelf="center"
              height="40px"
            />
          )}
        </HStack>
        {/* Calendar booking style date range */}
        <FormControl>
          <FormLabel>Data da Corrida (início e fim)</FormLabel>
          <DateRangeField
            value={dateRange}
            onChange={({ start, end }) => {
              setStartDate(start);
              setEndDate(end);
            }}
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