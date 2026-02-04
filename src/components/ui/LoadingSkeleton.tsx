export function LoadingSkeleton({ count = 1 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl h-32 w-full"
                />
            ))}
        </>
    );
}
