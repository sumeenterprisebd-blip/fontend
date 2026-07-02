import { useState, useEffect } from 'react';
import Link from 'next/link';
import { campaignsAPI } from '@/services/api';
import CampaignContent from './CampaignContent';
import CampaignImage from './CampaignImage';
import useCampaignCountdown from './useCampaignCountdown';

export default function SaleBannerSection() {
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const timeLeft = useCampaignCountdown(campaign?.endDate);

    useEffect(() => {
        fetchActiveCampaign();
    }, []);

    const fetchActiveCampaign = async () => {
        try {
            const response = await campaignsAPI.getActiveCampaign();
            if (response.success && response.data) {
                setCampaign(response.data);
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleClick = async () => {
        if (campaign?._id) {
            try {
                await campaignsAPI.trackClick(campaign._id);
            } catch (error) {
            }
        }
    };

    if (loading || !campaign) {
        return null;
    }

    return (
        <section className="w-full py-12 lg:py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-300/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    <div className="grid lg:grid-cols-2 gap-0">
                        {/* Content Side */}
                        <Link href={campaign.ctaButtonLink || '/shop'}>
                            <CampaignContent
                                campaign={campaign}
                                timeLeft={timeLeft}
                                handleClick={handleClick}
                            />
                        </Link>

                        {/* Image Side */}
                        {campaign.bannerImage && (
                            <CampaignImage campaign={campaign} />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
