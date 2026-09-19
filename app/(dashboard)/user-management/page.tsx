import { Suspense } from "react";
import AllUsers from "./components/AllUsers";

const Page = () => {
  return (
    <Suspense fallback={<div className="p-6">Loading users...</div>}>
      <AllUsers />
    </Suspense>
  );
};

export default Page;