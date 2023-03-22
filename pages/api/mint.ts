import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch';
import crypto from 'crypto';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  try {
    const nftId = crypto.createHash('sha1').update(req.body.email).digest('hex');
    console.log('req.body:', req.body);
    console.log('email:', req.body.email);
    console.log('nftId:', nftId);
    const recipientString = `email:${req.body.email}:polygon`;

    const url = `${process.env.API_URL}/${process.env.COLLECTION_ID}/nfts/${nftId}`;

    console.log('url: ', url);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        "content-type": "application/json",
        "x-client-secret": process.env.CLIENT_SECRET as string,
        "x-project-id": process.env.PROJECT_ID as string
      },
      body: JSON.stringify({
        recipient: recipientString,
        metadata: {
          name: 'Crossmint Minting API Demo',
          image: 'https://bafkreievg3akxgi2arfi6njrmkyy55vga5tfnav5nx2btcew2z7hbgpbyy.ipfs.nftstorage.link/',
          description: 'Demo collection showcasing how easy it is to MINT NFTs with API'
        },
        reuploadLinkedFiles: false
      })
    });
    
    return res.status(response.status).json(await response.json());
  }
  catch (error: any) {
    res.json(error);
    res.status(405).end();
  }
}
