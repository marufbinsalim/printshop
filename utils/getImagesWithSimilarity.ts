import { MergedDataType, MergedDataTypeWithSimilarity } from "@/data/images";

type UserColor = {
  hex: string;
  percentage: number;
};

type ImageColor = {
  color: string;
  percentage: number;
};

function calculateSimilarityScore(
  colorPercentageArray: ImageColor[],
  searchPrompt: UserColor[],
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

function hexToLab(hex: string): number[] {
  return rgbToLab(hexToRgb(hex));
}

/*
  takes in an array of MergedDataType objects
  and a colors arry
*/
function getImagesWithSimilarity(
  data: MergedDataType[],
  userColors: UserColor[],
): MergedDataTypeWithSimilarity[] {
  let images = data.map((image) => {
    let similarity = calculateSimilarityScore(
      image.colorPercentage,
      userColors,
    );
    return { ...image, similarity };
  });

  // sort by similarity (hgih to low)

  let sortedImages = images.sort((a, b) => b.similarity - a.similarity);
  return sortedImages;
}

export { getImagesWithSimilarity };
