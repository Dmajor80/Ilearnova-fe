const HeaderButtons = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
      <button className="flex items-center bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition-all">
        ⬆️ Shared resources
      </button>
      <button className="flex items-center bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition-all">
        ⬆️ Upload resources
      </button>
    </div>
  );
};

export default HeaderButtons;
