import { GetStaticProps } from 'next';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Link from 'next/link';
import Head from 'next/head';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import { FiCalendar, FiUser } from 'react-icons/fi';
import { useState } from 'react';

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
  const [posts, setPosts] = useState(postsPagination.results);
  const [morePosts, setMorePosts] = useState(postsPagination.next_page);

  async function handleMorePosts(): Promise<void> {
    const newPost = await fetch(postsPagination.next_page);
    const { next_page, results: newPosts } = await newPost.json();

    const newCurrentPosts = [...posts];
    const allPosts = newCurrentPosts.concat(newPosts);
    setPosts(allPosts);
    setMorePosts(next_page);
  }

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
          {posts.map(post => {
            return (
              <div key={post.uid} className={styles.post}>
                <Link href={`/post/${post.uid}`}>
                  <a>{post.data.title}</a>
                </Link>

                <h2>{post.data.subtitle}</h2>

                <div>
                  <span>
                    <FiCalendar size={20} />
                    <time>
                      {format(new Date(post.first_publication_date), 'PP', {
                        locale: ptBR,
                      })}
                    </time>
                  </span>
                  <span>
                    <FiUser size={20} />
                    <p>{post.data.author}</p>
                  </span>
                </div>
              </div>
            );
          })}

          {!!morePosts && (
            <button
              onClick={handleMorePosts}
              className={styles.morePosts}
              type="button"
            >
              Carregar mais posts
            </button>
          )}
        </section>
      </main>
    </>
  );
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('post', {
    orderings: ['document.first_publication_date desc'],
    pageSize: 1,
  });
  const posts = postsResponse.results.map(post => {
    return {
      ...post,
    };
  });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts,
      },
    },
    //revalidate: 60 * 60 * 24,
  };
};
