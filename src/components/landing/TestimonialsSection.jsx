// src/components/landing/TestimonialsSection.jsx
import { Star, Quote, Flower2, Clapperboard, Sparkles } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Anime Enthusiast',
    icon: Flower2,
    text: 'Finally a movie finder that actually understands anime! The search is super fast and the recommendations are spot on.',
    rating: 5
  },
  {
    name: 'Michael Rodriguez',
    role: 'Film Buff',
    icon: Clapperboard,
    text: 'Clean interface, no clutter. I love how I can filter between movies and TV shows. The trailer feature is a game changer.',
    rating: 5
  },
  {
    name: 'Aisha Kim',
    role: 'Content Curator',
    icon: Sparkles,
    text: 'Been using this for a month now. The watchlist feature keeps me organized. Best free movie finder out there!',
    rating: 4
  }
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-[#0F1A36]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Loved by
            <span className="gradient-text ml-2">Thousands</span>
          </h2>
          <p className="text-gray-400">
            Don't just take our word for it — hear what our users have to say
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl hover:border-cyan-500/30 transition-all duration-300">
              <Quote size={28} className="text-cyan-500/30 mb-4" />
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${i < testimonial.rating ? 'text-gold-400 fill-gold-400' : 'text-gray-600'}`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3 mt-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                  <testimonial.icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{testimonial.name}</p>
                  <p className="text-gray-500 text-xs">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <Star size={16} className="text-gold-400 fill-gold-400" />
            <span className="text-sm text-white font-medium">4.8/5</span>
            <span className="text-xs text-gray-500">based on 500+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}