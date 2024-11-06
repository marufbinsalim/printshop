// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

let images = [
  {
    id: 1,
    url: "https://cdn.discordapp.com/attachments/1025064934385655891/1303808332640817162/3355922023333948158_63902245211.jpg?ex=672d19a2&is=672bc822&hm=5de3b7d4244a879cb6949cc702e741329a4ed2e6277d3184286ec41345ad6b6c&",
    alt: "Sunlit mountain landscape with clear blue skies",
    caption: "A serene mountain view bathed in sunlight.",
  },
  {
    id: 2,
    url: "https://cdn.discordapp.com/attachments/1025064934385655891/1303808333240733871/3355922339433404331_63902245211.jpg?ex=672d19a2&is=672bc822&hm=d1f74143b814c29d0cfe27564474970d9c9de96773ceb1048200bbebfad21fec&",
    alt: "Lush forest with a tranquil river running through",
    caption: "A calming view of a river flowing through dense forest.",
  },
  {
    id: 3,
    url: "https://cdn.discordapp.com/attachments/1025064934385655891/1303808333731598396/3355923748375041556_63902245211.jpg?ex=672d19a2&is=672bc822&hm=d2aabd3b31213f793fb0470d1583dd3816fe68377a580525131bdff160694fb6&",
    alt: "Dramatic sunset over rolling hills",
    caption: "A picturesque sunset illuminating rolling hills.",
  },
  {
    id: 4,
    url: "https://cdn.discordapp.com/attachments/1025064934385655891/1303808334129790986/3355924048318253101_63902245211.jpg?ex=672d19a2&is=672bc822&hm=7800d3c4512e158aec30a0a26b505a08a2a9137d242a1857f5205073e59add54&",
    alt: "Snow-capped mountains under a vibrant sunrise",
    caption: "A stunning view of snow-covered peaks at sunrise.",
  },
  {
    id: 5,
    url: "https://cdn.discordapp.com/attachments/1025064934385655891/1303808334612398202/3355931321158004377_63902245211.jpg?ex=672d19a2&is=672bc822&hm=04e89d58aa33ae162a168eeb8ad742ad82eb06e69e311b8ee439de9f0065ffde&",
    alt: "Peaceful lake surrounded by mountains",
    caption: "A lake surrounded by majestic mountains under clear skies.",
  },
  {
    id: 6,
    url: "https://cdn.discordapp.com/attachments/1025064934385655891/1303808335136555061/3355931622912979577_63902245211.jpg?ex=672d19a2&is=672bc822&hm=0a6d094efd369e323465a5df1a891e29e1cd975b1791a668274d2bff60e2df75&",
    alt: "Rocky coastline at sunset with crashing waves",
    caption: "Waves crashing against a rocky coast at sunset.",
  },
  {
    id: 7,
    url: "https://cdn.discordapp.com/attachments/1025064934385655891/1303808335560183910/3355938903645322175_63902245211.jpg?ex=672d19a2&is=672bc822&hm=1c749f1ae7870a159e6b8c206d9a81ac2c182e5d11b768087274ef0d8f6bff92&",
    alt: "Vast desert with sand dunes under a bright sky",
    caption: "A vast desert landscape with rolling sand dunes.",
  },
  {
    id: 8,
    url: "https://cdn.discordapp.com/attachments/1025064934385655891/1303808335916830830/3355939156251624982_63902245211.jpg?ex=672d19a2&is=672bc822&hm=a1073a92b20f643a68c2d60a9f379767abcda4c8974c51f3ef04c0798179df4e&",
    alt: "Dense jungle with sunlight filtering through trees",
    caption: "A lush jungle with sunlight peeking through the canopy.",
  },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  let id = req?.body?.id;
  if (id) {
    id = parseInt(id);
  }

  if (!id) {
    return res.status(400).json({ message: "Missing id" });
  }

  const image = images.find((image) => image.id === id);

  res.status(200).json({ image: image });
}
