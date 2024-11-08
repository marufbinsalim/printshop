import { useState, useEffect } from "react";

let images = [
  {
    id: 1,
    url: "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/1.jpg",
    alt: "Sunlit mountain landscape with clear blue skies",
    caption: "A serene mountain view bathed in sunlight.",
  },
  {
    id: 2,
    url: "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/2.jpg",
    alt: "Lush forest with a tranquil river running through",
    caption: "A calming view of a river flowing through dense forest.",
  },
  {
    id: 3,
    url: "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/3.jpg",
    alt: "Dramatic sunset over rolling hills",
    caption: "A picturesque sunset illuminating rolling hills.",
  },
  {
    id: 4,
    url: "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/4.jpg",
    alt: "Snow-capped mountains under a vibrant sunrise",
    caption: "A stunning view of snow-covered peaks at sunrise.",
  },
  {
    id: 5,
    url: "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/5.jpg",
    alt: "Peaceful lake surrounded by mountains",
    caption: "A lake surrounded by majestic mountains under clear skies.",
  },
  {
    id: 6,
    url: "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/6.jpg",
    alt: "Rocky coastline at sunset with crashing waves",
    caption: "Waves crashing against a rocky coast at sunset.",
  },
  {
    id: 7,
    url: "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/7.jpg",
    alt: "Vast desert with sand dunes under a bright sky",
    caption: "A vast desert landscape with rolling sand dunes.",
  },
  {
    id: 8,
    url: "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/8.jpg",
    alt: "Dense jungle with sunlight filtering through trees",
    caption: "A lush jungle with sunlight peeking through the canopy.",
  },
];

export default function Admin() {
  const products = [
    { id: 71, name: "Product 1" },
    { id: 380, name: "Product 2" },
    { id: 57, name: "Product 3" },
  ];

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(false);
  const [currentProductIndex, setCurrentProductIndex] = useState<number>(0);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const getProductVariantId = async (productId: number) => {
    const response = await fetch("/api/get-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId }),
    });
    const resData = await response.json();
    return resData.data.result?.variants[0].id || 0;
  };

  const createMock = async (productId: number, imageUrl: string) => {
    setLoading(true);
    const variantId = await getProductVariantId(productId);

    const response = await fetch("/api/create-mock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: productId,
        variant_id: variantId,
        image_url: imageUrl,
      }),
    });
    const resData = await response.json();
    console.log("task created", resData);

    return {
      taskId: resData.data.result?.task_key || null,
      variantId: variantId || "",
    };
  };

  const getMock = async (task_id: string) => {
    const response = await fetch("/api/get-mock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task_id: task_id }),
    });
    const resData = await response.json();
    console.log("mock fetched", resData);

    return resData.data.result?.mockups[0].mockup_url || "";
  };

  const generateMocksForAllProducts = async () => {
    setRunning(true);
    let updatedData: any[] = [];

    for (let productIndex = 0; productIndex < products.length; productIndex++) {
      const product = products[productIndex];
      for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
        const image = images[imageIndex];

        // Generate mock for this product/image
        const { taskId, variantId } = await createMock(product.id, image.url);
        if (taskId) {
          setTimer(30); // set timer for the next image
          await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30 seconds

          // Now fetch the mock
          console.log("Fetching mock for task", taskId);
          const mockUrl = await getMock(taskId);

          // Update the data as we get the mock URL
          updatedData.push({
            product_id: product.id,
            variant_id: variantId,
            task_id: taskId,
            mock_url: mockUrl,
            image_id: image.id,
            image_url: image.url,
          });

          // Immediately update the state with the new mock URL
          setData((prevData) => [
            ...prevData,
            updatedData[updatedData.length - 1],
          ]);
        }

        // Wait 30 seconds before moving to the next image
        if (imageIndex < images.length - 1) {
          setTimer(30);
          await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30 seconds
        }
      }
    }
    setRunning(false);
  };

  useEffect(() => {
    let interval: any;
    if (running && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [running, timer]);

  return (
    <div className="flex flex-col bg-gray-100 p-8 px-[20vw] min-h-dvh">
      <h1 className="text-2xl font-bold mb-4">Product Mock Generator</h1>

      {!running && (
        <button
          onClick={generateMocksForAllProducts}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 w-max"
        >
          Generate Mocks for All Products
        </button>
      )}

      {running && (
        <div className="bg-yellow-200 text-black p-4 rounded mb-4 w-max">
          <h2 className="font-semibold">Process Running...</h2>
          <p className="text-lg">Timer: {timer}s</p>
        </div>
      )}

      {loading && (
        <div className="bg-gray-200 p-4 rounded mb-4 w-max">
          <p>Loading...</p>
        </div>
      )}

      <div className="mt-4">
        <h3 className="font-semibold text-lg mb-2">Generated Mocks:</h3>
        <pre className="bg-gray-800 text-white p-4 rounded text-wrap">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
