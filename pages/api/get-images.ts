// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { images } from "@/data/images";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  res.status(200).json({ images: images });
}
