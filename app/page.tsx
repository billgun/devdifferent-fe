import MapComponent from "@/components/map";
import Navbar from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  // const session = await fetchUserSession();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-8 gap-8">
        <div className="w-full max-w-5xl rounded-lg overflow-hidden shadow-lg">
          <MapComponent />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold">Explore Our Map</h2>
            <p className="text-muted-foreground">
              Navigate through our interactive map to discover locations and
              points of interest. Our mapping solution provides real-time data
              and seamless navigation.
            </p>
            <div className="flex gap-4">
              <Link
                href="/explore"
                className="rounded-full bg-foreground text-background px-5 py-2 font-medium hover:bg-foreground/90 transition-colors"
              >
                Start Exploring
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold">Features</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Interactive mapping with real-time updates</li>
              <li>Custom location markers and routing</li>
              <li>Detailed information about points of interest</li>
              <li>Save your favorite locations for quick access</li>
            </ol>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t flex flex-col md:flex-row gap-4 items-center justify-center md:justify-between px-8">
        <div className="flex items-center gap-2">
          <span className="font-semibold">DevDifferent</span>
          <span className="text-muted-foreground">
            © {new Date().getFullYear()}
          </span>
        </div>

        <div className="flex gap-6">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/file.svg"
              alt="File icon"
              width={16}
              height={16}
            />
            Documentation
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
            />
            Support
          </a>
        </div>
      </footer>
    </div>
  );
}
