import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const product_id = req?.body?.product_id
    ? parseInt(req?.body?.product_id)
    : null;
  const variant_id = req?.body?.variant_id
    ? parseInt(req?.body?.variant_id)
    : null;
  const image_url = req?.body?.image_url;

  if (!product_id) {
    return res.status(400).json({ message: "Missing product_id" });
  }

  if (!variant_id) {
    return res.status(400).json({ message: "Missing variant_id" });
  }

  if (!image_url) {
    return res.status(400).json({ message: "Missing image_url" });
  }

  const token = process.env.NEXT_PUBLIC_PRINTFUL_TOKEN;

  const responseData = await fetch(
    `https://api.printful.com/mockup-generator/create-task/${product_id}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PRINTFUL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        variant_ids: [variant_id],
        files: [
          {
            placement: "front",
            image_url: image_url,
            position: {
              area_width: 2000,
              area_height: 2000,
              width: 2000,
              height: 2000,
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
