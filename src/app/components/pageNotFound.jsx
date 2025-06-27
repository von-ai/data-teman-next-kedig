import Link from "next/link";

export const PageNotFound = () => {
  return (
    <section className="flex flex-col items-center justify-center h-screen px-4 text-center main">
      <h1 className="text-6xl font-bold text-indigo-500">404</h1>
      <h2 className="mt-4 text-3xl font-semibold">
        Oops! Halaman tidak ditemukan
      </h2>
      <p className="mt-2 text-lg text-gray-600">
        Sepertinya kamu nyasar... Halaman yang kamu cari tidak tersedia.
      </p>
      <Link href="/home">
        <button className="px-6 py-2 mt-6 text-xl text-white transition bg-indigo-500 rounded hover:bg-indigo-600">
          Kembali ke Beranda
        </button>
      </Link>
    </section>
  );
};
