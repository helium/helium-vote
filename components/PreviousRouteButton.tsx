import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { BsChevronLeft } from "react-icons/bs";

const usePreviousRoute = () => {
  const { asPath } = useRouter();

  const ref = useRef<string | null>(null);

  useEffect(() => {
    ref.current = asPath;
  }, [asPath]);

  return ref.current;
};

const PreviousRouteBtn = () => {
  const lastUrl = usePreviousRoute()

  return (
    <Link
      href={lastUrl ? lastUrl : ""}
      className="default-transition flex items-center text-fgd-2 text-sm transition-all hover:text-fgd-3"
    >
      <BsChevronLeft className="h-6 w-6 " />
      Back
    </Link>
  );
};
export default PreviousRouteBtn;
