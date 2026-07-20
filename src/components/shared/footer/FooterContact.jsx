import Link from 'next/link';
import { FiMail } from '@react-icons/all-files/fi/FiMail';
import { FiMapPin } from '@react-icons/all-files/fi/FiMapPin';
import { FiPhone } from '@react-icons/all-files/fi/FiPhone';

const contactInfo = {
  address: 'Section-12 Block-D, Lane-6 Plot-I/15, Pallabi Mirpur Dhaka-1216',
  phones: ['+8801835847678'],
  emails: ['mssumetreader@gmail.com'],
};

export default function FooterContact() {
  return (
    <div>
      <h4 className="font-bold text-white mb-6 uppercase tracking-wide">
        CONTACT
      </h4>
      <ul className="space-y-4">
        <li className="flex items-start space-x-3">
          <span className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
            <FiMapPin className="w-4 h-4 text-white/80" aria-hidden="true" />
          </span>
          <span className="text-sm text-white/70 leading-relaxed">
            {contactInfo.address}
          </span>
        </li>
        <li className="flex items-start space-x-3">
          <span className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
            <FiPhone className="w-4 h-4 text-white/80" aria-hidden="true" />
          </span>
          <div className="text-sm text-white/70 space-y-1">
            {contactInfo.phones.map((phone, idx) => (
              <div key={idx}>
                <Link
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="hover:text-white transition-colors"
                >
                  {phone}
                </Link>
              </div>
            ))}
          </div>
        </li>
        <li className="flex items-start space-x-3">
          <span className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
            <FiMail className="w-4 h-4 text-white/80" aria-hidden="true" />
          </span>
          <div className="text-sm text-white/70 space-y-1">
            {contactInfo.emails.map((email, idx) => (
              <div key={idx}>
                <Link
                  href={`mailto:${email}`}
                  className="hover:text-white transition-colors"
                >
                  {email}
                </Link>
              </div>
            ))}
          </div>
        </li>
      </ul>
    </div>
  );
}

