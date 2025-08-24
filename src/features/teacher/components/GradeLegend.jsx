const GradeLegend = ({ top, low, average }) => {
  return (
    <div className="flex flex-col gap-1 p-4 text-sm text-gray-600">
      <p><span className="text-blue-600 font-medium">•</span> Top Performing Subject: {top}</p>
      <p><span className="text-blue-600 font-medium">•</span> Lowest Performing Subject: {low}</p>
      <p><span className="text-blue-600 font-medium">•</span> Overall Average Grade: {average}</p>
    </div>
  );
};

export default GradeLegend;
