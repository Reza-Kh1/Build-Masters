import MediaBox from "../../components/MediaBox/MediaBox";
import ShowDBaaS from "../../components/ShowDBaaS/ShowDBaaS";
import UploadMedia from "../../components/UploadMedia/UploadMedia";
export default function Images() {
  return (
    <div>
      <div className="w-2/12 flex justify-center flex-col items-center gap-3 mt-3">
        <UploadMedia />
        <span>آپلود عکس و فیلم </span>
      </div>
      <div className="mt-8">
        <MediaBox />
        <ShowDBaaS />
      </div>
    </div>
  );
}