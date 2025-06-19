import Image from 'next/image';
import styles from './page.module.css';
import LoginComp from './components/LoginComp';
import Intoduction from './pages/Introduction';

export default function Home() {
  return (
    <main>
      <Intoduction />
    </main>
  );
}
