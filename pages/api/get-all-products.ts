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

  const product_ids: number[] = [71, 380, 57];

  // get all the products at once in a promise.all for product_ids
  //

  let queries = product_ids.map((product_id) => {
    return fetch(`https://api.printful.com/products/${product_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PRINTFUL_TOKEN}`,
      },
    });
  });

  const responses = await Promise.all(queries);
  console.log(responses);
  const data = await Promise.all(responses.map((response) => response.json()));

  //
  let filteredData: {
    id: number;
    type: string;
    description: string;
    type_name: string;
    title: string;
  }[] = data.map(
    (apiResponse: {
      result: {
        product: {
          id: number;
          type: string;
          description: string;
          type_name: string;
          title: string;
        };
      };
    }) => ({
      id: apiResponse.result.product.id,
      type: apiResponse.result.product.type,
      description: apiResponse.result.product.description,
      type_name: apiResponse.result.product.type_name,
      title: apiResponse.result.product.title,
    }),
  );

  res.status(200).json({ data: filteredData });
}
