import CheckoutFormField from './CheckoutFormField';
import { useAuth } from '@/contexts/AuthContext';

export default function PersonalInfoSection({ formData, errors, onChange, onBlur }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-200">
        Personal Information
      </h3>

      {!isAuthenticated() && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Guest Checkout:</strong> You're checking out as a guest. Enter your email to receive order confirmation and updates.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5">
        <CheckoutFormField
          id="firstName"
          name="firstName"
          label="First Name"
          value={formData.firstName}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="Enter your first name"
          error={errors.firstName}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <CheckoutFormField
          id="email"
          name="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="your.email@example.com"
          error={errors.email}
        />
        <CheckoutFormField
          id="phone"
          name="phone"
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="01XXXXXXXXX"
          error={errors.phone}
          required
        />
      </div>
    </div>
  );
}
