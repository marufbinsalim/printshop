import type { NextApiRequest, NextApiResponse } from "next";
import jsonData from "../../public/data.json";
import { images, MergedDataType } from "@/data/images";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Extract the id from the request body
  const { id } = req.body;

  // Ensure the id exists and is a valid number
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: "Missing or invalid id" });
  }

  const parsedId = parseInt(id as string, 10);

  // Cast jsonData to the type of array of images
  const mockData = jsonData;
  let imagesData = images;

  // mergedData should be an array of objects with the following structure:
  // {
  //  ...image,
  //   an array of mockData objects that have the same image_id as the image
  // }
  let mergedData = imagesData.map((image) => {
    const mockDataForImage = mockData.filter(
      (mock) => mock.image_id === image.id,
    );
    return {
      ...image,
      mockData: mockDataForImage,
    };
  });

  // Find the image by image_id
  const image = mergedData.find((image) => image.id === parsedId);

  if (!image) {
    return res.status(404).json({ message: "Image not found" });
  }

  // Return the image data
  return res.status(200).json({ image });
}
