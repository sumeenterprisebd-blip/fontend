import { FiShield, FiAlertTriangle } from 'react-icons/fi';

const CheckboxRow = ({ label, description, checked, onChange, disabled = false }) => {
    return (
        <label className={`flex items-start gap-3 ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
            <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={!!checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
            />
            <span className="space-y-1">
                <span className="block text-sm font-medium text-gray-900">{label}</span>
                {description ? (
                    <span className="block text-sm text-gray-600">{description}</span>
                ) : null}
            </span>
        </label>
    );
};

const NumberField = ({ label, value, onChange, min, max, step = 1, suffix }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    min={min}
                    max={max}
                    step={step}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                {suffix ? <span className="text-sm text-gray-500 whitespace-nowrap">{suffix}</span> : null}
            </div>
        </div>
    );
};

export default function OrderSecuritySettingsTab({ settings, onChange }) {
    const os = settings.orderSecurity || {};

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-2">
                <FiShield className="text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-900">Order Security</h3>
            </div>

            <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <div className="flex items-start gap-3">
                    <FiAlertTriangle className="mt-0.5 text-gray-600" />
                    <div className="text-sm text-gray-700">
                        These controls help reduce fake orders by enforcing verification rules and monitoring suspicious patterns.
                    </div>
                </div>
            </div>

            {/* Approval */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900">Approval workflow</h4>

                <CheckboxRow
                    label="Require approval for risky orders"
                    description="When enabled, high-risk orders are marked as requiring admin approval before confirmation."
                    checked={os.enableRiskApproval}
                    onChange={(v) => onChange('orderSecurity.enableRiskApproval', v)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <NumberField
                        label="Risk approval threshold"
                        value={os.riskApprovalThreshold}
                        onChange={(v) => onChange('orderSecurity.riskApprovalThreshold', v)}
                        min={0}
                        max={200}
                        step={1}
                        suffix="score"
                    />
                </div>
            </div>

            {/* Verification */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900">Verification</h4>

                <CheckboxRow
                    label="Require verified account before placing orders"
                    description="Blocks checkout if the user account is not verified."
                    checked={os.requireVerifiedForOrders}
                    onChange={(v) => onChange('orderSecurity.requireVerifiedForOrders', v)}
                />

                <CheckboxRow
                    label="Require OTP verification before placing orders"
                    description="For email OTP, customers must verify their email using a 6-digit code."
                    checked={os.requireOtpBeforeOrders}
                    onChange={(v) => onChange('orderSecurity.requireOtpBeforeOrders', v)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">OTP method</label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                            value={os.otpMethod}
                            onChange={(e) => onChange('orderSecurity.otpMethod', e.target.value)}
                            disabled={!os.requireOtpBeforeOrders}
                        >
                            <option value="none">None</option>
                            <option value="email">Email OTP</option>
                        </select>
                        <p className="mt-2 text-sm text-gray-600">Email OTP uses SMTP settings configured on the backend.</p>
                    </div>
                </div>
            </div>

            {/* Blocking rules */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900">Blocking rules</h4>

                <CheckboxRow
                    label="Block suspicious users"
                    description="Rejects order attempts from accounts flagged as suspicious by monitoring rules."
                    checked={os.blockSuspiciousUsers}
                    onChange={(v) => onChange('orderSecurity.blockSuspiciousUsers', v)}
                />

                <CheckboxRow
                    label="Require shipping phone to match account phone"
                    description="Blocks order placement if the checkout phone does not match the saved account phone."
                    checked={os.requireShippingPhoneMatchesAccount}
                    onChange={(v) => onChange('orderSecurity.requireShippingPhoneMatchesAccount', v)}
                />
            </div>

            {/* Phone validation */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900">Phone validation</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <NumberField
                        label="Minimum phone digits"
                        value={os.phoneMinDigits}
                        onChange={(v) => onChange('orderSecurity.phoneMinDigits', v)}
                        min={6}
                        max={20}
                        step={1}
                    />
                    <NumberField
                        label="Maximum phone digits"
                        value={os.phoneMaxDigits}
                        onChange={(v) => onChange('orderSecurity.phoneMaxDigits', v)}
                        min={6}
                        max={20}
                        step={1}
                    />
                </div>
            </div>

            {/* Duplicate detection */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900">Duplicate detection</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <NumberField
                        label="Duplicate order window"
                        value={os.duplicateOrderWindowHours}
                        onChange={(v) => onChange('orderSecurity.duplicateOrderWindowHours', v)}
                        min={1}
                        max={168}
                        step={1}
                        suffix="hours"
                    />
                </div>
            </div>

            {/* Shared IP */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900">Shared IP monitoring</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <NumberField
                        label="Shared IP window"
                        value={os.sharedIpWindowHours}
                        onChange={(v) => onChange('orderSecurity.sharedIpWindowHours', v)}
                        min={1}
                        max={168}
                        step={1}
                        suffix="hours"
                    />
                    <NumberField
                        label="Max users per IP"
                        value={os.sharedIpMaxUsers}
                        onChange={(v) => onChange('orderSecurity.sharedIpMaxUsers', v)}
                        min={2}
                        max={50}
                        step={1}
                        suffix="users"
                    />
                </div>
            </div>

            {/* Frequency */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900">Order frequency monitoring</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <NumberField
                        label="Rate window"
                        value={os.rateWindowMinutes}
                        onChange={(v) => onChange('orderSecurity.rateWindowMinutes', v)}
                        min={1}
                        max={120}
                        step={1}
                        suffix="minutes"
                    />
                    <NumberField
                        label="Max orders in window"
                        value={os.rateMaxInWindow}
                        onChange={(v) => onChange('orderSecurity.rateMaxInWindow', v)}
                        min={1}
                        max={50}
                        step={1}
                        suffix="orders"
                    />
                    <NumberField
                        label="Daily window"
                        value={os.rateDayHours}
                        onChange={(v) => onChange('orderSecurity.rateDayHours', v)}
                        min={1}
                        max={168}
                        step={1}
                        suffix="hours"
                    />
                    <NumberField
                        label="Max orders per day"
                        value={os.rateMaxPerDay}
                        onChange={(v) => onChange('orderSecurity.rateMaxPerDay', v)}
                        min={1}
                        max={200}
                        step={1}
                        suffix="orders"
                    />
                </div>
            </div>
        </div>
    );
}
