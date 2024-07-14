
import styles from "./page.module.css";
import { HomeInputComponent } from "./components";


export default function Home() {
  return (
    <main className={styles.main}>
      <HomeInputComponent/>
    </main>
  );
}
