import React, { Suspense } from "react";
import AllPayouts from "./components/AllPayouts";

const PayoutPage = () => {
  return (
    <Suspense fallback={<div className="p-6">Loading payouts...</div>}>
      <AllPayouts />
    </Suspense>
  );
};

export default PayoutPage;