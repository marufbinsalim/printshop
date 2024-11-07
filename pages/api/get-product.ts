// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const product_id = req?.body?.product_id;

  if (!product_id) {
    return res.status(400).json({ message: "Missing product_id" });
  }

  const token = process.env.NEXT_PUBLIC_PRINTFUL_TOKEN;

  const responseData = await fetch(
    `https://api.printful.com/products/${product_id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PRINTFUL_TOKEN}`,
      },
    },
  );

  const data = await responseData.json();
  res.status(200).json({ data: data });
}
