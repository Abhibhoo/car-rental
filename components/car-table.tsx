import Link from "next/link"

type Car = {
  _id: string
  model: string
  pricePerDay: number
  location: string
  availableFrom: string
  s3Url: string
}

export function CarTable({ cars }: { cars: Car[] }) {
  if (!cars?.length) return <div className="text-gray-400">No cars found.</div>

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-800">
      <table className="min-w-full divide-y divide-gray-800">
        <thead className="bg-gray-900">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Model</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Price/Day</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Location</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Available From</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">View</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {cars.map((c) => (
            <tr key={c._id} className="bg-gray-950">
              <td className="px-4 py-3 text-sm">{c.model}</td>
              <td className="px-4 py-3 text-sm">${c.pricePerDay}</td>
              <td className="px-4 py-3 text-sm">{c.location}</td>
              <td className="px-4 py-3 text-sm">{new Date(c.availableFrom).toLocaleDateString()}</td>
              <td className="px-4 py-3 text-sm">
                <Link
                  href={c.s3Url}
                  target="_blank"
                  className="inline-flex items-center rounded-md bg-orange-600 px-3 py-1 text-xs font-medium text-white hover:bg-orange-700"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
