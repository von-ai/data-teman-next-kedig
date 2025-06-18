import Image from 'next/image';
import styles from './page.module.css';
import LoginComp from './components/LoginComp';

export default function Home() {
  return (
    <main>
      <LoginComp />
    </main>
  );
}
