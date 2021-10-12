const Page = ({ children }) => {
  return (
    <main className="w-full h-full py-20 px-10">
      <div className="max-w-7xl mx-auto bg-gray-100 p-5">{children}</div>
    </main>
  );
};

export default Page;
