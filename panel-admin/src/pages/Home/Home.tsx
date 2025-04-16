import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";

export default function Home() {
  return (
    <div className="w-full flex">
      <div className="w-2/12">
        <Sidebar />
      </div>
      <div className="w-10/12">
        <Navbar />
        <div className="w-full px-2">
          <div className="bg-gray-100 rounded-md shadow-md p-2 mb-2">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
