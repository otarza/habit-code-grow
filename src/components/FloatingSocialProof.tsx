import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { X, User, MapPin, Clock } from "lucide-react";

interface NotificationData {
  id: string;
  name: string;
  action: string;
  location?: string;
  timeAgo: string;
  avatar: string;
  type: 'signup' | 'download' | 'purchase';
}

export function FloatingSocialProof() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [usedCombinations, setUsedCombinations] = useState<Set<string>>(new Set());

  // Extended realistic Georgian names and surnames
  const georgianNames = [
    'ნიკო', 'ანა', 'გიორგი', 'ნინო', 'დავით', 'მარიამ', 'ლუკა', 'თამარ', 
    'ალექსანდრე', 'ნათია', 'ირაკლი', 'ია', 'ლევან', 'ნანა', 'გიორგია',
    'ბაჩო', 'მაია', 'ზურაბ', 'კეტო', 'ვახტანგ', 'ლიზა', 'გურამ',
    'თინა', 'რატი', 'სალომე', 'გოჩა', 'ელენე', 'ნოდარ', 'სოფო',
    'ტარიელ', 'ნინი', 'ომარ', 'მაკა', 'ოთარ', 'ლალი', 'შოთა',
    'ქეთო', 'მიხეილ', 'ნუნუ', 'ალეკო', 'ხათუნა', 'კოტე', 'რუსუდან',
    'ვასო', 'მარინე', 'ლაშა', 'ციცი', 'ირმა', 'გივი', 'ქეთი',
    'ზაზა', 'მზია', 'თენგიზ', 'თემო'
  ];

  const surnameInitials = [
    'მ.', 'კ.', 'ს.', 'ლ.', 'ვ.', 'გ.', 'ბ.', 'ჯ.', 'ო.', 'ძ.',
    'ჩ.', 'ზ.', 'ყ.', 'ფ.', 'ხ.', 'რ.', 'ც.', 'ნ.', 'პ.', 'შ.',
    'ღ.', 'წ.', 'ჭ.', 'ჯღ.', 'კვ.', 'მც.', 'ტყ.', 'ქც.', 'ცხ.'
  ];

  // Georgian cities and regions
  const georgianLocations = [
    'თბილისი', 'ბათუმი', 'კუთაისი', 'რუსთავი', 'გორი', 'ზუგდიდი',
    'ფოთი', 'ქობულეთი', 'ზესტაფონი', 'სამტრედია', 'ოზურგეთი',
    'მცხეთა', 'ტელავი', 'ახალკალაკი', 'ბორჯომი', 'ახალციხე',
    'ლანჩხუთი', 'სენაკი', 'მარნეული', 'გარდაბანი', 'ყვარელი',
    'სიღნაღი', 'გუდაური', 'ახმეტა', 'ლაგოდეხი', 'ონი',
    'ამბროლაური', 'მესტია', 'ვარძია', 'ცაგერი', 'წალენჯიხა'
  ];

  // Varied action templates
  const actionTemplates = {
    download: [
      'ჩამოტვირთა უფასო პაკეტი',
      'ჩამოტვირთა 230₾ ღირებულების გაიდი', 
      'ჩამოტვირთა კოდირების გაიდი',
      'ჩამოტვირთა 5 დღიანი კურსი',
      'მიიღო უფასო PDF წიგნი',
      'ჩამოტვირთა სწავლის მასალები',
      'მიიღო პროგრამირების რესურსები',
      'ჩამოტვირთა სპეციალური ოფერი',
      'მییღო ჩვევების ფორმირების გაიდი',
      'ჩამოტვირთა დამწყებთა კურსი'
    ],
    signup: [
      'დარეგისტრირდა 21 დღიან ჩელენჯზე',
      'დარეგისტრირდა 30 დღიან ჩელენჯზე', 
      'დარეგისტრირდა 100 დღიან ჩელენჯზე',
      'შეუერთდა Discord კომუნიტის',
      'დაიწყო მენტორის პროგრამა',
      'შექმნა უფასო ანგარიში',
      'მოითხოვა უფასო კონსულტაცია',
      'დარეგისტრირდა ვებინარზე',
      'შეუერთდა ჩვევების ჯგუფს',
      'დაიწყო კოდირების გზა',
      'შემოუერთდა სტუდენტების ჯგუფს',
      'აირჩია მისი სპეციალიზაცია'
    ],
    purchase: [
      'იყიდა მენტორის პაკეტი',
      'იყიდა პრემიუმ კურსი',
      'განაახლა სუბსკრიფცია',
      'იყიდა ინდივიდუალური მენტორინგი',
      'აირჩია VIP პაკეტი', 
      'იყიდა 3 თვიანი პროგრამა',
      'აირჩია წელიწადური გეგმა',
      'იყიდა გრუპული კურსი',
      'აირჩია სპეციალისტის პაკეტი',
      'დაფინანსდა მისი განათლება'
    ]
  };

  // Dynamic time generation with realistic distribution
  const generateRealisticTime = (): string => {
    const now = Date.now();
    const scenarios = [
      // Recent activity (higher weight)
      { weight: 40, range: [1, 5], unit: 'წუთის წინ' },      // 1-5 minutes
      { weight: 25, range: [6, 15], unit: 'წუთის წინ' },     // 6-15 minutes  
      { weight: 15, range: [16, 30], unit: 'წუთის წინ' },    // 16-30 minutes
      { weight: 10, range: [31, 60], unit: 'წუთის წინ' },    // 31-60 minutes
      { weight: 6, range: [1, 3], unit: 'საათის წინ' },      // 1-3 hours
      { weight: 3, range: [4, 8], unit: 'საათის წინ' },      // 4-8 hours  
      { weight: 1, range: [1, 2], unit: 'დღის წინ' }        // 1-2 days
    ];

    // Weighted random selection
    const totalWeight = scenarios.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const scenario of scenarios) {
      random -= scenario.weight;
      if (random <= 0) {
        const [min, max] = scenario.range;
        const value = Math.floor(Math.random() * (max - min + 1)) + min;
        return `${value} ${scenario.unit}`;
      }
    }
    
    return '2 წუთის წინ'; // fallback
  };

  // Generate unique realistic notification
  const generateNotification = (): NotificationData => {
    let attempts = 0;
    const maxAttempts = 50;
    
    while (attempts < maxAttempts) {
      // Random selections
      const name = georgianNames[Math.floor(Math.random() * georgianNames.length)];
      const surname = surnameInitials[Math.floor(Math.random() * surnameInitials.length)];
      const location = georgianLocations[Math.floor(Math.random() * georgianLocations.length)];
      
      // Type distribution (more downloads and signups, fewer purchases)
      const typeWeights = [
        { type: 'download' as const, weight: 50 },
        { type: 'signup' as const, weight: 40 },
        { type: 'purchase' as const, weight: 10 }
      ];
      
      const totalTypeWeight = typeWeights.reduce((sum, t) => sum + t.weight, 0);
      let typeRandom = Math.random() * totalTypeWeight;
      let selectedType: 'download' | 'signup' | 'purchase' = 'download';
      
      for (const typeWeight of typeWeights) {
        typeRandom -= typeWeight.weight;
        if (typeRandom <= 0) {
          selectedType = typeWeight.type;
          break;
        }
      }
      
      const actions = actionTemplates[selectedType];
      const action = actions[Math.floor(Math.random() * actions.length)];
      
      // Create unique combination key
      const combinationKey = `${name}-${surname}-${action}-${location}`;
      
      // Check if this combination was used recently
      if (!usedCombinations.has(combinationKey)) {
        // Add to used combinations and limit size
        setUsedCombinations(prev => {
          const newSet = new Set(prev);
          newSet.add(combinationKey);
          
          // Keep only last 20 combinations to allow reuse after time
          if (newSet.size > 20) {
            const arr = Array.from(newSet);
            return new Set(arr.slice(-20));
          }
          return newSet;
        });

        return {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: `${name} ${surname}`,
          action,
          location,
          timeAgo: generateRealisticTime(),
          avatar: `${name.charAt(0)}${surname.charAt(0)}`,
          type: selectedType
        };
      }
      
      attempts++;
    }
    
    // Fallback if no unique combination found
    return {
      id: `fallback-${Date.now()}`,
      name: 'ნიკო მ.',
      action: 'ჩამოტვირთა უფასო პაკეტი',
      location: 'თბილისი',
      timeAgo: generateRealisticTime(),
      avatar: 'ნმ',
      type: 'download'
    };
  };

  useEffect(() => {
    // Show first notification after random delay (3-8 seconds)
    const initialDelay = Math.random() * 5000 + 3000;
    const initialTimer = setTimeout(() => {
      showNotification();
    }, initialDelay);

    return () => clearTimeout(initialTimer);
  }, []);

  const showNotification = () => {
    const notification = generateNotification();
    setNotifications(prev => [notification, ...prev.slice(0, 2)]); // Keep max 3 notifications

    // Variable auto-dismiss time (5-8 seconds)
    const dismissTime = Math.random() * 3000 + 5000;
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, dismissTime);

    // Schedule next notification with realistic intervals
    // More frequent during business hours, less frequent at night
    const now = new Date();
    const hour = now.getHours();
    
    let baseInterval;
    if (hour >= 9 && hour <= 18) {
      // Business hours: 12-25 seconds
      baseInterval = Math.random() * 13000 + 12000;
    } else if (hour >= 19 && hour <= 23) {
      // Evening: 20-40 seconds  
      baseInterval = Math.random() * 20000 + 20000;
    } else {
      // Night/early morning: 45-90 seconds
      baseInterval = Math.random() * 45000 + 45000;
    }

    setTimeout(() => {
      showNotification();
    }, baseInterval);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'signup':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'download':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'purchase':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'signup':
        return '🎯';
      case 'download':
        return '📥';
      case 'purchase':
        return '💎';
      default:
        return '✅';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-4 z-40 space-y-3">
      {notifications.map((notification, index) => (
        <Card 
          key={notification.id}
          className={`
            w-80 p-4 shadow-lg border-2 animate-slide-in-left
            ${getTypeColor(notification.type)}
            transform transition-all duration-300
            ${index > 0 ? 'opacity-75 scale-95' : ''}
          `}
        >
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
              {notification.avatar}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <span className="text-lg">{getTypeIcon(notification.type)}</span>
                  <span className="font-semibold text-sm">{notification.name}</span>
                </div>
                <button
                  onClick={() => dismissNotification(notification.id)}
                  className="w-5 h-5 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors"
                  aria-label="დახურვა"
                >
                  <X className="w-3 h-3 text-gray-500" />
                </button>
              </div>
              
              <div className="text-sm text-gray-700 mb-2">
                {notification.action}
              </div>
              
              <div className="flex items-center gap-3 text-xs text-gray-600">
                {notification.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{notification.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{notification.timeAgo}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}