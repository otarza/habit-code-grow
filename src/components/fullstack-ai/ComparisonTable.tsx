import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ComparisonTable() {
  const comparisons = [
    {
      feature: "ღირებულება",
      thisProgram: "2990₾ (სრული)",
      youtube: "უფასო (დროის ხარჯზე)",
      bootcamp: "4000₾ - 12000₾",
      winner: "thisProgram"
    },
    {
      feature: "სტრუქტურა და გეგმა",
      thisProgram: "გაწერილი 6 თვეზე",
      youtube: "ქაოსური",
      bootcamp: "ინტენსიური (სტრესული)",
      winner: "thisProgram"
    },
    {
      feature: "სერტიფიკაცია",
      thisProgram: "2 Harvard Certificate",
      youtube: "არცერთი",
      bootcamp: "შიდა სერტიფიკატი",
      winner: "thisProgram"
    },
    {
      feature: "მენტორობა",
      thisProgram: "ინდივიდუალური (კვირაში 1-ხელ)",
      youtube: "არ არსებობს",
      bootcamp: "ჯგუფური / შეზღუდული",
      winner: "thisProgram"
    },
    {
      feature: "კარიერული სერვისები",
      thisProgram: "CV, LinkedIn, Interview Prep",
      youtube: "არა",
      bootcamp: "ზოგჯერ",
      winner: "thisProgram"
    },
    {
      feature: "სწავლის გრაფიკი",
      thisProgram: "მოქნილი (შენზე მორგებული)",
      youtube: "მოქნილი",
      bootcamp: "ფიქსირებული / მკაცრი",
      winner: "both"
    },
    {
      feature: "ქართული საპორტი",
      thisProgram: "კი (Discord + მენტორი)",
      youtube: "არა",
      bootcamp: "კი",
      winner: "thisProgram"
    },
    {
      feature: "პრაქტიკული პროექტები",
      thisProgram: "4+ AI პროექტი",
      youtube: "იშვიათად",
      bootcamp: "1-2 სასწავლო პროექტი",
      winner: "thisProgram"
    }
  ];

  const renderCell = (value: string, isWinner: boolean) => {
    if (value.startsWith("კი") || (isWinner && value !== "არა") || value === "დიახ") {
      return (
        <div className={`flex items-center justify-center gap-2 ${isWinner ? 'font-bold text-green-700' : 'text-green-600'}`}>
          <Check className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm sm:text-base">{value}</span>
        </div>
      );
    } else if (value === "არა" || value === "არცერთი" || value === "არ არსებობს") {
      return (
        <div className="flex items-center justify-center gap-2 text-red-600">
          <X className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm sm:text-base">{value}</span>
        </div>
      );
    } else {
      return (
        <span className={`text-sm sm:text-base ${isWinner ? 'font-bold text-green-700' : 'text-gray-600'}`}>
          {value}
        </span>
      );
    }
  };

  return (
    <section className="relative py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 px-4 py-2 text-sm font-semibold">
            ობიექტური შედარება
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            რატომ არის <span className="text-secondary">Full-Stack AI</span> უკონკურენტო?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            ნახე განსხვავება და მიიღე გონივრული გადაწყვეტილება
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow-xl ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                {/* Table Header */}
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">

                    </th>
                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold bg-green-50">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-green-700 font-bold">Full-Stack AI</span>
                        <Badge className="bg-green-600 text-white text-xs">ჩვენი პროგრამა</Badge>
                      </div>
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                      YouTube / Udemy
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                      სხვა ქართული კურსები
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-gray-200 bg-white">
                  {comparisons.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {row.feature}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-center bg-green-50/50">
                        {renderCell(row.thisProgram, row.winner === "thisProgram" || row.winner === "both")}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-center">
                        {renderCell(row.youtube, false)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-center">
                        {renderCell(row.bootcamp, false)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6">
            <p className="text-lg font-semibold text-gray-900 mb-2">
              შენ იღებ იმაზე მეტს, ვიდრე იხდი
            </p>
            <p className="text-sm text-gray-600">
              Harvard-ის კურიკულუმი + პერსონალური მენტორი + ახალი პროფესია = საუკეთესო ROI
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
