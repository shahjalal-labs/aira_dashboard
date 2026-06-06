import BookingPieChart from "./components/BookingPieChart";
import PlatformChart from "./components/PlatFormChart";
import Stats from "./components/Stats";
import TopListing from "./components/TopListing";
import UserGrowthChart from "./components/UserGrowth";

const ReportsPage = () => {
  return (
    <div>
      <Stats></Stats>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="col-span-2 lg:col-span-1"><PlatformChart></PlatformChart></div>
        <div className="col-span-2 lg:col-span-1"><UserGrowthChart /></div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="col-span-2 lg:col-span-1"><BookingPieChart></BookingPieChart></div>
        <div className="col-span-2 lg:col-span-1"><TopListing /></div>
      </div>
    </div>
  );
};

export default ReportsPage;
