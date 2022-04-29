import { GetStaticProps } from 'next';
import Head from 'next/head';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import { FiCalendar, FiUser } from 'react-icons/fi';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | posts</title>
      </Head>
      <main className={commonStyles.container}>
        <section className={commonStyles.content}>
          <img
            className={commonStyles.logo}
            src="/images/logo.svg"
            alt="logo"
          />
          <div className={styles.post}>
            <a href="#">Como utilizar Hooks</a>
            <h2>Pensando em sincronização em vez de ciclos de vida.</h2>
            <div>
              <span>
                <FiCalendar size={20} />
                15 Mar 2021
              </span>
              <span>
                <FiUser size={20} />
                Hudson de Carvalho
              </span>
            </div>
          </div>

          <div className={styles.post}>
            <a href="#">Criando um app CRA do zero</a>
            <h2>
              Tudo sobre como criar a sua primeira aplicação utilizando Create
              React App
            </h2>
            <div>
              <span>
                <FiCalendar size={20} />
                19 Abr 2021
              </span>
              <span>
                <FiUser size={20} />
                João da Silva
              </span>
            </div>
          </div>

          <a className={styles.morePosts} href="#">
            Carregar mais posts
          </a>
        </section>
      </main>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient({});
//   // const postsResponse = await prismic.getByType(TODO);

//   // TODO
// };
