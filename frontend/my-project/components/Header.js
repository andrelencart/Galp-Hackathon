'use client';

import { Flex, Box, IconButton, Image } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/menu";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  return (
    <Flex
      as="header"
      w="100%"
      align="center"
      justify="space-between"
      px={{ base: 4, md: 8 }}
      py={4}
      bg="#EDE9DF"
      boxShadow="sm"
      height="80px"
    >
      <Box
        cursor="pointer"
        onClick={() => router.push("/")}
        display="flex"
        alignItems="center"
        margin="0"
      >
        <Image
          src="/logo.png"
          alt="Logo"
          height="80px"
          width="auto"
          objectFit="contain"
        />
      </Box>
      <Menu>
        <MenuButton text="Sobre nos" as={IconButton} icon={<ChevronDownIcon />} variant="outline" colorScheme="orange" aria-label="Sobre nós" />
        <MenuList>
          <MenuItem>Parceiros</MenuItem>
          <MenuItem>Missão</MenuItem>
          <MenuItem>Contactos</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}