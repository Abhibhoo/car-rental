import type mongoose from "mongoose"
import { Schema, models, model } from "mongoose"

export interface CarDoc extends mongoose.Document {
  model: string
  pricePerDay: number
  location: string
  availableFrom: string // ISO YYYY-MM-DD
  s3Key: string
  s3Url: string
  createdAt: Date
}

const CarSchema = new Schema<CarDoc>(
  {
    model: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    location: { type: String, required: true },
    availableFrom: { type: String, required: true },
    s3Key: { type: String, required: true },
    s3Url: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "cars" },
)

export const Car = models.Car || model<CarDoc>("Car", CarSchema)
