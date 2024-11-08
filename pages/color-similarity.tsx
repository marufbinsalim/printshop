import { useEffect, useState } from "react";
import { SketchPicker, ColorResult } from "react-color";

type ColorComposition = {
  color: string;
  percentage: number;
};

type Color = {
  hex: string;
  percentage: number;
};

function calculateSimilarityScore(
  searchPrompt: Color[],
  colorPercentageArray: ColorComposition[],
): number {
  let score = 0;
  const maxPossibleDistance = 100; // Maximum possible CIEDE2000 distance (range: 0-100)
  const maxColorDifferenceWeight = 0.7; // Adjust weights if needed
  const maxPercentageDifferenceWeight = 0.3;
  const missingColorPenaltyWeight = 0.02; // Penalty weight for missing colors

  // For each user-selected color
  searchPrompt.forEach((userColor) => {
    const userLab = hexToLab(userColor.hex);
    let bestMatchDistance = Infinity;
    let bestMatchPercentageDiff = 100;

    // Find the best match from the image colors
    colorPercentageArray.forEach((imageColor) => {
      const imageLab = hexToLab(imageColor.color);
      const distance = ciede2000(userLab, imageLab);
      if (distance < bestMatchDistance) {
        bestMatchDistance = distance;
        bestMatchPercentageDiff = Math.abs(
          userColor.percentage - imageColor.percentage,
        );
      }
    });

    const colorSimilarity = 1 - bestMatchDistance / maxPossibleDistance;
    const percentageSimilarity = 1 - bestMatchPercentageDiff / 100;

    score +=
      colorSimilarity * maxColorDifferenceWeight +
      percentageSimilarity * maxPercentageDifferenceWeight;
  });

  // Handle missing colors from the user's input
  const unmatchedImageColors = colorPercentageArray.filter(
    (imageColor) =>
      !searchPrompt.some((userColor) => {
        const distance = ciede2000(
          hexToLab(userColor.hex),
          hexToLab(imageColor.color),
        );
        return distance < maxPossibleDistance * 0.1; // Threshold for a "match"
      }),
  );

  // Apply a penalty for each unmatched image color
  score -= unmatchedImageColors.length * missingColorPenaltyWeight;

  // Normalize score to ensure it stays within 0-1 range
  score = Math.max(score / searchPrompt.length, 0);

  return score;
}

