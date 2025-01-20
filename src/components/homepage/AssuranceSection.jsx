import React from "react";
import AssuranceElement from "./AssuranceElement";

export default function AssuranceSection() {
  return (
    <div className="flex justify-center mt-3">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-3 pb-10">
        <div className="relative pr-6 md:pr-8">
          <AssuranceElement
            src="/homepage/AssuranceLogo1.png"
            title="Your Most Trusted Store"
            description="100% All Brand New & Original Shop with Confidence."
          />
          <div className="absolute inset-y-0 right-0 w-px bg-gray-400 hidden md:block"></div>
        </div>
        <div className="relative pr-6 md:pr-8">
          <AssuranceElement
            src="/homepage/AssuranceLogo2.png"
            title="Fast Shipping Nationwide"
            description="Ships in 24 hours! Express and Same-Day Delivery within Metro Manila!"
          />
          <div className="absolute inset-y-0 right-0 w-px bg-gray-400 hidden md:block"></div>
        </div>
        <div className="relative pr-6 md:pr-8">
          <AssuranceElement
            src="/homepage/AssuranceLogo3.png"
            title="Save on Loyalty Rewards"
            description="Sign in to start earning Loyalty Rewards Points!"
          />
          <div className="absolute inset-y-0 right-0 w-px bg-gray-400 hidden md:block"></div>
        </div>
        <div>
          <AssuranceElement
            src="/homepage/AssuranceLogo4.png"
            title="100% Safe and Secure"
            description="All Transactions are Fully Encrypted with State of the Art Technology!"
          />
        </div>
      </div>
    </div>
  );
}
