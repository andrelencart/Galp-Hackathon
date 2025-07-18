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
import { useState, useRef, useEffect } from "react";
import { districts, councilsByDistrict } from "../utils/portugal.js";
import { useToast } from "@chakra-ui/react";
import { registerUser, loginUser, submitRun, uploadProofImage, getGuestByEmail, getUserByEmail, createGuest } from "../utils/api";
import { useSearchParams } from "next/navigation";

function formatDateDMY(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function formatDateYMD(dateStr) {
  if (!dateStr) return "";
  const [d, m, y] = dateStr.split("/");
  return `${y}-${m}-${d}`;
}

function DateRangeField({ value, onChange }) {
  const [temp, setTemp] = useState({
    start: value?.start || "",
    end: value?.end || ""
  });
  const [isOpen, setIsOpen] = useState(false);
  const startRef = useRef(null);

  const handleOpen = () => {
    setTemp({ start: value?.start || "", end: value?.end || "" });
    setIsOpen(true);
    setTimeout(() => {
      if (startRef.current) startRef.current.focus();
    }, 50);
  };

  const handleChange = (e) => {
    const { name, value: val } = e.target;
    let formatted = "";
    if (val && val.match(/^\d{4}-\d{2}-\d{2}$/)) {
      formatted = formatDateDMY(val);
    }
    setTemp((prev) => {
      const updated = { ...prev, [name]: formatted };
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
  const [isGalpWorker, setIsGalpWorker] = useState("no");
  const [country, setCountry] = useState("Portugal");
  const [district, setDistrict] = useState("");
  const [council, setCouncil] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [kms, setKms] = useState("");
  const [steps, setSteps] = useState("");
  const [distanceType, setDistanceType] = useState("kms");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [guestId, setGuestId] = useState(null);
  const [group_type, setGroupType] = useState("");
  const [activity, setActivity] = useState("");

  // Calendar fields in dd/mm/yyyy
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const dateRange = { start: startDate, end: endDate };
  const searchParams = useSearchParams();
  const google_id = searchParams.get("google_id");
  const googleName = searchParams.get("name");
  const googleEmail = searchParams.get("email");
  const isGoogle = !!google_id;
  const [imageFile, setImageFile] = useState(null);
  const [extraMessage, setExtraMessage] = useState("");

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

  const kmsValue = parseFloat(kms);
  const stepsValueInt = parseInt(steps, 10);
  const showImageField =
    (distanceType === "kms" && !isNaN(kmsValue) && kmsValue >= 10) ||
    (distanceType === "steps" && !isNaN(stepsValueInt) && stepsValueInt >= 14000);

  const showExtraMessage =
    (distanceType === "kms" && !isNaN(kmsValue) && kmsValue >= 10) ||
    (distanceType === "steps" && !isNaN(stepsValueInt) && stepsValueInt >= 14000);

  function handleImageChange(e) {
    const file = e.target.files[0];
    setImageFile(file || null);
  }

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
      router.push("/profile"); // or wherever you want to redirect
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
          google_id
        );
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
  console.log("handleSubmit called"); 

  // Convert dd/mm/yyyy to yyyy-mm-dd for backend
  const backendStart = startDate ? formatDateYMD(startDate) : '';
  const backendEnd = endDate ? formatDateYMD(endDate) : '';

  const distance_km = distanceType === "kms" ? kms : null;
  const stepsValue = distanceType === "steps" ? steps : null;

  // 1. Validate distance
  if (!distance_km && !stepsValue) {
    toast({
      title: "Preencha Kms ou Passos",
      status: "warning",
      duration: 2000,
      isClosable: true,
    });
    return;
  }

  // 2. Check if user (profile) or guest exists, or create guest
  let guestId = null;
  let profileId = null;

  
  // 3. Handle image upload
  let image_url = null;
  if (imageFile) {
	  try {
      const result = await uploadProofImage({
		  imageFile,
		});
		image_url = result.image_url;
    } catch (err) {
		toast({
			title: "Erro ao carregar imagem",
			description: err.message,
			status: "error",
			duration: 3000,
			isClosable: true,
		});
		return;
    }
}

// 4. Submit the run
const profile = await getUserByEmail(email);
if (profile) {
  profileId = profile.id;
} else {
  const guest = await getGuestByEmail(email);
  if (guest) {
	guestId = guest.id;
  } else {
    console.log("Creating guest with:", { name, email, district, council, country });
    const newGuest = await createGuest({  name, email, district, council, country });
    guestId = newGuest.id;
  }
}
  try {
    await submitRun({
      run_email: email,
      name,
      country,
      district,
      council,
      group_type,
      activity,
      date: backendStart,
      distance_km,
      steps: stepsValue,
      image_url,
      valid: 1,
      guest_id: guestId,
      profile_id: profileId
    });
    toast({
      title: "Corrida submetida!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setImageFile(null);
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
          </FormControl>
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
          {showImageField && (
          <FormControl>
               <FormLabel>Anexe uma imagem como comprovativo</FormLabel>
               <input
                 type="file"
                 id="image-upload"
                 accept="image/*"
                 onChange={handleImageChange}
                 style={{ display: "none" }}
               />
               <Flex
                 as="label"
                 htmlFor="image-upload"
                 align="center"
                 justify="center"
                 borderWidth="1px"
                 borderRadius="md"
                 w="100%"
                 h="40px"
                 position="relative"
                 bg="white"
                 cursor="pointer"
                 tabIndex={0}
                 _hover={{ borderColor: "orange.400" }}
               >
                 <Text
                   color={imageFile ? "gray.800" : "gray.400"}
                   fontSize="sm"
                   w="100%"
                   textAlign="center"
                 >
                   {imageFile ? imageFile.name : "Nenhum ficheiro selecionado"}
                 </Text>
               </Flex>
             </FormControl>
           )}
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
        </VStack>
      </Box>
    );
  }

  return null;
}