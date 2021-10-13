import NavBar from "./NavBar";

const Page = ({ children }) => {
  return (
    <>
      <NavBar />
      <main className="w-full min-h-screen bg-gradient-to-b from-gray-700 to-gray-900">
        <div className="min-h-screen w-full bg-hv-gray-900 bg-opacity-50 py-20 px-10">
          {children}
        </div>
      </main>
    </>
  );
};

export default Page;
