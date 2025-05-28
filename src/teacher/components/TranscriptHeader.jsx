const TranscriptHeader = ({ students }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Transcripts</h2>
        <p className="text-sm text-gray-500">View and download your academic history.</p>
      </div>
      <select className="border rounded px-4 py-2 w-full sm:w-64">
        {students.map((student, idx) => (
          <option key={idx}>{student}</option>
        ))}
      </select>
    </div>
  );
};

export default TranscriptHeader;
