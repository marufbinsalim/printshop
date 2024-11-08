let mockImages = [
  {
    product_id: 71,
    variant_id: 4025,
    task_id: "gt-720766617",
    mock_url:
      "https://printful-upload.s3-accelerate.amazonaws.com/tmp/6c856ebd15342d8d4abe6502ca7b1c35/unisex-staple-t-shirt-aqua-front-672e2699f3b3e.png",
    image_id: 1,
    image_url:
      "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/1.jpg",
  },
  {
    product_id: 71,
    variant_id: 4025,
    task_id: "gt-720766919",
    mock_url:
      "https://printful-upload.s3-accelerate.amazonaws.com/tmp/3651c5832e31a42655c859aa2e22116e/unisex-staple-t-shirt-aqua-front-672e26d80d16d.png",
    image_id: 2,
    image_url:
      "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/2.jpg",
  },
  {
    product_id: 71,
    variant_id: 4025,
    task_id: "gt-720767206",
    mock_url:
      "https://printful-upload.s3-accelerate.amazonaws.com/tmp/01dbb70e50e7c3ed352337d92b4e0bef/unisex-staple-t-shirt-aqua-front-672e271a85ed9.png",
    image_id: 3,
    image_url:
      "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/3.jpg",
  },
  {
    product_id: 71,
    variant_id: 4025,
    task_id: "gt-720767501",
    mock_url:
      "https://printful-upload.s3-accelerate.amazonaws.com/tmp/775493d305f7d756de769dc2abe03508/unisex-staple-t-shirt-aqua-front-672e27592e628.png",
    image_id: 4,
    image_url:
      "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/4.jpg",
  },
  {
    product_id: 71,
    variant_id: 4025,
    task_id: "gt-720767821",
    mock_url:
      "https://printful-upload.s3-accelerate.amazonaws.com/tmp/0cd29785ff7cf51383ef526b25f4aa1e/unisex-staple-t-shirt-aqua-front-672e27997d7bf.png",
    image_id: 5,
    image_url:
      "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/5.jpg",
  },
  {
    product_id: 71,
    variant_id: 4025,
    task_id: "gt-720768075",
    mock_url:
      "https://printful-upload.s3-accelerate.amazonaws.com/tmp/c7fed58387e29f64d5309466fccb2460/unisex-staple-t-shirt-aqua-front-672e27dc44a34.png",
    image_id: 6,
    image_url:
      "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/6.jpg",
  },
  {
    product_id: 71,
    variant_id: 4025,
    task_id: "gt-720768357",
    mock_url:
      "https://printful-upload.s3-accelerate.amazonaws.com/tmp/c93c47a4f12f47a419a2e58d44424454/unisex-staple-t-shirt-aqua-front-672e281c48df1.png",
    image_id: 7,
    image_url:
      "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/7.jpg",
  },
  {
    product_id: 71,
    variant_id: 4025,
    task_id: "gt-720768619",
    mock_url:
      "https://printful-upload.s3-accelerate.amazonaws.com/tmp/102e269a3e97676db7e272ff6920876d/unisex-staple-t-shirt-aqua-front-672e285d82835.png",
    image_id: 8,
    image_url:
      "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/8.jpg",
  },
  {
    product_id: 380,
    variant_id: 10783,
    task_id: "gt-720768768",
    mock_url:
      "https://printful-upload.s3-accelerate.amazonaws.com/tmp/1bc9bfd468a16ce5d2f2cbd49b791ec0/unisex-premium-hoodie-black-front-672e2877c21ef.png",
    image_id: 1,
    image_url:
      "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/1.jpg",
  },
  {
    product_id: 380,
    variant_id: 10783,
    task_id: "gt-720769057",
    mock_url:
      "https://printful-upload.s3-accelerate.amazonaws.com/tmp/8df78bd3e76ceaa98d4d1eb226a34e25/unisex-premium-hoodie-black-front-672e28b8a5967.png",
    image_id: 2,
    image_url:
      "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/2.jpg",
  },
  {
    product_id: 380,
    variant_id: 10783,
    task_id: "gt-720769374",
    mock_url:
      "https://printful-upload.s3-accelerate.amazonaws.com/tmp/07d8bde08108855a48a1a7ab16cbf19c/unisex-premium-hoodie-black-front-672e28f74079f.png",
    image_id: 3,
    image_url:
      "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/3.jpg",
  },
  {
    product_id: 380,
    variant_id: 10783,
    task_id: "gt-720769600",
    mock_url:
      "https://printful-upload.s3-accelerate.amazonaws.com/tmp/f3ff92374f48b287b373afdecbe28df2/unisex-premium-hoodie-black-front-672e29362e7a9.png",
    image_id: 4,
    image_url:
      "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/4.jpg",
  },
  {
    product_id: 380,
    variant_id: 10783,
    task_id: "gt-720769880",
    mock_url:
      "https://printful-upload.s3-accelerate.amazonaws.com/tmp/a8520cdd24e7c3bea82a7d69359b218c/unisex-premium-hoodie-black-front-672e2972d23a8.png",
    image_id: 5,
    image_url:
      "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/5.jpg",
  },
  {
    product_id: 380,
    variant_id: 10783,
    task_id: "gt-720770153",
    mock_url:
      "https://printful-upload.s3-accelerate.amazonaws.com/tmp/7903c88f51571e920bed4976135e5b3c/unisex-premium-hoodie-black-front-672e29b2207da.png",
    image_id: 6,
    image_url:
      "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/6.jpg",
  },
  {
    product_id: 380,
    variant_id: 10783,
    task_id: "gt-720770486",
    mock_url:
      "https://printful-upload.s3-accelerate.amazonaws.com/tmp/f59298ec4d9ad573767040a64a056f02/unisex-premium-hoodie-black-front-672e29f079517.png",
    image_id: 7,
    image_url:
      "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/7.jpg",
  },
  {
    product_id: 380,
    variant_id: 10783,
    task_id: "gt-720770780",
    mock_url:
      "https://printful-upload.s3-accelerate.amazonaws.com/tmp/cdddab15ee5b3614b7c871459392f928/unisex-premium-hoodie-black-front-672e2a307b2ae.png",
    image_id: 8,
    image_url:
      "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/8.jpg",
  },
  {
    product_id: 57,
    variant_id: 3460,
    task_id: "gt-720770937",
    mock_url:
      "https://printful-upload.s3-accelerate.amazonaws.com/tmp/83803cc2af8dd62b7e6577d2e3e617e5/mens-long-sleeve-shirt-black-front-672e2a4ee0233.png",
    image_id: 1,
    image_url:
      "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/1.jpg",
  },
  {
    product_id: 57,
    variant_id: 3460,
    task_id: "gt-720771202",
    mock_url:
      "https://printful-upload.s3-accelerate.amazonaws.com/tmp/a78cee124367b049cbb9faab3cc55236/mens-long-sleeve-shirt-black-front-672e2a8e1da88.png",
    image_id: 2,
    image_url:
      "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/2.jpg",
  },
  {
    product_id: 57,
    variant_id: 3460,
    task_id: "gt-720771469",
    mock_url:
      "https://printful-upload.s3-accelerate.amazonaws.com/tmp/52fe30c0f78c38614d4a75179ed3fc6e/mens-long-sleeve-shirt-black-front-672e2acc5d828.png",
    image_id: 3,
    image_url:
      "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/3.jpg",
  },
  {
    product_id: 57,
    variant_id: 3460,
    task_id: "gt-720771732",
    mock_url:
      "https://printful-upload.s3-accelerate.amazonaws.com/tmp/15007949ecd4bd208a4e8e25fbf6d81e/mens-long-sleeve-shirt-black-front-672e2b0ac99e8.png",
    image_id: 4,
    image_url:
      "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/4.jpg",
  },
  {
    product_id: 57,
    variant_id: 3460,
    task_id: "gt-720771951",
    mock_url:
      "https://printful-upload.s3-accelerate.amazonaws.com/tmp/6d4e65195db96be481d5510990192ef9/mens-long-sleeve-shirt-black-front-672e2b47a435d.png",
    image_id: 5,
    image_url:
      "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/5.jpg",
  },
  {
    product_id: 57,
    variant_id: 3460,
    task_id: "gt-720772248",
    mock_url:
      "https://printful-upload.s3-accelerate.amazonaws.com/tmp/c3c390bd812dd0539c6ca2f0d1609fb1/mens-long-sleeve-shirt-black-front-672e2b864fa1f.png",
    image_id: 6,
    image_url:
      "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/6.jpg",
  },
  {
    product_id: 57,
    variant_id: 3460,
    task_id: "gt-720772550",
    mock_url:
      "https://printful-upload.s3-accelerate.amazonaws.com/tmp/2a36f6dea3f578a7d52b558c05086a5b/mens-long-sleeve-shirt-black-front-672e2bc4d15e1.png",
    image_id: 7,
    image_url:
      "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/7.jpg",
  },
  {
    product_id: 57,
    variant_id: 3460,
    task_id: "gt-720772825",
    mock_url:
      "https://printful-upload.s3-accelerate.amazonaws.com/tmp/a3e74c14b03d520d7fa8942c680b759c/mens-long-sleeve-shirt-black-front-672e2c02dc6ff.png",
    image_id: 8,
    image_url:
      "https://dgnxfezulyrmrzpqrupk.supabase.co/storage/v1/object/public/assets/8.jpg",
  },
];
export { mockImages };
