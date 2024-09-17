import { Posts } from "@/modules/posts/components/posts";
import { PostsLoading } from "@/modules/posts/components/posts-loading";
import { Suspense } from "react";

export const metadata = {
  title: "Posts",
};

export default function Page() {
  return (
    <Suspense fallback={<PostsLoading />}>
      <Posts />
    </Suspense>
  );
}
