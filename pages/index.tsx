import { MergedDataType, MergedDataTypeWithSimilarity } from "@/data/images";
import { getImagesWithSimilarity } from "@/utils/getImagesWithSimilarity";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SketchPicker } from "react-color";

export default function Home() {
  const [data, setData] = useState<MergedDataTypeWithSimilarity[] | null>([]);

  const [domLoaded, setDomLoaded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [currentColor, setCurrentColor] = useState<string>("#000000");
  const [colors, setColors] = useState<{ hex: string; percentage: number }[]>(
    [],
  );

  const handleColorChangeComplete = (color: any) => {
    setCurrentColor(color.hex);
    const existingIndex = colors.findIndex((c) => c.hex === color.hex);
    if (existingIndex !== -1) return;

    if (colors.length >= 5) {
      console.log("Maximum of 5 colors reached.");
      return;
    }

    const newColors = [
      ...colors.map((c) => ({
        ...c,
        percentage: (c.percentage * colors.length) / (colors.length + 1),
      })),
      { hex: color.hex, percentage: 100 / (colors.length + 1) },
    ];
    setColors(newColors);
  };

  const handleDelete = (index: number) => {
    const remainingColors = colors.filter((_, i) => i !== index);
    const remainingTotal = remainingColors.reduce(
      (acc, c) => acc + c.percentage,
      0,
    );
    const updatedColors = remainingColors.map((color) => ({
      ...color,
      percentage: (color.percentage / remainingTotal) * 100,
    }));
    setColors(updatedColors);
  };

  const handleResizeStart = (index: number, event: React.MouseEvent) => {
    console.log(colors);

    // if only 1 color, don't allow resizing
    if (colors.length === 1) return;

    console.log("resize start");
    event.preventDefault();
    const startX = event.clientX;
    const startPercentage = colors[index].percentage;

    const handleResize = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const parentWidth =
        (e.target as HTMLElement).parentElement?.offsetWidth || 1;
      const newPercentage = Math.max(
        1,
        Math.min(99, startPercentage + (deltaX / parentWidth) * 100),
      );

      let updatedColors = [...colors];
      const difference = newPercentage - colors[index].percentage;

      updatedColors[index].percentage = newPercentage;

      if (index < colors.length - 1) {
        updatedColors[index + 1].percentage = Math.max(
          0,
          updatedColors[index + 1].percentage - difference,
        );
      } else if (index > 0) {
        updatedColors[index - 1].percentage = Math.max(
          0,
          updatedColors[index - 1].percentage - difference,
        );
      }

      // Adjust total percentage to exactly 100%
      const totalPercentage = updatedColors.reduce(
        (acc, color) => acc + color.percentage,
        0,
      );

      if (totalPercentage !== 100) {
        const adjustment = 100 - totalPercentage;
        // Redistribute adjustment across all colors proportionally
        for (let i = 0; i < updatedColors.length; i++) {
          if (updatedColors[i].percentage > 0) {
            updatedColors[i].percentage += adjustment / updatedColors.length;
          }
        }
      }

      // Re-clamp values to ensure no negatives and within bounds of [1, 99]
      updatedColors = updatedColors.map((color) => ({
        ...color,
        percentage: Math.max(1, Math.min(99, color.percentage)),
      }));

      setColors(updatedColors);
    };

    const handleResizeEnd = () => {
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", handleResizeEnd);
    };

    window.addEventListener("mousemove", handleResize);
    window.addEventListener("mouseup", handleResizeEnd);
  };

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  useEffect(() => {
    fetch("/api/get-images").then((response) => {
      response.json().then((data) => {
        console.log(data);
        let images = data.images as MergedDataType[];
        let imagesWithSimilarity = getImagesWithSimilarity(images, colors);
        setData(imagesWithSimilarity);
      });
    });
  }, [colors]);

  if (!domLoaded) return null;

  return (
    <div className="flex flex-col p-4 justify-center bg-gray-50 min-h-screen">
      <div className="mb-8 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Image Gallery</h1>
        <p className="text-gray-600 mb-4">
          Click on an image to view it in full size.
        </p>
      </div>
      <div className="flex justify-center items-center">
        <p className="text-lg font-semibold">
          Show Image color composition and similarity
        </p>
        <input
          className="ml-4 w-4 h-4"
          type="checkbox"
          id="showDetails"
          name="showDetails"
          checked={showDetails}
          onChange={() => setShowDetails(!showDetails)}
        />
      </div>
      <div className="flex justify-evenly md:justify-center mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 md:w-1/2 overflow-auto h-max max-h-[70vh] pr-4 md:px-8 gap-8">
          {data?.map((image) => (
            <Link href={`/image/${image.id}`} key={image.id}>
              <img
                src={image.url}
                alt={image.alt}
                className="block rounded-md shadow-sm hover:shadow-lg transition-transform transform hover:scale-105"
              />
              {showDetails &&
                image.colorPercentage?.map((color, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 p-2 text-sm text-gray-600"
                  >
                    <span
                      className="inline-block w-4 h-4 rounded-full"
                      style={{ backgroundColor: color.color }}
                    ></span>
                    <span className="ml-2">{color.percentage.toFixed(2)}%</span>
                  </div>
                ))}
              {showDetails && (
                <p>Similarity Point: {image.similarity?.toFixed(2)}</p>
              )}
            </Link>
          ))}
        </div>

        <div className="ml-4 flex flex-col bg-white rounded-lg shadow-md p-4 max-w-xs h-max w-max">
          <div className="mb-4 w-full">
            <SketchPicker
              onChange={(color) => setCurrentColor(color.hex)}
              color={currentColor}
              disableAlpha={true}
            />
            <button
              onClick={() => handleColorChangeComplete({ hex: currentColor })}
              className="bg-blue-500 text-white px-3 py-2 mt-2 rounded-md hover:bg-blue-600 transition-all w-full"
            >
              Add Color to Palette
            </button>
          </div>

          <div className="flex flex-col gap-2 mt-2 w-[100%]">
            {colors.map((color, index) => (
              <div
                key={index}
                className="flex flex-col w-full border-[#dddddd] border-2 p-2 gap-2 rounded-md"
              >
                <div
                  key={index}
                  onMouseDown={(e) => handleResizeStart(index, e)}
                  className={`h-[16px] flex flex-col rounded-md shadow cursor-col-resize transition-transform`}
                  style={{
                    backgroundColor: color.hex,
                    width: `calc(${color.percentage}%)`,
                  }}
                ></div>
                <div className="flex items-center gap-2">
                  <p>{Math.round(color.percentage)}%</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(index);
                    }}
                    className=" bg-red-600 text-white text-xs p-1 px-2 rounded hover:bg-red-700 transition-all ml-auto"
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
