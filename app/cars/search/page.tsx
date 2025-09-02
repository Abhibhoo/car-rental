"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { CarTable } from "@/components/car-table"

type Car = {
  _id: string
  model: string
  pricePerDay: number
  location: string
  availableFrom: string
  s3Url: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function CarsSearchPage() {
  const [q, setQ] = useState("")
  const [city, setCity] = useState("")
  const [submitted, setSubmitted] = useState<{ q?: string; city?: string }>({})

  const key = useMemo(() => {
    const params = new URLSearchParams()
    if (submitted.city) params.set("location", submitted.city)
    if (submitted.q) params.set("q", submitted.q)
    return `/api/cars?${params.toString()}`
  }, [submitted])

  const { data, isLoading, mutate } = useSWR<{ cars: Car[] }>(key, fetcher)

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Search cars</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          placeholder="Search by model (e.g., Corolla)"
          className="rounded-md bg-gray-900 border border-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <input
          placeholder="City (e.g., Pune)"
          className="rounded-md bg-gray-900 border border-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          onClick={() => {
            setSubmitted({ q, city })
            mutate()
          }}
          className="inline-flex items-center justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>
      <CarTable cars={data?.cars || []} />
    </main>
  )
}
