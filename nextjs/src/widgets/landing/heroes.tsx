import Image from "next/image";

export const Heroes = () => {
    return (
        <div className="flex flex-col items-center justify-center max-w-5xl">
            <div className="flex items-center">
                <div className="items-center relative w-[500px] h-[300px] sm:w-[700px] sm:h[350px] md:h-[400px] md:w-[800px]">
                    <Image
                        src="/documents.png"
                        fill
                        className="object-contain dark:hidden"
                        alt="Documents"
                    />
                    <Image
                        src="/documents_dark.png"
                        fill
                        className="object-contain dark:block hidden"
                        alt="Documents"
                    />
                </div>

            </div>
        </div>
    );
}
