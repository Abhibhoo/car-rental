type Car = {
  _id: string
  model: string
  pricePerDay: number
  location: string
  availableFrom: string
  s3Key: string
  s3Url: string
  createdAt: string
}

function isPdf(key: string) {
  return key?.toLowerCase()?.endsWith(".pdf")
}

export async function LatestCars() {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/cars?sort=created&order=desc&limit=8`
  const res = await fetch(url, { next: { revalidate: 10 } })
  if (!res.ok) {
    return <div className="text-red-400">Failed to load cars.</div>
  }
  const data: { cars: Car[] } = await res.json()
  const cars = data.cars || []

  if (!cars.length) {
    return <div className="text-gray-400">No cars uploaded yet.</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cars.map((car) => (
        <a
          key={car._id}
          href={car.s3Url}
          target="_blank"
          rel="noreferrer"
          className="group rounded-lg border border-gray-800 bg-gray-900 hover:bg-gray-850 transition-colors p-4 flex flex-col gap-3"
        >
          <div className="relative w-full aspect-video rounded-md overflow-hidden bg-gray-800">
            {isPdf(car.s3Key) ? (
              <div className="h-full w-full grid place-items-center text-gray-300 text-sm">PDF document</div>
            ) : (
              <img
                src={car.s3Url || "/placeholder.svg?height=360&width=640&query=car%20image"}
                alt={car.model || "Car image"}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-lg">{car.model}</h3>
            <p className="text-gray-400 text-sm">
              {car.location} • Available {new Date(car.availableFrom).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-orange-400 font-semibold">₹{car.pricePerDay}/day</span>
            <span className="inline-flex items-center rounded-md bg-orange-600 px-3 py-1 text-xs font-medium text-white group-hover:bg-orange-700 transition-colors">
              View
            </span>
          </div>
        </a>
      ))}
    </div>
  )
}
