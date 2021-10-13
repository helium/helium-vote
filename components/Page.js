import NavBar from "./NavBar";

const Page = ({ children }) => {
  return (
    <>
      <NavBar />
      <main className="w-full min-h-screen bg-gradient-to-b from-hv-gray-700 to-hv-turquoise-700">
        <div className="min-h-screen w-full bg-hv-gray-900 bg-opacity-50 py-20 px-10">
          {children}
        </div>
      </main>
    </>
  );
};

export default Page;
