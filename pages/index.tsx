import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState<
    {
      id: number;
      url: string;
      alt: string;
      caption: string;
    }[]
  >([]);

  useEffect(() => {
    fetch("/api/get-images").then((response) => {
      response.json().then((data) => {
        console.log(data);
        setData(data.images);
      });
    });
  }, []);

  return (
    <div className="bg-gray-200 grid gap-4 grid-cols-3 w-max h-max">
      {data.map((image) => (
        <Link href={`/image/${image.id}`} key={image.id}>
          <img
            key={image.id}
            src={image.url}
            alt={image.alt}
            className="block"
            height={100}
            width={100}
            style={{ width: "100px", height: "100px" }}
          />
        </Link>
      ))}
    </div>
  );
}
