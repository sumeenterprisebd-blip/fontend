import { useState } from 'react';
import dynamic from 'next/dynamic';
import { contactAPI } from '@/services/api';
import ContactFormHeader from './ContactFormHeader';
import ContactFormFields from './ContactFormFields';

const SweetAlert = dynamic(() => import('@/components/shared/SweetAlert'), { ssr: false });

export default function ContactForm() {
  const [errors, setErrors] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        const firstError = Object.keys(newErrors)[0];
        const element = document.getElementById(firstError);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element?.focus();
      }, 100);
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await contactAPI.sendMessage(formData);

      if (response.data.success) {
        setShowSuccessAlert(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setErrorMessage(response.data.message || 'Failed to send message. Please try again.');
        setShowErrorAlert(true);
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
        'Failed to send message. Please check your connection and try again.'
      );
      setShowErrorAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-gray-100 transform hover:shadow-3xl transition-all duration-300">
      <ContactFormHeader />
      <form onSubmit={handleSubmit} className="space-y-6">
        <ContactFormFields
          formData={formData}
          errors={errors}
          handleInputChange={handleInputChange}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full mt-8 px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl font-bold text-lg hover:from-gray-800 hover:to-gray-700 active:scale-[0.98] transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <span>Send Message</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </>
          )}
        </button>
      </form>

      {(showSuccessAlert || showErrorAlert) && (
        <>
          <SweetAlert
            isOpen={showSuccessAlert}
            onClose={() => setShowSuccessAlert(false)}
            title="Message Sent Successfully!"
            message="Thank you for contacting us. We have received your message and will get back to you soon."
            type="success"
            confirmText="OK"
          />

          <SweetAlert
            isOpen={showErrorAlert}
            onClose={() => setShowErrorAlert(false)}
            title="Failed to Send Message"
            message={errorMessage}
            type="error"
            confirmText="Try Again"
          />
        </>
      )}
    </div>
  );
}

