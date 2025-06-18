import Link from 'next/link';

const Intoduction = () => {
  return (
    <section className="main flex flex-col justify-center items-center h-screen">
      <div>
        <h1 className="font-bold text-5xl text-center">
          Welcome to Data Teman📝
        </h1>
        <h3 className="text-2xl text-center">Yuk Arsip Data Teman kamu!</h3>
      </div>
      <div>
        <Link href="#">
          <button className="mt-6 w-auto h-auto text-2xl bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-600 transition">
            Let's Get Started!
          </button>
        </Link>
      </div>
    </section>
  );
};

export default Intoduction;
