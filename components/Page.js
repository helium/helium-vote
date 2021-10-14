import NavBar from "./NavBar";

const Page = ({ children }) => {
  return (
    <>
      <NavBar />
      <main className="w-full min-h-screen">
        <div className="min-h-screen w-full bg-hv-gray-900 bg-opacity-40 pb-20 pt-px sm:py-20 px-0 sm:px-10">
          {children}
        </div>
      </main>
    </>
  );
};

export default Page;
