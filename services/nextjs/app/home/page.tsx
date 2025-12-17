import { Heading } from "@/widgets/landing";
import { Heroes } from "@/widgets/landing";
import { Footer } from "@/widgets/landing";

const MarketingPage = () => {
  return (
    <div className="mt-40 dark:bg-[#1F1F1F] bg-white min-h-full flex flex-col">
      <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
        <Heading />
        <Heroes />
      </div>
      <Footer />
    </div>
  );
};

export default MarketingPage;
