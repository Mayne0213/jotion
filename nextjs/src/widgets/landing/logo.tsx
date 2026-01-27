import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/shared/lib/utils";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400","600"]
});

export const Logo = () => {
    return (
        <div className="flex items-center gap-x-2">
            <Image src="/notionIcon.png" height="32" width="32" alt="Logo" className="dark:hidden"/>
            <Image src="/notionIcon.png" height="32" width="32" alt="Logo" className="hidden dark:block"/>
            <p className={cn("font-semibold", font.className)}>
                Jotion
            </p>
        </div>
    );
}
 
export default Logo;