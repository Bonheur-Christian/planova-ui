import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-slate-50 text-center">
      <div className="w-80 h-80 mb-8 relative">
        <Image
          src="/images/404.png"
          alt="Page Not Found"
          fill
          className="object-contain"
        />
      </div>

      <h1 className="text-6xl font-extrabold text-color-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-primary mb-4">
        Oops! Page Not Found
      </h2>
     
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-color-primary text-primary font-medium rounded-lg border border-primary hover:scale-90 duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
}