import Link from "next/link";

const NavBar = () => {
  return (
    <div className="fixed w-full h-16 bg-black bg-opacity-50 backdrop-filter backdrop-blur-md flex flex-row align-center justify-between p-5 z-10">
      <Link href="/">
        <a className="text-white">heliumvote.com</a>
      </Link>
    </div>
  );
};

export default NavBar;
