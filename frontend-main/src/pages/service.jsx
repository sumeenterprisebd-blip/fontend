import React from "react";

export default function ServicePage() {
    return (
        <main className="container mx-auto py-12 px-4">
            <h1 className="text-4xl font-bold mb-6 text-center">Our Services</h1>
            <section className="max-w-2xl mx-auto text-lg leading-relaxed">
                <p className="mb-4">
                    Welcome to Deshwear! We are committed to providing you with the best quality fashion and customer service. Our services include:
                </p>
                <ul className="list-disc pl-6 mb-4">
                    <li>Wide range of premium clothing and accessories</li>
                    <li>Fast and reliable shipping across Bangladesh</li>
                    <li>Easy returns and exchanges</li>
                    <li>24/7 customer support</li>
                    <li>Secure online payments</li>
                </ul>
                <p>
                    For any inquiries or custom requests, please contact our support team. Thank you for choosing Deshwear!
                </p>
            </section>
        </main>
    );
}
