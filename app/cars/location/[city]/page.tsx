import { CarTable } from "@/components/car-table"

export default async function CarsByCityPage({ params }: { params: { city: string } }) {
  const city = decodeURIComponent(params.city)
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/cars?location=${encodeURIComponent(city)}`, {
    next: { revalidate: 5 },
  })
  const data = res.ok ? await res.json() : { cars: [] }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Cars in {city}</h1>
      <CarTable cars={data.cars || []} />
    </main>
  )
}
