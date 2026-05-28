import Link from "next/link";
import type { NavLinkItem } from "@/utils/nav";

interface NavDropdownProps {
  label: string;
  href: string;
  links: NavLinkItem[];
}

export function NavDropdown({ label, href, links }: NavDropdownProps) {
  return (
    <div className="dropdown dropdown-end dropdown-hover relative">
      <Link href={href} className="btn btn-ghost btn-sm">
        {label}
      </Link>
      <div aria-hidden className="absolute top-full right-0 h-2 w-52" />
      <ul
        tabIndex={0}
        className="dropdown-content menu rounded-box z-10 mt-2 w-52 max-h-80 overflow-y-auto bg-base-200 p-2 shadow-lg backdrop-blur"
      >
        {links.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
