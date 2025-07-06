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
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { districts, councilsByDistrict } from "../utils/portugal.js";

// Helper to format yyyy-mm-dd to dd/mm/yyyy
function formatDateDMY(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

// DateRangePicker using Chakra Popover and 2 date fields, closes only after both are selected or reset
function DateRangeField({ value, onChange }) {
  const [temp, setTemp] = useState({ start: value?.start || "", end: value?.end || "" });
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
    setTemp((prev) => {
      const updated = { ...prev, [name]: val };
      // If both dates are picked and end >= start, commit and close
      if (updated.start && updated.end && updated.end >= updated.start) {
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

  // Value shown in field
  const displayValue =
    value?.start && value?.end
      ? `${formatDateDMY(value.start)} até ${formatDateDMY(value.end)}`
      : value?.start
        ? `${formatDateDMY(value.start)} até ...`
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
              value={temp.start}
              max={temp.end || undefined}
              onChange={handleChange}
              autoFocus
            />
            <FormLabel fontSize="sm" mb={0}>Data de fim</FormLabel>
            <Input
              type="date"
              name="end"
              value={temp.end}
              min={temp.start || undefined}
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
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

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
  if (type === "login") {
    return (
      <Box as="form" w="100%" maxW="sm" mx="auto" p={8} borderWidth={1} borderRadius="lg" boxShadow="0 4px 12px 0 #ED893655">
        <VStack spacing={4}>
          <Heading size="md">Entrar</Heading>
          <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button colorScheme="orange" w="100%">
            Login
          </Button>
          <Button colorScheme="orange" w="100%">
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
    function handleSubmit(e) {
      e.preventDefault();
      setSubmitted(true);
      if (!passwordsMatch) return;
      // Registration logic here
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
    function handleSubmit(e) {
      e.preventDefault();
      // Submission logic here
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
          <Input
            placeholder={isGalpWorker === "yes" ? "Email Galp" : "Email"}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          {/* Kms field, only allow numbers and decimals */}
          <FormControl>
            <FormLabel>Kms Percorridos</FormLabel>
            <Input
              placeholder="Introduza os kms percorridos"
              value={kms}
              onChange={handleKmsChange}
              inputMode="decimal"
            />
          </FormControl>
          {/* Single booking-style date range field */}
          <FormControl>
            <FormLabel>Data da Corrida (início e fim)</FormLabel>
            <DateRangeField value={dateRange} onChange={setDateRange} />
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