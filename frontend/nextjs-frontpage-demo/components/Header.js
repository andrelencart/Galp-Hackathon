'use client';
import { useEffect, useRef, useState } from 'react';
import styles from '../styles/header.module.css';
import DropdownMenu from './DropdownMenu';
import Image from 'next/image';

export default function Header() {
  const [show, setShow] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 10) {
        setShow(true);
        lastScrollY.current = window.scrollY;
        return;
      }
      if (window.scrollY > lastScrollY.current) {
        // Scroll down
        setShow(false);
      } else {
        // Scroll up
        setShow(true);
      }
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${show ? styles.show : styles.hide}`}>
      <div className={styles.logoArea}>
        <Image src="/public/TOCP.png" alt="Logo" width={48} height={48} />
      </div>
      <div className={styles.titleArea}>
        <h1 className={styles.title}>Todos os Passos Contam</h1>
      </div>
      <div className={styles.menuArea}>
        <DropdownMenu />
      </div>
    </header>
  );
}