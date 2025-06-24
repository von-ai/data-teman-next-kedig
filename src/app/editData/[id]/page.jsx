'use client';
import { useParams } from 'next/navigation';
import EditDataComp from './EditDataComp';
// import { BackHomeButton } from '@/app/components/BackHomeButton';

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
      <EditDataComp id={id} />
    </>
  );
};

export default EditData;
