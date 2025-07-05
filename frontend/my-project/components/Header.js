'use client';

import { Flex, Box, Text, IconButton } from "@chakra-ui/react";
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
      bg="white"
      boxShadow="sm"
      minH="60px"
    >
      <Box
        cursor="pointer"
        onClick={() => router.push("/")}
        display="flex"
        alignItems="center"
      >
        <Text fontSize="lg" fontWeight="bold" color="brand.orange">
          LOGO
        </Text>
      </Box>
      <Menu>
        <MenuButton as={IconButton} icon={<ChevronDownIcon />} variant="outline" colorScheme="orange">
          Sobre nós
        </MenuButton>
        <MenuList>
          <MenuItem>Parceiros</MenuItem>
          <MenuItem>Missão</MenuItem>
          <MenuItem>Contactos</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}