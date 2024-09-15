import styles from './HomePage.module.css';
import { Link } from 'react-router-dom';

export default function HomePage({ user }) {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Welcome to AppTrackr</h1>
          <h2 className={styles.subtitle}>Your Futuristic Job Tracker</h2>
          <p className={styles.heroText}>
            Organize and manage your job applications with cutting-edge KanBan technology. Stay ahead with AppTrackr.
          </p>
          <img className={styles.heroImage} src="/path/to/your-image.jpg" alt="AppTrackr Hero" />
          {user ? (
            <div className={styles.buttonGroup}>
              <Link to='/board' className={styles.ctaButton}>Go to Job Board</Link>
              <Link to='/board/new' className={styles.ctaButton}>Add a Job Application</Link>
            </div>
          ) : (
            <div className={styles.buttonGroup}>
              <Link to="/login" className={styles.ctaButton}>Log In</Link>
              <Link to="/signup" className={styles.ctaButton}>Sign Up</Link>
            </div>
          )}
        </div>
      </section>

      <section className={styles.features}>
        <h2 className={styles.featuresTitle}>Why Choose AppTrackr?</h2>
        <div className={styles.featureList}>
          <div className={styles.featureItem}>
            <h3>Advanced Organization</h3>
            <p>Visualize and manage your job applications with our state-of-the-art KanBan board.</p>
          </div>
          <div className={styles.featureItem}>
            <h3>Deadline Management</h3>
            <p>Stay ahead of deadlines with our intelligent tracking system.</p>
          </div>
          <div className={styles.featureItem}>
            <h3>In-Depth Notes</h3>
            <p>Keep detailed and actionable notes for each application to enhance your search.</p>
          </div>
          <div className={styles.featureItem}>
            <h3>Customizable Workflow</h3>
            <p>Adapt the board to your unique job search process with advanced customization options.</p>
          </div>
        </div>
      </section>

      <section className={styles.testimonials}>
        <h2 className={styles.testimonialsTitle}>What Our Users Say</h2>
        <div className={styles.testimonialList}>
          <div className={styles.testimonialItem}>
            <p>"AppTrackr's futuristic design made managing my job applications a breeze!"</p>
            <p className={styles.testimonialAuthor}>- Jane Doe, Software Engineer</p>
          </div>
          <div className={styles.testimonialItem}>
            <p>"The sleek interface and powerful features set AppTrackr apart from the rest."</p>
            <p className={styles.testimonialAuthor}>- John Smith, Product Manager</p>
          </div>
          <div className={styles.testimonialItem}>
            <p>"Without AppTrackr, I would never have become a tech lead right out of bootcamp!"</p>
            <p className={styles.testimonialAuthor}>- Gregg Lichinsky, Technical Lead</p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Jomir Uddin &copy; 2024</p>
      </footer>
    </div>
  );
}
