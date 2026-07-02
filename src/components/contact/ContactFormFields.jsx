export default function ContactFormFields({ formData, errors, handleInputChange }) {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2.5">
                        Your Name <span className="text-red-500 font-normal">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${errors.name
                            ? 'border-red-400 focus:ring-red-400 focus:border-red-500 bg-red-50'
                            : 'border-gray-200 focus:ring-gray-800 focus:border-gray-800 bg-gray-50 hover:border-gray-300'
                            }`}
                    />
                    {errors.name && (
                        <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                            <span>⚠</span> {errors.name}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2.5">
                        Email Address <span className="text-red-500 font-normal">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${errors.email
                            ? 'border-red-400 focus:ring-red-400 focus:border-red-500 bg-red-50'
                            : 'border-gray-200 focus:ring-gray-800 focus:border-gray-800 bg-gray-50 hover:border-gray-300'
                            }`}
                    />
                    {errors.email && (
                        <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                            <span>⚠</span> {errors.email}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2.5">
                    Subject <span className="text-red-500 font-normal">*</span>
                </label>
                <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="What is this regarding?"
                    className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${errors.subject
                        ? 'border-red-400 focus:ring-red-400 focus:border-red-500 bg-red-50'
                        : 'border-gray-200 focus:ring-gray-800 focus:border-gray-800 bg-gray-50 hover:border-gray-300'
                        }`}
                />
                {errors.subject && (
                    <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                        <span>⚠</span> {errors.subject}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2.5">
                    Message <span className="text-red-500 font-normal">*</span>
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    placeholder="Tell us more about your inquiry..."
                    className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 resize-none ${errors.message
                        ? 'border-red-400 focus:ring-red-400 focus:border-red-500 bg-red-50'
                        : 'border-gray-200 focus:ring-gray-800 focus:border-gray-800 bg-gray-50 hover:border-gray-300'
                        }`}
                />
                {errors.message && (
                    <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                        <span>⚠</span> {errors.message}
                    </p>
                )}
            </div>
        </>
    );
}
