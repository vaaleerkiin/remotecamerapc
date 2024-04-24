"use client";
import { Link } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { BsFillArrowLeftSquareFill } from "react-icons/bs";

export const BackButton = () => {
  const router = useRouter();
  return (
    <Link
      display="inline-flex"
      alignItems="center"
      gap={1}
      fontSize={18}
      onClick={() => router.back()}
    >
      Back <BsFillArrowLeftSquareFill />
    </Link>
  );
};
