'use client'
import { useEffect, useState, useRef } from "react";

interface Event {
    score: number;
}

interface School {
    schoolCode: string;
    schoolName: string;
    eventsParticipated: Event[];
    totalPoints?: number;
}

const TailwindInfo = () => {
    const [availableSchools, setAvailableSchools] = useState<School[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const response = await fetch('/api/getvalues', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}),
                });

                const data = await response.json();

                if (data?.schools && Array.isArray(data.schools)) {
                    const schoolsWithPoints = data.schools.map((school: School) => {
                        const totalPoints = school.eventsParticipated.reduce((acc, event) => acc + event.score, 0);
                        return { ...school, totalPoints };
                    });

                    const sortedSchools = schoolsWithPoints.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
                    setAvailableSchools(sortedSchools);
                }
            } catch (error) {
                console.error('Error fetching schools:', error);
            }
        };

        fetchSchools();
    }, []);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let animationFrameId: number;
        let lastTime = 0;
        let waitTime = 2000; // Wait 2 seconds at top/bottom
        let currentWait = 0;
        
        // States: 1 = down, -1 = up, 0 = waiting
        let direction = 1;
        // If waiting, stores the next direction to take
        let nextDirection = 1;
        
        const pixelsPerSecond = 50; // Adjust speed as needed

        const performScroll = (timestamp: number) => {
            if (!lastTime) lastTime = timestamp;
            const deltaTime = timestamp - lastTime;
            lastTime = timestamp;

            if (!scrollContainer) return;

            if (direction === 0) {
                currentWait -= deltaTime;
                if (currentWait <= 0) {
                    direction = nextDirection;
                }
            } else {
                const moveAmount = (pixelsPerSecond * deltaTime) / 1000;
                scrollContainer.scrollTop += moveAmount * direction;

                const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;

                // Check for bottom
                if (direction === 1 && scrollContainer.scrollTop >= maxScroll - 1) {
                    scrollContainer.scrollTop = maxScroll; // Snap to bottom
                    direction = 0;
                    nextDirection = -1;
                    currentWait = waitTime;
                }
                // Check for top
                else if (direction === -1 && scrollContainer.scrollTop <= 1) {
                    scrollContainer.scrollTop = 0; // Snap to top
                    direction = 0;
                    nextDirection = 1;
                    currentWait = waitTime;
                }
            }
            
            animationFrameId = requestAnimationFrame(performScroll);
        };

        animationFrameId = requestAnimationFrame(performScroll);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [availableSchools]);

    return (
        <div 
            ref={scrollRef}
            className="h-[500px] hide-scrollbar w-full m-2 overflow-auto rounded-lg border border-gray-300 dark:border-gray-700 shadow-xl"
        >
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="sticky top-0 z-20">
                    <tr className="bg-blue-900 dark:bg-gray-800">
                        <th className="px-4 py-5 text-center text-3xl font-black text-white uppercase tracking-tighter">Rank</th>
                        <th className="px-4 py-5 text-center text-3xl font-black text-white uppercase tracking-tighter">Code</th>
                        <th className="px-4 py-5 text-center text-3xl font-black text-white uppercase tracking-tighter">School Name</th>
                        <th className="px-4 py-5 text-center text-3xl font-black text-white uppercase tracking-tighter">Total Points</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700 text-center">
                    {availableSchools.length > 0 ? (
                        availableSchools.map((item, index) => (
                            <tr key={item.schoolCode} className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                                <td className="px-4 py-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    {index + 1}
                                </td>
                                <td className="px-4 py-6 text-2xl text-gray-600 dark:text-gray-400">
                                    {item.schoolCode}
                                </td>
                                <td className="px-4 font-black py-6 text-3xl text-blue-950 dark:text-cyan-400 uppercase">
                                    {item.schoolName}
                                </td>
                                <td className="px-4 py-6 text-4xl font-black text-blue-700 dark:text-yellow-400">
                                    {item.totalPoints}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="px-4 py-20 text-center text-2xl text-gray-500 dark:text-gray-400">
                                No schools available or no data found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default TailwindInfo;