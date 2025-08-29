import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ScarcityData {
  seatsRemaining: number;
  cohortName: string;
  message: string;
  lastUpdated: number;
}

interface ScarcityContextType {
  scarcityData: ScarcityData;
  refreshScarcity: () => void;
}

const ScarcityContext = createContext<ScarcityContextType | null>(null);

export function useScarcity() {
  const context = useContext(ScarcityContext);
  if (!context) {
    throw new Error('useScarcity must be used within a ScarcityProvider');
  }
  return context;
}

export function ScarcityProvider({ children }: { children: ReactNode }) {
  const [scarcityData, setScarcityData] = useState<ScarcityData>({
    seatsRemaining: 0,
    cohortName: '',
    message: '',
    lastUpdated: 0
  });

  // Generate cohort information based on current date
  const getCohortInfo = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentDate = now.getDate();
    
    const monthNames = [
      'იანვრის', 'თებერვლის', 'მარტის', 'აპრილის', 'მაისის', 'ივნისის',
      'ივლისის', 'აგვისტოს', 'სექტემბრის', 'ოქტომბრის', 'ნოემბრის', 'დეკემბრის'
    ];
    
    // Determine cohort type based on date
    let cohortType, startDate;
    if (currentDate <= 10) {
      cohortType = 'I';
      startDate = 1;
    } else if (currentDate <= 20) {
      cohortType = 'II';
      startDate = 11;
    } else {
      cohortType = 'III';
      startDate = 21;
    }
    
    return {
      name: `${monthNames[currentMonth]} ${cohortType}`,
      startDate: startDate,
      type: cohortType,
      daysFromStart: Math.abs(currentDate - startDate)
    };
  };

  // Generate realistic scarcity data
  const generateScarcityData = (): ScarcityData => {
    const cohortInfo = getCohortInfo();
    
    // Realistic seat progression (starts higher, decreases over time)
    let baseSeats;
    
    if (cohortInfo.daysFromStart <= 5) {
      // Early in the cohort period - more seats
      baseSeats = Math.floor(Math.random() * 8) + 12; // 12-20 seats
    } else if (cohortInfo.daysFromStart <= 8) {
      // Mid cohort period - moderate seats
      baseSeats = Math.floor(Math.random() * 6) + 6; // 6-12 seats
    } else {
      // Late in cohort period - few seats (high urgency)
      baseSeats = Math.floor(Math.random() * 5) + 2; // 2-7 seats
    }
    
    // Add slight randomness but keep it believable
    const finalSeats = Math.max(1, baseSeats + (Math.random() > 0.5 ? 1 : -1));
    
    // Generate message with variety
    const messageTemplates = [
      `მხოლოდ ${finalSeats} ადგილი დარჩა ${cohortInfo.name} ჯგუფში!`,
      `დარჩა მხოლოდ ${finalSeats} ადგილი ${cohortInfo.name}!`,
      `ბოლო ${finalSeats} ადგილი ${cohortInfo.name} ჯგუფისთვის!`,
      `${cohortInfo.name} - მხოლოდ ${finalSeats} ადგილი!`,
      `სწრაფად! ${finalSeats} ადგილი დარჩა ${cohortInfo.name}!`
    ];
    
    const randomMessage = messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
    
    return {
      seatsRemaining: finalSeats,
      cohortName: cohortInfo.name,
      message: randomMessage,
      lastUpdated: Date.now()
    };
  };

  const refreshScarcity = () => {
    const newData = generateScarcityData();
    setScarcityData(newData);
    
    // Store in localStorage for consistency across page reloads
    localStorage.setItem('scarcity_data', JSON.stringify(newData));
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🎯 Scarcity updated:', newData);
    }
  };

  useEffect(() => {
    // Try to load existing data from localStorage first
    const storedData = localStorage.getItem('scarcity_data');
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        const now = Date.now();
        
        // If stored data is less than 3 minutes old, use it for consistency
        if (now - parsedData.lastUpdated < 180000) {
          setScarcityData(parsedData);
          
          // Schedule next update for remaining time
          const timeUntilNextUpdate = 180000 - (now - parsedData.lastUpdated);
          setTimeout(() => {
            refreshScarcity();
          }, Math.max(timeUntilNextUpdate, 1000));
          
          return;
        }
      } catch (error) {
        console.warn('Failed to parse stored scarcity data');
      }
    }
    
    // Generate fresh data if no valid stored data
    refreshScarcity();
    
    // Set up automatic updates every 2-5 minutes
    const scheduleNextUpdate = () => {
      const interval = Math.random() * 180000 + 120000; // 2-5 minutes
      setTimeout(() => {
        refreshScarcity();
        scheduleNextUpdate(); // Schedule the next update
      }, interval);
    };
    
    scheduleNextUpdate();
  }, []);

  return (
    <ScarcityContext.Provider value={{ scarcityData, refreshScarcity }}>
      {children}
    </ScarcityContext.Provider>
  );
}