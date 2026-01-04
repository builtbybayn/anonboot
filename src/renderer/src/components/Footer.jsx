import styles from './Footer.module.css'
import footerLogo from '../assets/anonboot-white-vector-merged-min.svg'
import { GithubIcon, HeartIcon, AboutIcon } from './Icons'

const Footer = ({ onOpenSupport }) => {
  return (
    <footer className={styles.footer}>
      <div className={styles.centerGroup}>
        <div className={styles.divider}></div>
        <div className={styles.linksRow}>
          <a
            href="https://github.com/builtbybayn"
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            <GithubIcon className={styles.icon} />
            <span>GitHub</span>
          </a>
          <a
            href="#"
            className={`${styles.link} ${styles.heartLink}`}
            onClick={(e) => {
              e.preventDefault()
              if (onOpenSupport) onOpenSupport()
            }}
          >
            <HeartIcon className={styles.icon} />
            <span>Support</span>
          </a>
          <a href="#" className={styles.link}>
            <AboutIcon className={styles.icon} />
            <span>About</span>
          </a>
        </div>
      </div>
      <div className={styles.logoContainer}>
        <img src={footerLogo} className={styles.watermark} alt="anonBOOT" />
      </div>
    </footer>
  )
}

export default Footer
