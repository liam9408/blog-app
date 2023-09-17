import { useEffect } from 'react';
import type { NextPage } from 'next';

import { AuthGuard } from 'src/components/organisms/AuthGuard';
import { useRouter } from 'next/router';

const Post: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/');
  });
  return <></>;
};

Post.getLayout = (page) => <AuthGuard>{page}</AuthGuard>;

export default Post;
