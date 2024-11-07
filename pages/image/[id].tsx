import { MergedDataType } from "@/data/images";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ImageWithVariants = () => {
  const router = useRouter();
  const { id } = router.query;

  const [imageData, setImageData] = useState<MergedDataType | null>(null);

  useEffect(() => {
    if (id === undefined || id === null) {
      return;
    }

    const fetchImageData = async () => {
      const response = await fetch("/api/get-image", {
        method: "POST",
        body: JSON.stringify({ id: id }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setImageData(data.image);
    };

    fetchImageData();
  }, [id]);

  if (!imageData) return <div className="loading-container">Loading...</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl relative">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="fixed top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      >
        Back
      </button>

      {/* Main Image Section */}
      <div className="main-image-section mb-6 bg-white rounded-lg shadow-lg p-4 mt-24">
        <img
          src={imageData.url}
          alt={`Main image ${imageData.id}`}
          className="w-1/3 h-auto rounded-md mb-4 object-cover"
        />
        <p className="text-lg font-semibold text-gray-700">
          {imageData.caption}
        </p>
      </div>

      {/* Variant Images Section */}
      <div className="variant-images-section">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Variant Images:
        </h3>
        <div className="grid gap-4 grid-cols-3 lg:grid-cols-4">
          {imageData.mockData &&
            imageData.mockData.map((d, index) => (
              <div
                key={index}
                className="variant-card rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
              >
                <img
                  src={d.mock_url}
                  alt={`Variant image ${index}`}
                  className="w-full object-cover"
                />
                <p className="text-center p-2 font-medium text-gray-600">
                  Variant {index}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ImageWithVariants;
