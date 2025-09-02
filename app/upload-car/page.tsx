"use client"

import type React from "react"
import { useState } from "react"

type UploadResponse = { key: string; url: string }

export default function UploadCarPage() {
  const [model, setModel] = useState("")
  const [pricePerDay, setPricePerDay] = useState<number | "">("")
  const [location, setLocation] = useState("")
  const [availableFrom, setAvailableFrom] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (!file) return setError("Please select a file (image or PDF).")
    if (!model || !pricePerDay || !location || !availableFrom) return setError("Please fill all fields.")

    try {
      setSubmitting(true)
      const presignRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      })
      if (!presignRes.ok) throw new Error(await presignRes.text())
      const { key, url } = (await presignRes.json()) as UploadResponse

      const putRes = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      })
      if (!putRes.ok) throw new Error(await putRes.text())

      const saveRes = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          pricePerDay: Number(pricePerDay),
          location,
          availableFrom, // YYYY-MM-DD
          s3Key: key,
        }),
      })
      if (!saveRes.ok) throw new Error(await saveRes.text())

      setMessage("Car uploaded successfully!")
      setModel("")
      setPricePerDay("")
      setLocation("")
      setAvailableFrom("")
      setFile(null)
    } catch (err: any) {
      setError(err?.message || "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Upload a car</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm mb-2">Model</label>
          <input
            type="text"
            className="w-full rounded-md bg-gray-900 border border-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600"
            placeholder='e.g., "Toyota Corolla 2022"'
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2">Price per day (USD)</label>
            <input
              type="number"
              min={0}
              className="w-full rounded-md bg-gray-900 border border-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600"
              placeholder="60"
              value={pricePerDay}
              onChange={(e) => setPricePerDay(e.target.value === "" ? "" : Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Location (city)</label>
            <input
              type="text"
              className="w-full rounded-md bg-gray-900 border border-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600"
              placeholder="Pune"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-2">Available from</label>
          <input
            type="date"
            className="w-full rounded-md bg-gray-900 border border-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600"
            value={availableFrom}
            onChange={(e) => setAvailableFrom(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-2">File (image or PDF)</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-300 file:mr-4 file:rounded-md file:border-0 file:bg-orange-600 file:px-4 file:py-2 file:text-white hover:file:bg-orange-700"
            required
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            disabled={submitting}
            className="inline-flex items-center rounded-md bg-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
            type="submit"
          >
            {submitting ? "Uploading..." : "Upload"}
          </button>
          {message && <span className="text-green-400 text-sm">{message}</span>}
          {error && <span className="text-red-400 text-sm">{error}</span>}
        </div>
      </form>
    </main>
  )
}
