import React, { Suspense } from "react";
import AllListings from "./components/AllListings";

const ListingPage = () => {
  return (
    <Suspense fallback={<div className="p-6">Loading listings...</div>}>
      <AllListings />
    </Suspense>
  );
};

export default ListingPage;
