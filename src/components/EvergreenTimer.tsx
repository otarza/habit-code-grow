import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface EvergreenTimerProps {
    /** Duration in hours. Default: 24 hours (1 day) */
    durationHours?: number;
    /** Storage key for localStorage. Default: 'ai_offer_deadline' */
    storageKey?: string;
    /** Callback when timer expires */
    onExpire?: () => void;
}

export function EvergreenTimer({
    durationHours = 24,
    storageKey = 'ai_offer_deadline',
    onExpire
}: EvergreenTimerProps) {
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        // Get or set deadline
        let deadline = localStorage.getItem(storageKey);

        if (!deadline) {
            // First visit - randomize between 18-23 hours for natural feel
            const randomHours = 18 + Math.random() * 5; // 18-23 hours
            const deadlineTime = Date.now() + (randomHours * 60 * 60 * 1000);
            localStorage.setItem(storageKey, deadlineTime.toString());
            deadline = deadlineTime.toString();
        }

        const deadlineTimestamp = parseInt(deadline);

        // Update timer every second
        const updateTimer = () => {
            const now = Date.now();
            const remaining = deadlineTimestamp - now;

            if (remaining <= 0) {
                setIsExpired(true);
                setTimeRemaining(0);

                // Reset for next visit after expiration
                localStorage.removeItem(storageKey);

                if (onExpire) {
                    onExpire();
                }
            } else {
                setTimeRemaining(remaining);
            }
        };

        // Initial update
        updateTimer();

        // Update every second
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [durationHours, storageKey, onExpire]);

    // Format time remaining
    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return {
            hours: hours.toString().padStart(2, '0'),
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0')
        };
    };

    if (isExpired) {
        return null; // Hide timer when expired
    }

    const time = formatTime(timeRemaining);

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap">
                <Clock className="h-5 w-5 animate-pulse" />
                <span className="font-semibold text-sm sm:text-base">
                    🔥 შეთავაზება სრულდება:
                </span>
                <div className="flex items-center gap-2 font-mono text-lg sm:text-xl font-bold">
                    <span className="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">
                        {time.hours}
                    </span>
                    <span>:</span>
                    <span className="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">
                        {time.minutes}
                    </span>
                    <span>:</span>
                    <span className="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">
                        {time.seconds}
                    </span>
                </div>
            </div>
        </div>
    );
}
