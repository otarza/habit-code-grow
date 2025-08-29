import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ArrowRight, Gift, Sparkles } from "lucide-react";

interface ProgressiveFormProps {
  onComplete: (data: FormData) => void;
}

interface FormData {
  email: string;
  name: string;
  experience: string;
  goal: string;
}

export function ProgressiveForm({ onComplete }: ProgressiveFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onComplete(formData as FormData);
      setIsSubmitting(false);
    }, 1500);
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "დაიწყე აქ! 👋";
      case 2: return "მოგესალმებით! 🎯";
      case 3: return "თქვენი გამოცდილება? 💻";
      case 4: return "ბოლო ნაბიჯი! 🚀";
      default: return "";
    }
  };

  const getProgressPercentage = () => (step / 4) * 100;

  return (
    <Card className="p-8 border-4 border-yellow-400 shadow-2xl bg-white relative overflow-hidden max-w-md mx-auto">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
        <div 
          className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400 rounded-full -translate-y-10 translate-x-10 opacity-20" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-orange-400 rounded-full translate-y-8 -translate-x-8 opacity-20" />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {step === 4 ? <Sparkles className="w-8 h-8 text-white" /> : <Gift className="w-8 h-8 text-white" />}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {getStepTitle()}
          </h3>
          <div className="text-sm text-gray-600">
            ნაბიჯი {step}/4 • 230₾ ღირებულების პაკეტი
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[180px] flex flex-col justify-center">
          {step === 1 && (
            <div className="text-center space-y-4">
              <p className="text-gray-600 mb-4">
                შეიყვანეთ ელ. ფოსტა უფასო პაკეტის მისაღებად
              </p>
              <input
                type="email"
                placeholder="თქვენი ელ. ფოსტა"
                value={formData.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors"
                required
              />
              <Button 
                onClick={nextStep}
                disabled={!formData.email}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3"
              >
                გააგრძელე <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center space-y-4">
              <p className="text-gray-600 mb-4">
                რა სახელით გახდით ჩვენი ფამილიის წევრი?
              </p>
              <input
                type="text"
                placeholder="თქვენი სახელი"
                value={formData.name || ''}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors"
                required
              />
              <Button 
                onClick={nextStep}
                disabled={!formData.name}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3"
              >
                შემდეგი <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4 text-center">
                რა გამოცდილება გაქვთ პროგრამირებაში?
              </p>
              <div className="space-y-2">
                {[
                  { value: 'beginner', label: '🔰 სრულიად დამწყები' },
                  { value: 'some', label: '📚 ვიცი რამე ოდნავ' },
                  { value: 'intermediate', label: '⚡ კარგი საბაზისო ცოდნა' },
                  { value: 'advanced', label: '🚀 მინდა უმაღლეს დონეზე ავიდე' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      updateField('experience', option.value);
                      setTimeout(nextStep, 300);
                    }}
                    className="w-full p-3 text-left border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-all"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4 text-center">
                რა არის თქვენი მთავარი მიზანი?
              </p>
              <div className="space-y-2">
                {[
                  { value: 'career', label: '💼 კარიერის შეცვლა' },
                  { value: 'skills', label: '🧠 ახალი უნარების შეძენა' },
                  { value: 'freelance', label: '💻 ფრილანსი' },
                  { value: 'startup', label: '🚀 საკუთარი startup' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      updateField('goal', option.value);
                      handleSubmit();
                    }}
                    disabled={isSubmitting}
                    className="w-full p-3 text-left border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-all disabled:opacity-50"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isSubmitting && (
          <div className="text-center mt-6">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
              <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              <span>მზადდება თქვენი პაკეტი...</span>
            </div>
          </div>
        )}

        {/* Benefits Preview */}
        {step < 4 && !isSubmitting && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-center">
              <div className="text-sm font-semibold text-green-800 mb-2">რას მიიღებთ:</div>
              <div className="space-y-1 text-xs text-green-700">
                <div className="flex items-center justify-center gap-2">
                  <Check className="w-3 h-3" />
                  <span>5 დღიანი ვიდეო კურსი (150₾)</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Check className="w-3 h-3" />
                  <span>PDF გაიდი 40 გვერდი (80₾)</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Check className="w-3 h-3" />
                  <span>Discord კომუნიტი წვდომა</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trust Indicators */}
        {step === 1 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Check className="w-3 h-3 text-green-500" />
              <span>მყისვეივე ხელმისაწვდომია</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Check className="w-3 h-3 text-green-500" />
              <span>არანაირი დამალული ღირებულება</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Check className="w-3 h-3 text-green-500" />
              <span>100% უსაფრთხო მონაცემები</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}