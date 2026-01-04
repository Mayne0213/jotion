import { Navbar } from "@/widgets/landing";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full bg-white dark:bg-[#1F1F1F] space-y-20">
      <Navbar />
      <main className="h-full">{children}</main>
    </div>
  );
};

export default MarketingLayout;