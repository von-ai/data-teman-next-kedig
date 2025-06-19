import { BackHomeButton } from '../components/BackHomeButton';
import EditDataComp from '../components/EditDataComp';

const EditData = () => {
  return (
    <>
      <h1 className="text-[1.8rem] md:text-[2rem] font-semibold text-center mt-4 md:mt-10 md:mb-10">
        Edit Data Temanmu
      </h1>
      <EditDataComp />
      <br />
      <BackHomeButton />
    </>
  );
};
export default EditData;
