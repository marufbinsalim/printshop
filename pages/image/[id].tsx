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
    if (id === undefined || id === null) {
      return;
    }

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
    if (image === undefined || image === null) {
      return;
    }

    fetch("/api/get-product")
      .then((res) => res.json())
      .then((data) => {
        console.log("Product loaded", data.data.result.variants[0]);
      });

    // fetch("/api/create-mock")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log("Mock generation task created", data);
    //   });

    const task_id = "gt-720190031";

    fetch("/api/get-mock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task_id: task_id }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Mock loaded", data);
      });
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
