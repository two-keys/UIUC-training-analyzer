import Head from 'next/head';
import styles from '../styles/App.module.css';
import Divider from './Divider';
import UploadForm from './UploadForm';

function Main(props) {

    return (
        <div className={styles.container}>
            <Head>
                <title>Tony's UIUC Training App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <header className={styles.header} style={{width: '100%'}}>
                <h1 className={styles.title}>
                    Training Analyzer frontend
                </h1>
                <p className={styles.description}>
                    Upload a file, select a mode, and then hit submit.
                </p>
                <UploadForm />
                <Divider />
            </header>

            <main>
                {props.children}
            </main>

            <footer style={{width: '100%'}}>
                <Divider />
            </footer>
        </div>
    )
};

export default Main;