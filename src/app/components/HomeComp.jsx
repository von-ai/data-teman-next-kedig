'use client';
import { AddCircle } from 'iconsax-react';
import DataComp from './DataComp';
import { Header } from './Header';
import { useEffect } from 'react';

const HomeComp = () => {
  return (
    <>
      <section>
        <Header />
        <div className="main">
          <div className="md:p-4 flex justify-between items-center mb-2">
            <h1 className="text-[1.6rem] md:text-[2rem] font-bold">
              Welcome to home
            </h1>
            <a href="/tambahData">
              <div className="md:block hidden">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                  Tambah data
                </button>
              </div>
              <div className="md:hidden block">
                <AddCircle size="32" color="#312e81" />
              </div>
            </a>
          </div>
          <div>
            <DataComp />
          </div>
        </div>
        {/* <Analytics /> */}
      </section>
    </>
  );
};
export default HomeComp;
