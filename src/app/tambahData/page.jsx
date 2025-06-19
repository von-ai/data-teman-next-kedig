import AddData from '../components/AddData';
import { BackHomeButton } from '../components/BackHomeButton';

const TambahData = () => {
  return (
    <>
      <div className="main">
        {/* <BackHomeButton /> */}
        <h1 className="text-[1.8rem] md:text-[2rem] font-semibold text-center mt-10 mb-10">
          Masukkan Data Temanmu
        </h1>
        <AddData />
        <BackHomeButton />
        {/* <Analytics /> */}
      </div>
    </>
  );
};
export default TambahData;
