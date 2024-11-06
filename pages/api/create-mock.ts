// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const token = process.env.NEXT_PUBLIC_PRINTFUL_TOKEN;
  console.log("Token", token);

  const responseData = await fetch(
    "https://api.printful.com/mockup-generator/create-task/71",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PRINTFUL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        variant_ids: [4025],
        files: [
          {
            type: "embroidery_chest_left",
            image_url: "https://i.postimg.cc/PJhbMQ04/dash.jpg",
            position: {
              area_width: 1800,
              area_height: 2400,
              width: 300,
              height: 300,
              top: 0,
              left: 0,
            },
          },
        ],
      }),
    },
  );

  const data = await responseData.json();
  res.status(200).json({ data: data });
}
