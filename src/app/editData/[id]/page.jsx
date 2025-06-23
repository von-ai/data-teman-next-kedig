'use client';
import { useParams } from 'next/navigation';
import EditDataComp from './EditDataComp';
import { BackHomeButton } from '@/app/components/BackHomeButton';

const EditData = () => {
  const { id } = useParams();

  if (!id) {
    return (
      <p className="text-center mt-10 text-gray-600 text-lg animate-pulse">
        Memuat halaman...
      </p>
    );
  }

  return (
    <>
      <h1 className="text-[1.8rem] md:text-[2rem] font-semibold text-center mt-4 md:mt-10 md:mb-10">
        Edit Data Temanmu
      </h1>
      <EditDataComp id={id} />
      <br />
      <BackHomeButton />
    </>
  );
};

export default EditData;
