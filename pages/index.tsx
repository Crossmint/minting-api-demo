import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@components/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [email, setEmail] = useState('')
  const [minting, setMinting] = useState(false)
  const [tokenPath, setTokenPath] = useState('')
  const [txnId, setTxnId] = useState('')

  const mintNFT = async () => {
    setMinting(true)
    setTxnId('')

    const response = await fetch("/api/mint", {
      method: "POST",
      body: JSON.stringify({
        email,
      }),
      headers: {
        "content-type": "application/json",
      },
    })

    const req = await response.json()

    if (req.onChain.status === 'pending') {
      getStatus(req)
    }
    else if (req.onChain.status === 'success') {
      saveTokenInfo(req)
    }
    else {
      console.log('error - request did not return valid status')
    }
  }

  const getStatus = async (mintStatus: any) => {
    if (mintStatus.onChain.status === 'pending') {
      setTimeout(async () => {
        const response = await fetch(`/api/status/?id=${mintStatus.id}`, {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
        })
    
        const req = await response.json();

        if (req.onChain.status === 'pending') {
          getStatus(req)
        }
        else if (req.onChain.status === 'success') {
          saveTokenInfo(req)
        }
        else {
          console.log('error - request did not return valid status')
        }
      }, 1000)
    }
  }

  const saveTokenInfo = (req: any) => {
    setTokenPath(`poly:${req.onChain.contractAddress}:${req.onChain.tokenId}`)
    setTxnId(req.onChain.txId)
    setMinting(false)
  }

  return (
    <>
      <Head>
        <title>Mint API Demo | Crossmint</title>
        <meta name="description" content="Live demo of minting an NFT to email or wallet address" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <div className={styles.description}>
          <p>
            Minting API Demo
          </p>
          <div>
            <Link
              href="https://www.crossmint.com"
              target="_blank"
            >
              By{' '}
              <Image
                src="/crossmint.png"
                alt="Crossmint Logo"
                width={100}
                height={20}
                priority
              />
            </Link>
          </div>
        </div>


        <div className="container mx-auto max-w-screen-lg">
          <div className="grid grid-cols-2 gap-10">
            <div className="flex flex-col w-full">
              <div className={styles.nftDemo}>
                <Image
                  src="/zenacademylogo.png"
                  alt="NFT Demo Image"
                  width={512}
                  height={512}
                  priority
                />
              </div>
            </div>

            <div className="flex flex-col w-full">
              <h2 className="text-2xl mb-3">Let's get started</h2>  
              
              <div className="my-10">
                {txnId ? 
                  <a href={`https://mumbai.polygonscan.com/tx/${txnId}`} target="_blank" className="group block rounded-lg p-6 bg-white ring-1 ring-slate-900/5 shadow-lg space-y-3 hover:bg-purple-700 hover:ring-purple-700">
                    <div className="flex items-justify space-x-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="gray" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                      </svg>

                      <h3 className="text-slate-900 group-hover:text-white text-sm font-semibold">Transaction Completed!</h3>
                    </div>
                    <p className="text-slate-500 group-hover:text-white text-sm">You can check out the results on polygonscan</p>
                  </a>
                  : ''
                }
                {minting ? 
                  <div role="status flex">
                    <div>
                      <svg aria-hidden="true" className="float-left w-8 h-8 mr-2 animate-spin text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                      </svg>
                    </div>
                    <div className="float-left pl-2 leading-8 text-md text-gray-400">Minting...</div>
                  </div>
                  : ''
                }
              </div>
            </div>
          </div>
        </div>       
      </main>
    </>
  )
}
