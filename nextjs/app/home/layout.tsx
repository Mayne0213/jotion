import { Navbar } from "@/widgets/landing";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full bg-white dark:bg-[#1F1F1F]">
      <Navbar />
      <main className="h-full pt-20">{children}</main>
    </div>
  );
};

export default MarketingLayout;