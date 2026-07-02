import Link from 'next/link';

export default function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="text-base font-bold text-white mb-6 uppercase tracking-wide">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex items-center text-sm text-white/70 hover:text-white transition-all duration-200 hover:translate-x-1"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

