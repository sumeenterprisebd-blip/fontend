import CheckoutFormField from './CheckoutFormField';
import CheckoutSelectField from './CheckoutSelectField';

const deliveryAreas = [
  { value: 'Inside Dhaka', label: 'Inside Dhaka' },
  { value: 'Outside Dhaka', label: 'Outside Dhaka' }
];

export default function DeliveryInfoSection({ formData, errors, onChange, onBlur, onDeliveryAreaChange }) {
  const handleDeliveryAreaChange = (e) => {
    onChange(e);
    if (onDeliveryAreaChange) {
      onDeliveryAreaChange(e.target.value);
    }
  };

  return (
    <div className="space-y-5 pt-2">
      <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-200">
        Shipping Address
      </h3>

      <CheckoutFormField
        id="streetAddress"
        name="streetAddress"
        label="Address"
        value={formData.streetAddress}
        onChange={onChange}
        onBlur={onBlur}
        placeholder="House, road, area, etc."
        error={errors.streetAddress}
        required
      />

      <CheckoutSelectField
        id="deliveryArea"
        name="townCity"
        label="Delivery Area"
        value={formData.townCity}
        onChange={handleDeliveryAreaChange}
        onBlur={onBlur}
        options={deliveryAreas}
        error={errors.townCity}
        required
      />
    </div>
  );
}

