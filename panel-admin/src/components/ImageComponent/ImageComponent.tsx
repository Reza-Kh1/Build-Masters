import { DataMediaType } from "../../type";
import { MdClose, MdPending } from "react-icons/md";
type ImageComponentType = {
  img: DataMediaType | null;
  deleteHandler: (value: DataMediaType) => void;
  editHandler?: (value: DataMediaType) => void;
};
export default function ImageComponent({
  img,
  deleteHandler,
  editHandler,
}: ImageComponentType) {
  if (!img) return;
  return (
    <div className="relative group">
      {img?.url?.search(/(jpg|jpeg|png|gif|webp|jfif)$/i) !== -1 ? (
        <img
          src={img.url}
          alt={img.alt}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = "/notfound.webp";
          }}
          className="shadow-md rounded-md w-full h-48 object-cover"
        />
      ) : (
        <video
          src={img.url}
          controls
          className="shadow-md rounded-md w-full h-48 object-cover"
        />
      )}
      <i
        onClick={() => deleteHandler(img)}
        className="absolute group-hover:opacity-100 opacity-0 top-1 text-xl right-1 bg-gray-800/70 p-1 rounded-full cursor-pointer text-white shadow-md"
      >
        <MdClose />
      </i>
      {editHandler ? (
        <i
          onClick={() => editHandler(img)}
          className="absolute group-hover:opacity-100 opacity-0 top-1 text-xl left-1 bg-gray-800/70 p-1 rounded-full cursor-pointer text-white shadow-md"
        >
          <MdPending />
        </i>
      ) : null}
      <span className="text-sm absolute left-0 bottom-0 w-full bg-black/70 text-gray-50 group-hover:opacity-100 opacity-0 transition-all rounded-md p-2">
        {img.alt}
      </span>
    </div>
  );
}
