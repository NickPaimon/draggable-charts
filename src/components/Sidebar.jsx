const Sidebar = ({ addWidget }) => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-5">
      <h2 className="font-bold">Available Widgets</h2>
      <button
        onClick={() => addWidget("pieChart")}
        className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 block mt-2"
      >
        Add Pie Chart
      </button>
      <button
        onClick={() => addWidget("donutChart")}
        className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 block mt-2"
      >
        Add Donut Chart
      </button>
      <button
        onClick={() => addWidget("horizontalBarChart")}
        className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 block mt-2"
      >
        Add Horizontal Bar Chart
      </button>
    </div>
  );
};

export default Sidebar;
