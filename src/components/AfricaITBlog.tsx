import { motion } from "framer-motion";
import { Globe, TrendingUp, Users, ArrowRight, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AfricaITBlog = () => {
  const navigate = useNavigate();

  return (
    <section id="africa-blog" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6"
          >
            <Globe className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">Africa Tech</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4"
          >
            Why Africa Is the Next Frontier for IT Talent & Agile Transformation
          </motion.h2>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-4 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />March 2026</span>
            <span>•</span>
            <span>6 min read</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: TrendingUp, value: "700M+", label: "Young Africans under 30" },
            { icon: Globe, value: "54", label: "Countries embracing digital transformation" },
            { icon: Users, value: "3x", label: "IT talent growth rate vs global average" },
          ].map((stat, i) => (
            <Card key={i} className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-secondary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <motion.article initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="max-w-4xl mx-auto">
          <Card className="bg-card shadow-soft">
            <CardContent className="p-8 lg:p-12 space-y-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Africa's technology sector is experiencing unprecedented growth. With over 700 million people under the age of 30 and a rapidly expanding digital infrastructure, the continent is poised to become one of the world's most dynamic IT talent markets. Countries like Nigeria, Kenya, Rwanda, South Africa — and Cameroon — are producing world-class engineers, project managers, and Agile practitioners at scale.
              </p>
              <div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                  The Digital Revolution Is African
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  From Yaoundé's Boulevard du 20 Mai to Nairobi's Silicon Savannah and Lagos's Yaba tech hub, African cities are transforming into innovation centers. Governments are investing heavily in digital infrastructure, coding bootcamps, and tech education — creating a pipeline of talent that global companies can no longer ignore.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                  <Globe className="w-6 h-6 text-secondary" />
                  Why Agile & Scrum Are Exploding in Africa
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  As African companies scale and compete globally, the demand for Scrum Masters and Project Managers who understand both local business culture and international Agile frameworks has skyrocketed. Organizations across fintech, telecom, healthcare, and government are adopting Scrum — creating massive opportunities for certified professionals.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-secondary" />
                  Aladiah Academy's Mission in Africa
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Aladiah Academy is committed to being the premier Agile training platform for African professionals. Our AI-powered courses are designed to be accessible, multilingual, and deeply practical — giving African Scrum Masters the tools to compete for remote U.S. roles paying $100K+ while also driving transformation in their home markets.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["🇳🇬 Nigeria", "🇰🇪 Kenya", "🇷🇼 Rwanda", "🇿🇦 South Africa", "🇨🇲 Cameroon", "🇬🇭 Ghana", "🇸🇳 Senegal", "🇨🇮 Côte d'Ivoire"].map((country) => (
                  <span key={country} className="px-3 py-2 rounded-lg bg-secondary/10 text-secondary text-sm font-medium text-center">{country}</span>
                ))}
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-r from-secondary/10 to-primary/10 border border-secondary/20">
                <p className="text-foreground leading-relaxed font-medium">
                  The future of global Agile talent is African. Aladiah Academy is here to make sure that future is trained, certified, and ready to lead.
                </p>
              </div>
              <div className="pt-4 flex justify-center">
                <Button variant="coral" size="lg" className="group" onClick={() => navigate("/auth")}>
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.article>
      </div>
    </section>
  );
};

export default AfricaITBlog;