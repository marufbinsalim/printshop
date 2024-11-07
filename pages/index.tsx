import Link from "next/link";
import { useEffect, useState } from "react";
import { SketchPicker } from "react-color";

export default function Home() {
  const [data, setData] = useState<
    {
      id: number;
      url: string;
      alt: string;
      caption: string;
    }[]
  >([]);

  const [domLoaded, setDomLoaded] = useState(false);

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

      if (index < colors.length - 1) {
        updatedColors[index].percentage = newPercentage;
        updatedColors[index + 1].percentage = Math.max(
          1,
          updatedColors[index + 1].percentage - difference,
        );
      } else if (index > 0) {
        updatedColors[index].percentage = newPercentage;
        updatedColors[index - 1].percentage = Math.max(
          1,
          updatedColors[index - 1].percentage - difference,
        );
      }

      const totalPercentage = updatedColors.reduce(
        (acc, color) => acc + color.percentage,
        0,
      );
      if (totalPercentage !== 100) {
        const adjustment = 100 - totalPercentage;
        updatedColors[colors.length - 1].percentage += adjustment;
      }

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
        setData(data.images);
      });
    });
  }, []);

  if (!domLoaded) return null;

  return (
    <div className="flex flex-col p-4 justify-center bg-gray-50 min-h-screen">
      <div className="mb-8 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Image Gallery</h1>
        <p className="text-gray-600 mb-4">
          Click on an image to view it in full size.
        </p>
      </div>
      <div className="flex justify-evenly md:justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 md:w-1/2 overflow-auto h-max max-h-[80vh] pr-4 md:px-8 gap-8">
          {data.map((image) => (
            <Link href={`/image/${image.id}`} key={image.id}>
              <img
                src={image.url}
                alt={image.alt}
                className="block rounded-md shadow-sm hover:shadow-lg transition-transform transform hover:scale-105"
              />
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
              className="bg-blue-500 text-white px-3 py-2 mt-2 rounded-md hover:bg-blue-600 transition-all w-max"
            >
              Add Color
            </button>
          </div>

          <div className="flex flex-col gap-4 w-[80%]">
            {colors.map((color, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  key={index}
                  onMouseDown={(e) => handleResizeStart(index, e)}
                  className="flex flex-col p-2 rounded-md shadow cursor-col-resize transition-transform"
                  style={{
                    backgroundColor: color.hex,
                    width: `${color.percentage}%`,
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "14px",
                    position: "relative",
                  }}
                ></div>
                {Math.round(color.percentage)}%
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(index);
                  }}
                  className=" bg-red-600 text-white text-xs p-1 rounded hover:bg-red-700 transition-all"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
