import Link from "next/link";

const NavBar = () => {
  return (
    <div className="fixed w-full h-16 bg-black bg-opacity-50 backdrop-filter backdrop-blur-md flex flex-row align-center justify-between p-5 z-10">
      <Link href="/">
        <a className="text-white flex items-center justify-start">
          <img className="w-5 h-5 mr-1" src="/images/logo.svg" />
          Vote
        </a>
      </Link>
    </div>
  );
};

export default NavBar;
