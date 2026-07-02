export default function ContactFormHeader() {
    return (
        <div className="mb-10 pb-8 border-b-2 border-gray-200">
            <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-1 h-10 bg-gray-900 rounded-full"></div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Send us a Message</h2>
            </div>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed ml-4">
                We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
            </p>
        </div>
    );
}
