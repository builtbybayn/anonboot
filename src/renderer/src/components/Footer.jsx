import styles from './Footer.module.css'
import footerLogo from '../assets/anonboot-vector-lightblue-min.svg'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.divider}></div>
      <img src={footerLogo} className={styles.watermark} alt="" />
    </footer>
  )
}

export default Footer