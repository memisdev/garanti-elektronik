/**
 * Abstraction over router Link component.
 * During Next.js migration, change the import below to next/link.
 */
import { Link, type LinkProps } from "react-router-dom";

export default function AppLink(props: LinkProps) {
  return <Link {...props} />;
}
