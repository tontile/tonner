import { getPosts } from "@tonner/supabase/queries";

export async function Posts() {
  const { data } = await getPosts();

  return (
    <div>
      {data?.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
