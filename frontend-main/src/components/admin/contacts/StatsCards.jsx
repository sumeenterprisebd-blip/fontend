import { HiMail, HiMailOpen } from "react-icons/hi";

export default function StatsCards({ stats }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600 uppercase">Total Messages</p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">
                            {stats.total}
                        </p>
                    </div>
                    <HiMail className="w-12 h-12 text-blue-500 opacity-20" />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600 uppercase">Unread</p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">
                            {stats.unread}
                        </p>
                    </div>
                    <HiMail className="w-12 h-12 text-red-500 opacity-20" />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600 uppercase">Read</p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">
                            {stats.read}
                        </p>
                    </div>
                    <HiMailOpen className="w-12 h-12 text-green-500 opacity-20" />
                </div>
            </div>
        </div>
    );
}
