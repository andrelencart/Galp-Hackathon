'use client';
import { useState } from 'react';
import Header from '../../components/Header';
import styles from '../../styles/register.module.css';
import { useRouter } from 'next/navigation';
import { districts, councilsByDistrict } from '../../utils/portugal-zones';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    district: '',
    council: '',
  });

  // Update fields
  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // When a district is selected, reset council as well
  function handleDistrictChange(e) {
    setForm({
      ...form,
      district: e.target.value,
      council: '', // reset council when district changes
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert('Registration submitted:\n' + JSON.stringify(form, null, 2));
    // Add your registration logic here
  }

  function goToLogin() {
    router.push('/login');
  }

  return (
    <div className={styles.pageWrap}>
      <Header />
      <div className={styles.centerRow}>
        <form className={styles.registerBox} onSubmit={handleSubmit}>
          <h2 className={styles.title}>Register</h2>

          <input
            className={styles.input}
            name="firstname"
            type="text"
            value={form.firstname}
            onChange={onChange}
            placeholder="First Name"
            required
          />
          <input
            className={styles.input}
            name="lastname"
            type="text"
            value={form.lastname}
            onChange={onChange}
            placeholder="Last Name"
            required
          />
          <input
            className={styles.input}
            name="username"
            type="text"
            value={form.username}
            onChange={onChange}
            placeholder="Username"
            required
          />
          <input
            className={styles.input}
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="Email"
            required
          />
          <input
            className={styles.input}
            name="phone"
            type="tel"
            value={form.phone}
            onChange={onChange}
            placeholder="Phone Number"
            required
          />

          {/* District dropdown */}
          <select
            className={styles.input}
            name="district"
            value={form.district}
            onChange={handleDistrictChange}
            required
          >
            <option value="" disabled>
              Select District
            </option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>

          {/* Council dropdown */}
          <select
            className={styles.input}
            name="council"
            value={form.council}
            onChange={onChange}
            required
            disabled={!form.district}
          >
            <option value="" disabled>
              Select Council
            </option>
            {form.district &&
              councilsByDistrict[form.district]?.map((council) => (
                <option key={council} value={council}>
                  {council}
                </option>
              ))}
          </select>

          <input
            className={styles.input}
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            placeholder="Password"
            required
          />
          <input
            className={styles.input}
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={onChange}
            placeholder="Confirm Password"
            required
          />
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.confirmBtn}>
              Confirm Registration
            </button>
            <button
              type="button"
              className={styles.backBtn}
              onClick={goToLogin}
            >
              Go Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}