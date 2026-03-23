import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft, ChevronRight, Globe, TrendingUp, Calendar, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BlogSection from "@/components/BlogSection";
import AfricaITBlog from "@/components/AfricaITBlog";

const posts = (t: (k: string) => string) => [
  {
    id: 1,
    category: t("blog.post1.category"),
    date: t("blog.post1.date"),
    readTime: t("blog.post1.read"),
    title: t("blog.post1.title"),
    icon: TrendingUp,
    color: "text-primary",
    border: "border-primary/30",
    bg: "bg-primary/5",
  },
  {
    id: 2,
    category: t("blog.post2.category"),
    date: t("blog.post2.date"),
    readTime: t("blog.post2.read"),
    title: t("blog.post2.title"),
    icon: Globe,
    color: "text-secondary",
    border: "border-secondary/30",
    bg: "bg-secondary/5",
  },
];

const BlogHub = () => {
  const [current, setCurrent] = useState(0);
  const { t } = useLanguage();

  return (
    <div>
      {/* Tab selector */}
      <div className="bg-background pt-16 pb-0">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold text-secondary tracking-widest uppercase">{t("blog.hub.label")}</span>
            <h2 className="text-3xl font-display font-bold text-foreground mt-2 mb-8">{t("blog.hub.title")}</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-3xl mx-auto">
            {posts(t).map((post, i) => {
              const Icon = post.icon;
              return (
                <button key={post.id} onClick={() => setCurrent(i)}
                  className={"flex-1 flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-300 " + (current === i ? post.border + " " + post.bg + " shadow-md" : "border-border hover:border-border/80 bg-card")}
                >
                  <div className={"w-9 h-9 rounded-lg flex items-center justify-center shrink-0 " + (current === i ? post.bg : "bg-muted")}>
                    <Icon className={"w-4 h-4 " + (current === i ? post.color : "text-muted-foreground")} />
                  </div>
                  <div>
                    <p className={"text-xs font-semibold uppercase tracking-wide mb-1 " + (current === i ? post.color : "text-muted-foreground")}>{post.category}</p>
                    <p className={"text-sm font-medium leading-snug " + (current === i ? "text-foreground" : "text-muted-foreground")}>{post.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Post content */}
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
          {current === 0 ? <BlogSection /> : <AfricaITBlog />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default BlogHub;