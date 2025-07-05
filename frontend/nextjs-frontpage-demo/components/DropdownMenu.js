'use client';
import { useState } from 'react';
import styles from '../styles/dropdownMenu.module.css';

export default function DropdownMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.dropdown}>
      <button
        className={styles.dropbtn}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        About Us &#x25BC;
      </button>
      {open && (
        <div className={styles.dropdownContent}>
          <a href="#">Missao</a>
          <a href="#">Parceiros</a>
          <a href="#">Contactos</a>
        </div>
      )}
    </div>
  );
}