type ImagesType = {
  id: number;
  url: string;
  alt: string;
  caption: string;
  colorPercentage: {
    color: string;
    percentage: number;
  }[];
}[];

let images = [
  {
    id: 1,
    url: "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/1.jpg",
    alt: "Sunlit mountain landscape with clear blue skies",
    caption: "A serene mountain view bathed in sunlight.",
    colorPercentage: [
      {
        color: "#435765",
        percentage: 63.95540237426758,
      },
      {
        color: "#CCD0D2",
        percentage: 17.458724975585938,
      },
      {
        color: "#8CBFCB",
        percentage: 7.731056213378906,
      },
      {
        color: "#6C9CB9",
        percentage: 2.3344039916992188,
      },
      {
        color: "#19191F",
        percentage: 8.52041244506836,
      },
    ],
  },
  {
    id: 2,
    url: "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/2.jpg",
    alt: "Lush forest with a tranquil river running through",
    caption: "A calming view of a river flowing through dense forest.",
    colorPercentage: [
      {
        color: "#373E43",
        percentage: 58.20817947387695,
      },
      {
        color: "#748B7E",
        percentage: 10.709190368652344,
      },
      {
        color: "#89CAD8",
        percentage: 9.37662124633789,
      },
      {
        color: "#C9D1B6",
        percentage: 12.946128845214844,
      },
      {
        color: "#5892BE",
        percentage: 8.759880065917969,
      },
    ],
  },
  {
    id: 3,
    url: "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/3.jpg",
    alt: "Dramatic sunset over rolling hills",
    caption: "A picturesque sunset illuminating rolling hills.",
    colorPercentage: [
      {
        color: "#323B5B",
        percentage: 6.257438659667969,
      },
      {
        color: "#8896AB",
        percentage: 70.06044387817383,
      },
      {
        color: "#51383E",
        percentage: 4.3552398681640625,
      },
      {
        color: "#E1DBD3",
        percentage: 17.28830337524414,
      },
      {
        color: "#6B5547",
        percentage: 2.03857421875,
      },
    ],
  },
  {
    id: 4,
    url: "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/4.jpg",
    alt: "Snow-capped mountains under a vibrant sunrise",
    caption: "A stunning view of snow-covered peaks at sunrise.",
    colorPercentage: [
      {
        color: "#5E7A84",
        percentage: 14.825153350830078,
      },
      {
        color: "#BFBFB8",
        percentage: 54.935264587402344,
      },
      {
        color: "#293A49",
        percentage: 18.346405029296875,
      },
      {
        color: "#966541",
        percentage: 3.552722930908203,
      },
      {
        color: "#5C3D3A",
        percentage: 8.3404541015625,
      },
    ],
  },
  {
    id: 5,
    url: "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/5.jpg",
    alt: "Peaceful lake surrounded by mountains",
    caption: "A lake surrounded by majestic mountains under clear skies.",
    colorPercentage: [
      {
        color: "#D5DDD1",
        percentage: 50.73671340942383,
      },
      {
        color: "#678B92",
        percentage: 10.524940490722656,
      },
      {
        color: "#1C3749",
        percentage: 27.850055694580078,
      },
      {
        color: "#724B41",
        percentage: 5.475425720214844,
      },
      {
        color: "#C3803C",
        percentage: 5.412864685058594,
      },
    ],
  },
  {
    id: 6,
    url: "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/6.jpg",
    alt: "Rocky coastline at sunset with crashing waves",
    caption: "Waves crashing against a rocky coast at sunset.",
    colorPercentage: [
      {
        color: "#538B8E",
        percentage: 11.542701721191406,
      },
      {
        color: "#2D464F",
        percentage: 56.52055740356445,
      },
      {
        color: "#74C6C7",
        percentage: 8.748435974121094,
      },
      {
        color: "#D1C8B1",
        percentage: 21.53339385986328,
      },
      {
        color: "#469EB0",
        percentage: 1.6549110412597656,
      },
    ],
  },
  {
    id: 7,
    url: "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/7.jpg",
    alt: "Vast desert with sand dunes under a bright sky",
    caption: "A vast desert landscape with rolling sand dunes.",
    colorPercentage: [
      {
        color: "#425277",
        percentage: 60.43529510498047,
      },
      {
        color: "#6CD3E0",
        percentage: 10.80474853515625,
      },
      {
        color: "#599FC2",
        percentage: 5.8216094970703125,
      },
      {
        color: "#DDA292",
        percentage: 21.819686889648438,
      },
      {
        color: "#5C242A",
        percentage: 1.1186599731445312,
      },
    ],
  },
  {
    id: 8,
    url: "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/8.jpg",
    alt: "Dense jungle with sunlight filtering through trees",
    caption: "A lush jungle with sunlight peeking through the canopy.",
    colorPercentage: [
      {
        color: "#1F2235",
        percentage: 56.2474250793457,
      },
      {
        color: "#2D5B85",
        percentage: 10.501480102539062,
      },
      {
        color: "#387FB6",
        percentage: 7.029247283935547,
      },
      {
        color: "#61C8E5",
        percentage: 13.535404205322266,
      },
      {
        color: "#C2DBDB",
        percentage: 12.686443328857422,
      },
    ],
  },
];

type MergedDataType = {
  id: number;
  url: string;
  alt: string;
  caption: string;
  colorPercentage: {
    color: string;
    percentage: number;
  }[];
};
type MergedDataTypeWithSimilarity = MergedDataType & {
  similarity: number;
};

export type { MergedDataType, MergedDataTypeWithSimilarity };
export { images };
