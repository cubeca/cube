import * as dotenv from "dotenv"
import * as express from "express"
import * as cors from "cors"
// import * as helmet from 'helmet';
import axios from "axios"
import * as db from "../db/queries"
import * as jwt from "jsonwebtoken"

dotenv.config()

export const APP_URL: string = process.env.REACT_APP_ORIGIN || ""
export const API_URL: string = process.env.REACT_APP_API_URL || ""

export const DEFAULT_API_VERSION = "v1"
export const API_BASE_PATH = `/api/${DEFAULT_API_VERSION}`

export const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID
export const CLOUDFLARE_API_STREAM = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream?direct_user=true`
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN

const PORT: number = parseInt((process.env.PORT as string) || "8080", 10)

const app = express()

// app.use(helmet());
app.use(cors())
app.use(express.json())

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(
    token,
    process.env.JWT_TOKEN_SECRET as string,
    (err: any, data: any) => {
      if (err) return res.sendStatus(403)
      req.user = data.user
      next()
    }
  )
}

app.get("/get-upload-url", authenticateToken, async (req, res) => {
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
        Authorization: `bearer ${CLOUDFLARE_API_TOKEN}`,
        "Tus-Resumable": "1.0.0",
        "Upload-Length": req.headers["upload-length"] as string,
        "Upload-Metadata": req.headers["upload-metadata"] as string,
      },
    })

    const destination = cfResponse.headers["location"]
    const streamId = cfResponse.headers["stream-media-id"]

    await db.insertFileDetails(
      streamId,
      req.user.uuid,
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
  } catch (e) {
    console.error(e.message)
    res.status(500).send("Error retrieving content upload url")
  }
})

app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`)
})
