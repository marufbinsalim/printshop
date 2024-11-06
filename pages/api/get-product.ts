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

  const responseData = await fetch("https://api.printful.com/products/71", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_PRINTFUL_TOKEN}`,
    },
  });

  const data = await responseData.json();
  res.status(200).json({ data: data });
}
