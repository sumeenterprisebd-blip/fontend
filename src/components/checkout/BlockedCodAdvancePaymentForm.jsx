import { useState } from "react";

export default function BlockedCodAdvancePaymentForm({ orderId, total, isBlockedForCOD, onSuccess }) {
    const [last4, setLast4] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isBlockedForCOD) {
        return null;
    }

    const isValid = /^\d{4}$/.test(last4);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!isValid) {
            setError("শেষ 4 ডিজিট অবশ্যই সংখ্যা এবং 4 সংখ্যার হতে হবে।");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`/api/orders/${orderId}/pay-advance`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ last4 }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "পেমেন্ট সাবমিট করতে ব্যর্থ হয়েছে।");
            }

            setSuccess("ধন্যবাদ! আপনার অনুরোধ গ্রহণ করা হয়েছে। এডমিন নিশ্চিত করার জন্য অপেক্ষা করুন।");
            setLast4("");
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.message || "কিছু একটা ভুল হয়েছে।");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-red-900 mb-3">
                বিকাশ আগাম পেমেন্ট প্রয়োজন
            </h2>
            <p className="text-sm text-red-800 mb-4">
                সেন্ড মানি: বিকাশে Tk <span className="font-semibold">{total}</span> to{' '}
                <span className="font-semibold">017XXXXXXXX</span>.
            </p>
            <p className="text-sm text-red-800 mb-4">
                বিকাশের ট্রানজেকশন আইডির শেষ 4 ডিজিট এখানে লিখুন।
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block text-sm font-medium text-red-900">
                    TRX-এর শেষ 4 ডিজিট
                    <input
                        type="text"
                        maxLength={4}
                        value={last4}
                        onChange={(e) => {
                            setLast4(e.target.value.replace(/\D/g, ""));
                            setError("");
                        }}
                        className="mt-2 w-full rounded-2xl border border-red-300 bg-white px-4 py-3 text-sm text-red-900 focus:border-red-500 focus:outline-none"
                        placeholder="1234"
                    />
                </label>

                {error && <p className="text-sm text-red-700">{error}</p>}
                {success && <p className="text-sm text-green-700">{success}</p>}

                <button
                    type="submit"
                    disabled={!isValid || loading}
                    className="w-full rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "প্রক্রিয়া হচ্ছে..." : "পেমেন্ট সাবমিট করুন"}
                </button>
            </form>
        </div>
    );
}
