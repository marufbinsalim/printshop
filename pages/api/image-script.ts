// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// Assuming you have the `product_ids` array available
async function fetchMockupTasks(product_ids: number[]) {
  try {
    // Use Promise.all to fetch data for each product_id in parallel
    const results = await Promise.all(
      product_ids.map(async (product_id) => {
        try {
          const response = await fetch(
            `https://api.printful.com/products/${product_id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_PRINTFUL_TOKEN}`,
              },
            },
          );

          if (!response.ok) {
            throw new Error(
              `Error fetching data for product ${product_id}: ${response.statusText}`,
            );
          }

          // Parse the response as JSON
          const responseData = await response.json();

          return { product_id, responseData }; // Return product_id and corresponding data
        } catch (error) {
          console.error(`Error for product ${product_id}:`, error);
          return { product_id, error: error }; // Return error message for this product
        }
      }),
    );

    // Log or handle the results
    console.log("All results:", results);

    return results;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return []; // Return empty array if something goes wrong
  }
}

function getStructuredData(apiResult: any) {
  let structuredObject: any[] = [];

  for (let i = 0; i < apiResult.length; i++) {
    const result = apiResult[i].responseData.result;
    const variants = result.variants;

    structuredObject = [
      ...structuredObject,
      {
        product_id: result.product.id,
        variants: variants.map((variant: any) => {
          return variant.id;
        }),
      },
    ];
  }

  return structuredObject;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const token = process.env.NEXT_PUBLIC_PRINTFUL_TOKEN;

  // 71 is the t-shirt: unisex-staple-t-shirt-bella-canvas-3001
  // 380 is a hoodie: unisex-premium-hoodie-cotton-heritage-m2580
  // 181 is a phone case: iphone-case
  const product_ids = [71, 380, 181];

  const apiResult = await fetchMockupTasks(product_ids);
  const structuredObject = getStructuredData(apiResult);
  console.log("Structured object:", structuredObject);

  res.status(200).json({ data: structuredObject });
}
