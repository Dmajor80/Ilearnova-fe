import React from "react";
import { Calendar, Clock, ArrowLeft, Sparkles, Construction } from "lucide-react";

const FeatureNotAvailable = ({ 
  title = "School Calendar",
  description = "We're working hard to bring you an amazing calendar experience",
  onBack,
  icon: CustomIcon,
  showBackButton = true,
  backLabel = "Back to Dashboard"
}) => {
  return (
    <div className="p-6 min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Top decorative bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#4D44B5] via-[#FB7D5B] to-[#FCC43E]" />

          <div className="p-8 md:p-12 text-center">
            {/* Icon Stack */}
            <div className="relative mx-auto w-fit mb-8">
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#FCC43E]/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#FCC43E]" />
              </div>
              <div className="w-24 h-24 bg-[#F3F1F8] rounded-2xl flex items-center justify-center rotate-3">
                <div className="w-20 h-20 bg-white rounded-xl shadow-sm flex items-center justify-center -rotate-3">
                  {CustomIcon ? (
                    <CustomIcon className="w-10 h-10 text-[#4D44B5]" />
                  ) : (
                    <Calendar className="w-10 h-10 text-[#4D44B5]" />
                  )}
                </div>
              </div>
              <div className="absolute -bottom-1 -left-3 bg-[#FB7D5B] text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Construction className="w-3 h-3" />
                SOON
              </div>
            </div>

            {/* Text */}
            <div className="space-y-3 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[#303972] font-poppins tracking-tight">
                {title}
              </h2>
              <p className="text-[#A098AE] text-[15px] max-w-md mx-auto leading-relaxed">
                {description}
              </p>
            </div>

            {/* Features preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10 text-left">
              {[
                { icon: Calendar, label: "Event Management", desc: "Create & track school events" },
                { icon: Clock, label: "Smart Reminders", desc: "Never miss important dates" },
                { icon: Sparkles, label: "Academic Year View", desc: "Full term & holiday planner" },
              ].map((item, i) => (
                <div key={i} className="bg-[#FBFBFE] border border-[#F3F1F8] rounded-xl p-4">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mb-2.5 shadow-sm">
                    <item.icon className="w-4 h-4 text-[#4D44B5]" />
                  </div>
                  <p className="text-[13px] font-semibold text-[#303972]">{item.label}</p>
                  <p className="text-[11px] text-[#A098AE] mt-1 leading-snug">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Action */}
            {showBackButton && onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#4D44B5] text-white rounded-xl font-medium hover:bg-[#3D34A5] transition-all hover:shadow-lg hover:shadow-[#4D44B5]/20 active:scale-[0.98]"
              >
                <ArrowLeft className="w-4 h-4" />
                {backLabel}
              </button>
            )}

            <p className="text-[11px] text-[#A098AE]/70 mt-6">
              This feature is currently under development and will be available soon.
            </p>
          </div>
        </div>

        {/* Subtle footer hint */}
        <div className="text-center mt-6">
          <p className="inline-flex items-center gap-2 text-[12px] text-[#A098AE] bg-white px-4 py-2 rounded-full shadow-sm border">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Our team is building this for you
          </p>
        </div>
      </div>
    </div>
  );
};

// Ready-to-use wrapper for School Calendar specifically
export const SchoolCalendarPlaceholder = ({ onBack }) => {
  return (
    <FeatureNotAvailable
      title="School Calendar"
      description="Organize academic terms, exams, holidays and school events all in one beautiful timeline. Coming very soon."
      onBack={onBack}
    />
  );
};

export default FeatureNotAvailable;
