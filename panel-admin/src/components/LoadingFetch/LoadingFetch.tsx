import { useIsFetching } from "@tanstack/react-query";
import "./style.css";
export default function LoadingFetch() {
  const isLoad = useIsFetching();
  if (!isLoad) return;
  return (
    <div className="fixed bottom-3 left-1/2 transform -translate-x-1/2 flex items-center shadow-md bg-[#000000c9] p-3 pl-7 rounded-md justify-center gap-5">
      <span className="text-gray-50">درحال بارگیری</span>
      <div className="loader"></div>
    </div>
  );
}
