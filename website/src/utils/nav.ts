export interface NavLinkItem {
  href: string;
  label: string;
}

export const RESOURCE_NAV_LINKS: NavLinkItem[] = [
  { href: "/breaches", label: "Data Breaches" },
  { href: "/resources/gdpr-generator", label: "GDPR Generator" },
  { href: "/resources/authorities", label: "DPAs" },
  { href: "/changelog", label: "Changelog" },
];
