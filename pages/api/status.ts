import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  try {
    console.log('req.query:', req.query);
    console.log('email:', req.query.id);

    const nftId = req.query.id;
    const url = `${process.env.API_URL}/${process.env.COLLECTION_ID}/nfts/${nftId}`;
    console.log('url: ', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        "content-type": "application/json",
        "x-client-secret": process.env.CLIENT_SECRET as string,
        "x-project-id": process.env.PROJECT_ID as string
      }
    });
    
    return res.status(response.status).json(await response.json());
  }
  catch (error: any) {
    res.json(error);
    res.status(405).end();
  }
}
