import { GetStaticPaths, GetStaticProps } from "next";

const ThisPage = ({ id }: { id: string }) => {
  return <span>This is a page. Its id is "{id}"</span>;
};

export default ThisPage;

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: ["/posts/f", "/posts/e", "/posts/q"], fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return { props: { id: params?.id } };
};
