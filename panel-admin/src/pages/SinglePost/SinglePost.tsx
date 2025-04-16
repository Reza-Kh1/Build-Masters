import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { fetchSinglePost } from "../../services/post";
import FormPost from "../../components/FormPost/FormPost";
import NotFound from "../NotFound/NotFound";
import { SinglePostType } from "../../type";

export default function SinglePost() {
  const { pathname } = useLocation();
  const slug = pathname.split("/home/posts/")[1];
  const { data } = useQuery<SinglePostType>({
    queryKey: ["siglePost", slug],
    queryFn: () => fetchSinglePost(slug),
    staleTime: 1000 * 60 * 60 * 24,
  });
  return (
    <div className="w-full">
      {data ? <FormPost dataPost={data} /> : <NotFound />}
    </div>
  );
}
