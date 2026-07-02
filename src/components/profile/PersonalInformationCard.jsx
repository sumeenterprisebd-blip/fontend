import { HiOutlineUser, HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';
import FormField from './FormField';

export default function PersonalInformationCard({ 
  profileData, 
  isEditing, 
  onChange,
  errors = {}
}) {
  return (
    <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <div className="p-2 bg-black rounded-lg">
          <HiOutlineUser className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Personal Information
        </h2>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField
            id="firstName"
            name="firstName"
            label="First Name"
            value={profileData.firstName}
            onChange={onChange}
            isEditing={isEditing}
            error={errors.firstName}
            required
          />
          <FormField
            id="lastName"
            name="lastName"
            label="Last Name"
            value={profileData.lastName}
            onChange={onChange}
            isEditing={isEditing}
            error={errors.lastName}
            required
          />
        </div>

        <FormField
          id="email"
          name="email"
          label="Email Address"
          type="email"
          value={profileData.email}
          onChange={onChange}
          isEditing={false}
          error={errors.email}
          icon={HiOutlineMail}
          disabled={true}
        />

        <FormField
          id="phone"
          name="phone"
          label="Phone Number"
          type="tel"
          value={profileData.phone}
          onChange={onChange}
          placeholder="+1 (555) 123-4567"
          isEditing={isEditing}
          error={errors.phone}
          icon={HiOutlinePhone}
        />

        {/* Login/Registration Details */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Login & Registration Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Email Address</span>
              <span className="text-sm font-medium text-gray-900">{profileData.email || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Login Method</span>
              <span className="text-sm font-medium text-gray-900">
                {profileData.googleId ? (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </span>
                ) : (
                  'Email & Password'
                )}
              </span>
            </div>
            {profileData.createdAt && (
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Registration Date</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(profileData.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Email Verification</span>
              <span className={`text-sm font-medium ${profileData.isEmailVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                {profileData.isEmailVerified ? '✓ Verified' : '⚠ Not Verified'}
              </span>
            </div>
            {profileData.role && (
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Account Type</span>
                <span className="text-sm font-medium text-gray-900 capitalize">{profileData.role}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
