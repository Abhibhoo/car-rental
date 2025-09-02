import Link from "next/link"
import { LatestCars } from "@/components/latest-cars"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-gray-800">
        <div className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-balance">CarRental</h1>
          <nav className="flex items-center gap-3">
            <Link
              href="/upload-car"
              className="inline-flex items-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
            >
              Upload Car
            </Link>
            <Link
              href="/cars"
              className="inline-flex items-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
            >
              View Cars
            </Link>
            <Link
              href="/cars/search"
              className="inline-flex items-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
            >
              Search
            </Link>
            <Link
              href="/cars/sort/price"
              className="inline-flex items-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
            >
              Sort
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-2 text-balance">Latest cars</h2>
          <p className="text-gray-400 text-pretty">
            Discover recently listed rentals. Tap any card to see the uploaded details.
          </p>
        </div>
        <LatestCars />
      </section>

      <footer className="border-t border-gray-800">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-gray-400">
          © {new Date().getFullYear()} CarRental. All rights reserved.
        </div>
      </footer>
    </main>
  )
}
