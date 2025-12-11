import React from 'react';

const SimpleBarChart = ({ data, title, color = '#6A0DAD' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Find max value to scale bars
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="p-4">
      <h4 className="text-center font-medium text-gray-700 mb-4">{title}</h4>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-24 text-sm text-gray-600 truncate">{item.label || 'N/A'}</div>
            <div className="flex-1 flex items-center ml-2">
              <div
                className="h-6 rounded"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: color
                }}
              ></div>
              <span className="ml-2 text-sm font-medium">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleBarChart;