import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Header from '../../components/Header';
import { getPrismicClient } from '../../services/prismic';
import common from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
      alt: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}
export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Carregando...</h1>;
  }

  let totalString = 0;

  post.data.content.forEach(body => {
    body.body.forEach(string => {
      totalString += string.text.split(' ').length;
    });
  });

  const readTime = Math.ceil(totalString / 200);

  return (
    <div className={styles.content}>
      <Header />
      <img src={post.data.banner.url} alt={post.data.banner.alt} />
      <main className={common.container}>
        <article key={post.data.title}>
          <h1>{post.data.title}</h1>
          <div className={styles.flexInfo}>
            <div>
              <FiCalendar />
              <time>
                {format(new Date(post.first_publication_date), 'PP', {
                  locale: ptBR,
                })}
              </time>
            </div>
            <div>
              <FiUser />
              <p>{post.data.author}</p>
            </div>
            <div>
              <FiClock />
              <p>{readTime} min</p>
            </div>
          </div>
          {post.data.content.map(content => (
            <section className={styles.body}>
              <h2>{content.heading}</h2>
              {/* eslint-disable-next-line react/no-danger */}
              <div
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(content.body),
                }}
              />
            </section>
          ))}
        </article>
      </main>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async (): Promise<any> => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);
  return {
    paths: [
      {
        params: {
          slug: 'como-utilizar-hooks',
        },
      },
      {
        params: {
          slug: 'criando-um-app-cra-do-zero',
        },
      },
    ],
    fallback: true,
  };
  // TODO
};

export const getStaticProps: GetStaticProps = async (
  context
): Promise<{ props: unknown }> => {
  const prismicClient = getPrismicClient({});
  const response = await prismicClient.getByUID(
    'post',
    String(context.params.slug)
  );
  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: response.data.banner,
      author: response.data.author,
      content: response.data.content,
    },
  };
  return {
    props: {
      post,
    },
  };
};
