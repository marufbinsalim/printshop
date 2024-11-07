type Data = {
  images: {
    id: number;
    url: string;
    alt: string;
    caption: string;
  }[];
};

let images: Data["images"] = [
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

type imageMockDataType = {
  product_id: number;
  variant_id: number;
  task_id: string;
  mock_url: string;
  image_id: number;
  image_url: string;
};
type MergedDataType = {
  id: number;
  url: string;
  alt: string;
  caption: string;
  mockData: imageMockDataType[];
};

export type { Data as ImageCaptionType, imageMockDataType, MergedDataType };
export { images };
