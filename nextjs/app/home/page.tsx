import { Heading } from "@/widgets/landing";
import { Heroes } from "@/widgets/landing";

const MarketingPage = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center gap-y-8 px-6">
      <Heading />
      <Heroes />
    </div>
  );
};

export default MarketingPage;
