import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { HiPencil } from 'react-icons/hi';
import Breadcrumb from '@/components/shop/Breadcrumb';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import PersonalInformationCard from '@/components/profile/PersonalInformationCard';
import AddressInformationCard from '@/components/profile/AddressInformationCard';
import AccountSummaryCard from '@/components/profile/AccountSummaryCard';
import QuickActionsCard from '@/components/profile/QuickActionsCard';
import ProfileActionButtons from '@/components/profile/ProfileActionButtons';
import OrderHistoryCard from '@/components/profile/OrderHistoryCard';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';

const SweetAlert = dynamic(() => import('@/components/shared/SweetAlert'), { ssr: false });

export default function ProfilePage() {
  const router = useRouter();
  const { isAdmin, isAuthenticated } = useAuth();
  const {
    profileData,
    accountStats,
    isEditing,
    isSaving,
    loading,
    showSuccessAlert,
    errors,
    handleInputChange,
    handleAvatarChange,
    handleEdit,
    handleSave,
    handleCancel,
    setShowSuccessAlert
  } = useProfile();

  // Redirect admin users to dashboard
  useEffect(() => {
    if (isAuthenticated() && isAdmin()) {
      router.replace('/admin');
    }
  }, [isAdmin, isAuthenticated, router]);

  return (
    <>
      <Head>
        <title>My Profile |   Sume Traders</title>
        <meta name="description" content="Manage your account information, address, and preferences" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Profile', href: '/profile' }
            ]}
          />

          <ProfileHeader isEditing={isEditing} onEdit={handleEdit} />

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {!loading && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                  {/* Profile Avatar - Second on mobile, First on desktop */}
                  <div className="order-2 lg:order-1 animate-fadeIn">
                    <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100">
                      <ProfileAvatar
                        avatarUrl={profileData.avatarUrl}
                        firstName={profileData.firstName}
                        lastName={profileData.lastName}
                        isEditing={isEditing}
                        onAvatarChange={handleAvatarChange}
                        memberSince={accountStats.memberSince}
                      />
                    </div>
                  </div>

                  {/* Personal Information - Third on mobile, Second on desktop */}
                  <div className="order-3 lg:order-2 animate-fadeIn">
                    <PersonalInformationCard
                      profileData={profileData}
                      isEditing={isEditing}
                      onChange={handleInputChange}
                      errors={errors}
                    />
                  </div>

                  {/* Address Information - First on mobile, Third on desktop */}
                  <div className="order-1 lg:order-3 animate-fadeIn">
                    <AddressInformationCard
                      profileData={profileData}
                      isEditing={isEditing}
                      onChange={handleInputChange}
                      errors={errors}
                    />
                  </div>

                  {/* Action Buttons - Fourth on mobile and desktop */}
                  {isEditing && (
                    <div className="order-4 animate-fadeIn">
                      <ProfileActionButtons
                        onSave={handleSave}
                        onCancel={handleCancel}
                        isSaving={isSaving}
                      />
                    </div>
                  )}
                </div>

                {/* Sidebar - Fifth on mobile, Right on desktop */}
                <div className="space-y-4 sm:space-y-6 order-5 lg:order-4">
                  <div className="animate-fadeIn">
                    <AccountSummaryCard
                      memberSince={accountStats.memberSince || 'N/A'}
                      totalOrders={accountStats.totalOrders}
                      loginMethod={profileData.googleId ? 'Google' : 'Email'}
                      registrationDate={profileData.createdAt}
                      isEmailVerified={profileData.isEmailVerified}
                    />
                  </div>
                  <div className="animate-fadeIn">
                    <QuickActionsCard />
                  </div>
                </div>
              </div>

              {/* Order History Section */}
              <div className="mt-6 lg:mt-8 animate-fadeIn">
                <OrderHistoryCard />
              </div>
            </>
          )}

          {/* Sticky Edit Button - Mobile Only */}
          {!isEditing && (
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl p-4 z-50 safe-area-inset-bottom">
              <button
                onClick={handleEdit}
                className="w-full flex items-center justify-center gap-2 bg-black text-white px-6 py-3.5 rounded-lg font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 shadow-lg"
                aria-label="Edit profile"
              >
                <HiPencil className="w-5 h-5" />
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {showSuccessAlert && (
        <SweetAlert
          isOpen={showSuccessAlert}
          onClose={() => setShowSuccessAlert(false)}
          title="Profile Updated!"
          message="Your profile information has been successfully updated."
          type="success"
          confirmText="Got it"
        />
      )}
    </>
  );
}
