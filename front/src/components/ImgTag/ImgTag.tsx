"use client";
import Image, { StaticImageData } from "next/image";
import React, { useState } from "react";
import LoadingImg from "../LoadingImg/LoadingImg";
import ImageError from "@/../public/errorImage.webp";
type ImageType = {
  src: any;
  alt: string | null;
  className?: string;
  width?: number;
  height?: number;
  classPlus?: string;
  figureClass?: string;
  onClick?: (value: any) => void
};
export default function ImgTag({
  width,
  height,
  src,
  alt,
  className,
  classPlus,
  figureClass,
  onClick
}: ImageType) {
  const [load, setLoad] = useState<boolean>(true);
  const [error, setError] = useState<StaticImageData | null>(null)
  const classImage = className ? className : classPlus ? `${classPlus} rounded-md shadow-md  table mx-auto` : "rounded-md shadow-md w-full h-auto table mx-auto object-fill"
  return (
    <figure className={figureClass || "w-full relative"}>
      <Image
        width={width}
        height={height}
        loading="lazy"
        onClick={onClick}
        // placeholder="blur"
        // blurDataURL="data:image/gif;base64,..."
        onLoad={() => setLoad(false)}
        src={error ? error : src || ImageError}
        alt={alt || "error"}
        className={classImage}
        onError={() => setError(ImageError)}
      />
      {load && <LoadingImg />}
    </figure>
  );
}