function hexToRgb(hex: string): number[] {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function rgbToLab([r, g, b]: number[]): number[] {
  // return [r, g, b];
  // Convert RGB to a scale of 0 to 1
  r /= 255;
  g /= 255;
  b /= 255;

  // Convert RGB to linear space
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  // Convert to XYZ color space (reference: D65 illuminant)
  let x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
  let y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
  let z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;

  // Normalize for D65 white point
  x /= 0.95047;
  y /= 1.0;
  z /= 1.08883;

  // Convert to Lab space
  const epsilon = 0.008856; // threshold for linear RGB
  const kappa = 903.3; // used in conversion formula

  x = x > epsilon ? Math.cbrt(x) : (kappa * x + 16) / 116;
  y = y > epsilon ? Math.cbrt(y) : (kappa * y + 16) / 116;
  z = z > epsilon ? Math.cbrt(z) : (kappa * z + 16) / 116;

  // Calculate Lab values
  const lab_l = 116 * y - 16;
  const lab_a = 500 * (x - y);
  const lab_b = 200 * (y - z);

  return [lab_l, lab_a, lab_b];
}
function ciede2000(lab1: number[], lab2: number[]): number {
  return Math.sqrt(
    (lab1[0] - lab2[0]) ** 2 +
      (lab1[1] - lab2[1]) ** 2 +
      (lab1[2] - lab2[2]) ** 2,
  );

  const [L1, a1, b1] = lab1;
  const [L2, a2, b2] = lab2;

  // Mean L value
  const LBar = (L1 + L2) / 2;

  // Delta L, a, b
  const deltaL = L2 - L1;
  const deltaA = a2 - a1;
  const deltaB = b2 - b1;

  // C' calculation
  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const CBar = (C1 + C2) / 2;

  // G factor for correcting a' to a'
  const G = 0.5 * (1 - Math.sqrt(CBar ** 7 / (CBar ** 7 + 25 ** 7)));
  const a1Prime = a1 * (1 + G);
  const a2Prime = a2 * (1 + G);

  // C' and h' values
  const C1Prime = Math.sqrt(a1Prime * a1Prime + b1 * b1);
  const C2Prime = Math.sqrt(a2Prime * a2Prime + b2 * b2);
  const deltaCPrime = C2Prime - C1Prime;

  const h1Prime = Math.atan2(b1, a1Prime);
  const h2Prime = Math.atan2(b2, a2Prime);
  const hBarPrime =
    Math.abs(h1Prime - h2Prime) > Math.PI
      ? (h1Prime + h2Prime + 2 * Math.PI) / 2
      : (h1Prime + h2Prime) / 2;
  const deltaHPrime =
    Math.abs(h2Prime - h1Prime) > Math.PI
      ? h2Prime - h1Prime > 0
        ? h2Prime - h1Prime - 2 * Math.PI
        : h2Prime - h1Prime + 2 * Math.PI
      : h2Prime - h1Prime;
  const deltaH = 2 * Math.sqrt(C1Prime * C2Prime) * Math.sin(deltaHPrime / 2);

  // Calculate L, C, and H weighting functions
  const LPrimeBar = (L1 + L2) / 2;
  const CPrimeBar = (C1Prime + C2Prime) / 2;
  const HPrimeBar = hBarPrime;

  const T =
    1 -
    0.17 * Math.cos(HPrimeBar - Math.PI / 6) +
    0.24 * Math.cos(2 * HPrimeBar) +
    0.32 * Math.cos(3 * HPrimeBar + Math.PI / 30) -
    0.2 * Math.cos(4 * HPrimeBar - (63 * Math.PI) / 180);

  const deltaTheta =
    ((30 * Math.PI) / 180) *
    Math.exp(
      -(((HPrimeBar - (275 * Math.PI) / 180) / ((25 * Math.PI) / 180)) ** 2),
    );

  const R_C = 2 * Math.sqrt(CPrimeBar ** 7 / (CPrimeBar ** 7 + 25 ** 7));
  const S_L =
    1 + (0.015 * (LPrimeBar - 50) ** 2) / Math.sqrt(20 + (LPrimeBar - 50) ** 2);
  const S_C = 1 + 0.045 * CPrimeBar;
  const S_H = 1 + 0.015 * CPrimeBar * T;

  const deltaLKLSL = deltaL / S_L;
  const deltaCKCSC = deltaCPrime / S_C;
  const deltaHKSHSH = deltaH / S_H;

  const RT = -Math.sin(2 * deltaTheta) * R_C;

  const deltaE = Math.sqrt(
    deltaLKLSL ** 2 +
      deltaCKCSC ** 2 +
      deltaHKSHSH ** 2 +
      RT * deltaCKCSC * deltaHKSHSH,
  );

  return deltaE;
}

function isDarkColor(hex: string): boolean {
  const [r, g, b] = hexToRgb(hex);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  let state = brightness < 128;
  console.log(state, { r, g, b }, brightness);
  return state;
}

function hexToLab(hex: string): number[] {
  return rgbToLab(hexToRgb(hex));
}

// Main Tool Component
const ColorSimilarityTool = () => {
  const [currentColor, setCurrentColor] = useState<string>("#000000");
  const [colors, setColors] = useState<Color[]>([
    { hex: "#000000", percentage: 100 },
  ]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [colorComposition, setColorComposition] = useState<ColorComposition[]>(
    [],
  );
  const [similarityScore, setSimilarityScore] = useState<number | null>(null);

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
    if (colors && colors.length > 0) {
      calculateScore();
    }
  }, [colors]);

  const handleColorChangeComplete = (color: ColorResult) => {
    setCurrentColor(color.hex);
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

  const fetchColorComposition = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/get-color-composition",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image_url: imageUrl }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch color composition");
      }

      const data = await response.json();
      setColorComposition(data.colorPercentage);
    } catch (error) {
      console.error("Error fetching color composition:", error);
    }
  };

  const calculateScore = () => {
    const score = calculateSimilarityScore(colors, colorComposition);
    setSimilarityScore(score);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Color Similarity Tool</h1>

      <div className="w-max flex flex-col-reverse md:flex-row gap-4 md:gap-[100px]">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex w-full justify-evenly items-center">
            <div className="mb-4 w-max">
              <SketchPicker
                color={currentColor}
                onChange={(color: ColorResult) => setCurrentColor(color.hex)}
                disableAlpha={true}
              />
              <button
                onClick={() =>
                  handleColorChangeComplete({
                    hex: currentColor,
                  } as ColorResult)
                }
                className="bg-blue-500 text-white px-3 py-2 mt-2 rounded-md hover:bg-blue-600 transition-all w-full"
              >
                Add Color
              </button>
            </div>

            <div
              className="p-2 flex items-center justify-center rounded-md relative"
              style={{
                width: "90px",
                height: "90px",
                backgroundColor: currentColor,
              }}
            >
              <p className="font-bold absolute bg-[#00000060] text-white border-black border-2">
                {" "}
                {currentColor}{" "}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-2 w-full md:w-[400px]">
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

        <div className="flex flex-col gap-4 w-full items-center md:items-start md:max-w-3xl my-2 pb-8">
          <div className="w-full max-w-xs mb-4">
            <input
              type="text"
              placeholder="Enter Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <button
              onClick={fetchColorComposition}
              className="bg-indigo-500 text-white px-3 py-2 mt-2 rounded-md hover:bg-indigo-600 transition-all w-full"
            >
              Get Color Composition
            </button>
          </div>

          {imageUrl && (
            <div className="w-full max-w-xs mb-4">
              <img
                src={imageUrl}
                alt="Image Preview"
                className="w-full h-auto rounded-md shadow-lg"
              />
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4 mt-4 w-full md:w-max">
            {colorComposition.map((color, index) => (
              <div key={index} className="flex items-center justify-center">
                <div
                  className="w-10 h-10 rounded-full shadow-lg mr-2 font-bold"
                  style={{
                    backgroundColor: color.color,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  <p className="text-sm bg-[#00000030] text-white w-full text-center rounded-full">
                    {Math.round(color.percentage)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={calculateScore}
        className="bg-green-500 text-white px-4 py-2 mt-4 rounded hover:bg-green-600 transition"
      >
        Calculate Similarity Score
      </button>

      {similarityScore !== null && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">
            Similarity Score: {similarityScore.toFixed(2)}
          </h2>
        </div>
      )}
    </div>
  );
};

export default ColorSimilarityTool;
