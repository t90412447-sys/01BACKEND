import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight,
  Brain,
  TrendingUp,
  MessageCircle,
  Trophy,
  Target,
  Users,
  Zap,
  Star,
  CheckCircle
} from "lucide-react";
import { SignupForm } from "./signup-form";

const detailedFeatures = [
  {
    icon: Brain,
    title: "AI-Powered Daily Missions",
    description:
      "Every day, our AI creates personalized challenges based on Dale Carnegie's principles. Start with simple tasks like 'smile at 3 people' and progress to 'lead a team discussion.'",
    benefits: [
      "Personalized to your skill level",
      "Based on proven psychology",
      "Gradual confidence building",
    ],
    gradient: "from-blue-500 to-blue-600",
  },
  {
    icon: TrendingUp,
    title: "Interactive Progress Map",
    description:
      "Unlock skill nodes on a game-like map as you complete missions. Watch your social skills tree grow with visual progress tracking and achievement milestones.",
    benefits: [
      "Visual progress tracking",
      "Unlock new skill areas",
      "Gamified learning path",
    ],
    gradient: "from-purple-500 to-purple-600",
  },
  {
    icon: MessageCircle,
    title: "Real-Time AI Coaching",
    description:
      "Get live support when you need it most. Practice conversations, get feedback on your approach, and build confidence before important social interactions.",
    benefits: ["Role-play practice", "Instant feedback", "Confidence building"],
    gradient: "from-indigo-500 to-indigo-600",
  },
  {
    icon: Trophy,
    title: "Achievement & Streak System",
    description:
      "Maintain daily streaks, earn badges, and celebrate milestones. Turn social skills development into an engaging game with rewards for consistency.",
    benefits: [
      "Daily streak motivation",
      "Achievement badges",
      "Progress celebrations",
    ],
    gradient: "from-violet-500 to-violet-600",
  },
  {
    icon: Target,
    title: "Goal-Driven Learning",
    description:
      "Set your personal social goals and receive customized lesson plans. Whether it's networking, dating confidence, or leadership skills - we adapt to your needs.",
    benefits: [
      "Personalized learning paths",
      "Custom goal setting",
      "Adaptive content",
    ],
    gradient: "from-emerald-500 to-emerald-600",
  },
  {
    icon: Users,
    title: "Community Challenges",
    description:
      "Join 5-day challenges with other learners, share progress, and get supportive feedback. Build accountability through community connection.",
    benefits: ["Group accountability", "Peer support", "Shared experiences"],
    gradient: "from-orange-500 to-orange-600",
  },
];

const successStats = [
  { number: "1", label: "Book" },
  { number: "30+", label: "actionable techniques" },
  { number: "10-15", label: "Minutes per day" },
  { number: "94%", label: "Users report improvement" },
];

export function SignInView() {
  const [showThankYou, setShowThankYou] = useState(false);

  const handleSignupSuccess = () => {
    setShowThankYou(true);
  };

  const handleNextStep = () => {
    window.location.href = "/creategoal";
  };

  // Thank You Content (shown after successful signup) - FULL SCREEN
  if (showThankYou) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <motion.div
            className="text-center mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-green-500/20 border border-green-500/50 rounded-2xl p-6 md:p-8 mb-6 md:mb-8">
              <CheckCircle
                className="text-green-400 mx-auto mb-4"
                size={64}
              />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Welcome to GoalGrid!
              </h2>
              <p className="text-green-200 text-lg md:text-xl">
                Your social skills journey starts now
              </p>
            </div>

            {/* Success Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
              {successStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 md:p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                >
                  <div className="text-xl md:text-2xl font-bold text-blue-400 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-slate-300 text-xs md:text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* What's Next Section */}
          <motion.div
            className="text-center mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              What's Coming Next?
            </h3>
            <p className="text-slate-300 text-base md:text-lg mb-6 md:mb-8 px-4">
              You're about to set your first social skills goal and receive
              your personalized learning path
            </p>

            <Button
              onClick={handleNextStep}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-base md:text-lg"
              data-testid="button-next-step"
            >
              <span className="mr-2">Set Your First Goal</span>
              <ArrowRight size={20} />
            </Button>
          </motion.div>

          {/* Detailed Features Section */}
          <motion.div
            className="mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 text-center px-4">
              Your Complete Social Skills Toolkit
            </h3>

            <div className="grid gap-4 md:gap-8">
              {detailedFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-8 hover:bg-white/10 transition-all duration-200"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                    <div
                      className={`flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center`}
                    >
                      <feature.icon
                        className="text-white"
                        size={24}
                      />
                    </div>

                    <div className="flex-1">
                      <h4 className="text-white font-bold text-lg md:text-xl mb-2 md:mb-3">
                        {feature.title}
                      </h4>
                      <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-3 md:mb-4">
                        {feature.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <span
                            key={benefitIndex}
                            className="bg-blue-500/20 border border-blue-500/30 px-2 md:px-3 py-1 rounded-full text-blue-200 text-xs md:text-sm"
                          >
                            <Zap className="inline w-3 h-3 mr-1" />
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Testimonial Section */}
          <motion.div
            className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-6 md:p-8 text-center mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div className="flex justify-center space-x-1 mb-4">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className="text-yellow-400 fill-current"
                  size={20}
                />
              ))}
            </div>
            <blockquote className="text-white font-medium text-base md:text-lg mb-4 px-4">
              "I went from avoiding eye contact to confidently leading
              meetings at work. GoalGrid broke down social skills into
              achievable daily steps that actually work."
            </blockquote>
            <cite className="text-slate-400 text-sm md:text-base">
              – Sarah M., Product Manager
            </cite>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            className="text-center pb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <p className="text-slate-300 text-base md:text-lg mb-6 px-4">
              Ready to transform your social life? Let's set your first goal
              and create your personalized journey.
            </p>

            <Button
              onClick={handleNextStep}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-base md:text-lg"
              data-testid="button-final-cta"
            >
              <span className="mr-2">Start Your Journey Now</span>
              <ArrowRight size={20} />
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Initial View with SignupForm Component
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key="signup-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <SignupForm onSignupSuccess={handleSignupSuccess} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}