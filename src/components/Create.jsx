import { FaPlus, FaRegFileAlt, FaCalendarAlt } from 'react-icons/fa';
import { IoChatbubbleEllipsesSharp } from 'react-icons/io5';

function Create() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <button className="flex items-center gap-2 p-4 bg-white shadow rounded hover:bg-gray-100 transition">
        <FaRegFileAlt />
        <span>Postlar</span>
      </button>

      <button className="flex items-center gap-2 p-4 bg-white shadow rounded hover:bg-gray-100 transition">
        <FaRegFileAlt />
        <span>Hikoyalar</span>
      </button>

      <button className="flex items-center gap-2 p-4 bg-white shadow rounded hover:bg-gray-100 transition">
        <FaRegFileAlt />
        <span>Karyera AI</span>
      </button>

      <button className="flex items-center gap-2 p-4 bg-white shadow rounded hover:bg-gray-100 transition">
        <FaCalendarAlt />
        <span>Taklif qiling</span>
      </button>

      <button className="flex items-center gap-2 p-4 bg-white shadow rounded hover:bg-gray-100 transition">
        <FaRegFileAlt />
        <span>Ish e'lonlari</span>
      </button>

      <button className="flex items-center gap-2 p-4 bg-white shadow rounded hover:bg-gray-100 transition">
        <IoChatbubbleEllipsesSharp />
        <span>Chat</span>
      </button>

      <button className="flex items-center gap-2 p-4 bg-white shadow rounded hover:bg-gray-100 transition col-span-2 md:col-span-3 justify-center">
        <FaPlus />
        <span>Yangi Post</span>
      </button>
    </div>
  );
}

export default Create;
