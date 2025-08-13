import Link from "next/link";

export function Footer() {
  return (
    <div className=" z-10 border-t border-white/10 py-6 text-xs text-white/70">
      <div className="mx-auto flex max-w-6xl justify-center items-center gap-2 px-0">
        <Link href={'/about'} className="text-white/60">About <span className="text-white">Darviz</span></Link>
        <span className="text-white/50">•</span>
        <p className="text-white/60">Proudly Built By <span className="text-white">Gatekeepr</span></p>
      </div>
    </div>
  );
}