import Header from '../components/Header';
import styles from '../styles/home.module.css';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className={styles.fullscreen}>
      <Header />
      <main className={styles.main}>
        <div className={styles.centeredContent}>
          <h2 className={styles.pageTitle}>Todos os passos contam</h2>
          <ol className={styles.instructions}>
            <li>Faca login ou use o registo rapido.</li>
            <li>Insira os Km / passos com um comprovativo de APP.</li>
            <li>Contribua com uma refeicao por cada Km percorrido.</li>
          </ol>
          <div className={styles.buttonRow}>
            <button className={styles.btn}>Login</button>
            <button className={styles.btn}>Login Google</button>
            <Link href="/login">
              <button className={styles.btn}>Registo rapido</button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}