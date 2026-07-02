import { FiTag } from 'react-icons/fi';

export default function ProductFormTags({ formData, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Tags</h3>
      <div className="flex items-center">
        <FiTag className="text-gray-400 mr-2" />
        <input
          type="text"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter tags separated by commas (e.g., summer, casual, trendy)"
          value={formData.tags}
          onChange={(e) => onChange('tags', e.target.value)}
        />
      </div>
    </div>
  );
}

