import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ImagePage() {
  const router = useRouter();
  const { id } = router.query;

  const [image, setImage] = useState<{
    id: string;
    url: string;
    alt: string;
    caption: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/get-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setImage(data.image);
      });
  }, [id]);

  useEffect(() => {
    if (!image) return;

    fetch("https://api.printful.com/products/71", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PRINTFUL_TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Printful data", data);
      })
      .catch((error) => {
        console.error("Error fetching Printful data", error);
      });

    console.log("Image loaded", image.url);
  }, [image]);

  return (
    <div>
      {image && (
        <div
          key={image.id}
          className="bg-gray-100 p-4 flex flex-col items-center"
        >
          <img src={image.url} alt={image.alt} className="w-[200px]" />
          <p className="text-center text-gray-500 mt-2">{image.caption}</p>
        </div>
      )}
    </div>
  );
}
