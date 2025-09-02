import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Car } from "@/lib/models/car"

const REGION = process.env.AWS_REGION!
const BUCKET = process.env.S3_BUCKET_NAME!

function publicUrlFromKey(key: string) {
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)

    const location = searchParams.get("location")
    const q = searchParams.get("q")
    const sortParam = (searchParams.get("sort") || "").toLowerCase() // price | date | created
    const orderParam = (searchParams.get("order") || "asc").toLowerCase() // asc | desc
    const limitParam = searchParams.get("limit")

    const filter: Record<string, any> = {}
    if (location) filter.location = { $regex: `^${location}$`, $options: "i" }
    if (q) filter.model = { $regex: q, $options: "i" }

    const sort: Record<string, 1 | -1> = {}
    if (sortParam === "price") sort.pricePerDay = orderParam === "desc" ? -1 : 1
    else if (sortParam === "date") sort.availableFrom = orderParam === "desc" ? -1 : 1
    else if (sortParam === "created") sort.createdAt = orderParam === "desc" ? -1 : 1

    let query = Car.find(filter)
    if (Object.keys(sort).length) query = query.sort(sort)
    if (limitParam) query = query.limit(Number(limitParam))

    const cars = await query.lean()
    return NextResponse.json({ cars })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to fetch cars" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const { model, pricePerDay, location, availableFrom, s3Key, s3Url } = body || {}
    if (!model || !pricePerDay || !location || !availableFrom || !s3Key) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    const finalS3Url = s3Url || publicUrlFromKey(s3Key)
    const doc = await Car.create({ model, pricePerDay, location, availableFrom, s3Key, s3Url: finalS3Url })
    return NextResponse.json({ car: doc }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to save car" }, { status: 500 })
  }
}
