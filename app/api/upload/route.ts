import { type NextRequest, NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import crypto from "crypto"

const REGION = process.env.AWS_REGION!
const BUCKET = process.env.S3_BUCKET_NAME!
const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID!
const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY!

if (!REGION || !BUCKET || !ACCESS_KEY || !SECRET_KEY) {
  throw new Error("Missing AWS S3 environment variables")
}

const s3 = new S3Client({
  region: REGION,
  credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY },
})

export async function POST(req: NextRequest) {
  try {
    const { filename, contentType } = await req.json()
    if (!filename || !contentType) {
      return NextResponse.json({ error: "filename and contentType are required" }, { status: 400 })
    }
    if (!/^image\/.+/.test(contentType) && contentType !== "application/pdf") {
      return NextResponse.json({ error: "Only images and PDFs are allowed" }, { status: 400 })
    }

    const safeName = String(filename).replace(/[^a-zA-Z0-9._-]/g, "_")
    const key = `uploads/${Date.now()}-${crypto.randomBytes(6).toString("hex")}-${safeName}`

    const putCommand = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType,
    })

    const url = await getSignedUrl(s3, putCommand, { expiresIn: 60 })
    return NextResponse.json({ key, url })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to create upload URL" }, { status: 500 })
  }
}
