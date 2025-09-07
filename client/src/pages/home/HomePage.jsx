import React from "react";
import PaymantsInfo from "../../components/PaymantsInfo";
import Info from "../../components/Info";

function HomePage() {
  return (
    <div className="w-full bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <PaymantsInfo />
        <Info />
        {/* <div className="mt-6">
          <TopList />
        </div> */}
        {/* <div className="mt-6">
          <PromotionalSlider />
        </div> */}
      </div>
    </div>
  );
}

export default React.memo(HomePage);
