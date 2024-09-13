import styles from './HomePage.module.css';

export default function HomePage() {
  return (
    <>
      <h1 className={styles.title}>AppTrackr</h1>
      <h2 className={styles.subtitle}>Track Your Job Applications</h2>
      <img src="" alt="" />
      <p>Stay Organized in Your Job Search</p>
      <p>Track your job applications effortlessly with AppTrackr, your all-in-one job search KanBan board.</p>
      <button className={styles.button} >Sign up for free!</button>
    </>
  );
}
