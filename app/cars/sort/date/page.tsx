import { CarTable } from "@/components/car-table"

export default async function CarsSortByDate() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/cars?sort=date&order=asc`, {
    next: { revalidate: 5 },
  })
  const data = res.ok ? await res.json() : { cars: [] }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Cars sorted by availability (soonest first)</h1>
      <CarTable cars={data.cars || []} />
    </main>
  )
}
