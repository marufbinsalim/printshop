// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  let task_id = req?.body?.task_id;

  if (!task_id) {
    return res.status(400).json({ message: "Missing task_id" });
  }

  const token = process.env.NEXT_PUBLIC_PRINTFUL_TOKEN;
  console.log("Token", token);

  const responseData = await fetch(
    `https://api.printful.com/mockup-generator/task?task_key=${task_id}`,
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
