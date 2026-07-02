import { HiOutlineLocationMarker } from 'react-icons/hi';
import FormField from './FormField';

export default function AddressInformationCard({ 
  profileData, 
  isEditing, 
  onChange,
  errors = {}
}) {
  return (
    <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <div className="p-2 bg-black rounded-lg">
          <HiOutlineLocationMarker className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Address Information
        </h2>
      </div>

      <div className="space-y-5">
        <FormField
          id="streetAddress"
          name="streetAddress"
          label="Street Address"
          value={profileData.streetAddress}
          onChange={onChange}
          placeholder="123 Main Street"
          isEditing={isEditing}
          error={errors.streetAddress}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <FormField
            id="townCity"
            name="townCity"
            label="City"
            value={profileData.townCity}
            onChange={onChange}
            placeholder="New York"
            isEditing={isEditing}
          />
          <FormField
            id="state"
            name="state"
            label="State"
            value={profileData.state}
            onChange={onChange}
            placeholder="NY"
            isEditing={isEditing}
          />
          <FormField
            id="zipCode"
            name="zipCode"
            label="ZIP Code"
            value={profileData.zipCode}
            onChange={onChange}
            placeholder="10001"
            isEditing={isEditing}
          />
        </div>
      </div>
    </div>
  );
}
