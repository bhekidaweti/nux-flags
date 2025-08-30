"use client";

import flags from "../data/flags.json";

const FlagList = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">🏳️ Flag List</h1>
      <p className="text-center text-gray-600">Browse all available flags in the quiz.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6">
        {flags.map((flag, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg shadow-sm hover:shadow-lg transition bg-white flex flex-col items-center"
          >
            <img
              src={flag.image}
              alt={flag.country}
              className="w-20 h-20 object-contain mb-2"
            />
            <span className="font-medium text-center">{flag.country}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlagList;
