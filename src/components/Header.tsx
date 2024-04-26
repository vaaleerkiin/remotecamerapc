import { Link } from "@chakra-ui/react";
import { HStack, Image } from "@chakra-ui/react";
import { Container } from "@chakra-ui/react";

export const Header = () => {
  return (
    <Container
      as="header"
      backgroundColor="#222126"
      h={68}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        maxW={1274}
        w="100%"
      >
        <Image
          src="https://scores.408dev.com/img/logo/logo.png"
          alt="logo"
          w={213}
          h={37}
        />
        <HStack p="5px">
          <Link href="/search" color="white">
            Search
          </Link>
          <Link href="/monitoring" color="white">
            Monitoring
          </Link>
        </HStack>
      </Container>
    </Container>
  );
};
