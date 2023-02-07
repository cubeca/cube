import express, { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import axios from "axios"
import * as jwt from "jsonwebtoken"

import * as db from "./db/queries"
import * as settings from './settings'

export const CLOUDFLARE_API_STREAM = `https://api.cloudflare.com/client/v4/accounts/${settings.CLOUDFLARE_ACCOUNT_ID}/stream?direct_user=true`

const app = express()

app.use(cors())
app.use(express.json())

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(
    token,
    settings.JWT_TOKEN_SECRET as string,
    (err: any, data: any) => {
      if (err) return res.sendStatus(403)
      req.user = data.user
      next()
    }
  )
}

app.get("/get-upload-url", authenticateToken, async (req: Request, res: Response) => {
  if (!req.headers["upload-length"]) {
    return res
      .status(400)
      .send(`Invalid Request Header. 'upload-length' required`)
  }

  if (!req.headers["file-name"]) {
    return res.status(400).send(`Invalid Request Header. 'file-name' required`)
  }

  try {
    const cfResponse = await axios.post(CLOUDFLARE_API_STREAM, null, {
      headers: {
        Authorization: `bearer ${settings.CLOUDFLARE_API_TOKEN}`,
        "Tus-Resumable": "1.0.0",
        "Upload-Length": req.headers["upload-length"] as string,
        "Upload-Metadata": req.headers["upload-metadata"] as string,
      },
    })

    const destination = cfResponse.headers["location"]
    const streamId = cfResponse.headers["stream-media-id"]

    await db.insertFileDetails(
      streamId as string,
      req?.user?.uuid as string,
      req.headers["file-name"] as string
    )

    console.log("Setting Response Headers")

    res.set({
      "Access-Control-Expose-Headers": "Location",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Origin": "*",
      Location: destination,
    })
    res.status(200).send("OK")
  } catch (e: any) {
    console.error(e.message)
    res.status(500).send("Error retrieving content upload url")
  }
})

app.listen(settings.PORT, async () => {
  console.log(`Listening on port ${settings.PORT}`)
})
