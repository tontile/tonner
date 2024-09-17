"use client";

import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="absolute top-0 w-full flex items-center justify-between p-4 z-10">
      <span className="hidden md:block text-sm font-medium">Tonner</span>

      <Link href="/">
        <Image
          src="/logo-dark.png"
          alt="tonner logo"
          width={60}
          quality={100}
          height={60}
          className="md:absolute md:left-1/2 md:top-5 md:-translate-x-1/2 shadow-2xlshadow-white-500/50"
        />
      </Link>

      <nav className="md:mt-2">
        <ul className="flex items-center gap-4">
          <li>
            <a
              href="https://github.com/tontile/tonner"
              className="text-sm px-4 py-2 bg-primary text-secondary rounded-full font-medium"
            >
              Github
            </a>
          </li>
          <li>
            <a
              href="https://t.me/tonnerapp"
              className="text-sm px-4 py-2 bg-secondary text-primary rounded-full font-medium cursor-pointer"
            >
              Telegram
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
