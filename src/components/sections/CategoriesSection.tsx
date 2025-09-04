import { useState, useEffect } from "react";
import { BookOpen, Globe, TrendingUp, History, Leaf, Cpu, Scale, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DatabaseService } from "@/lib/database";

const categoryIcons: { [key: string]: any } = {
  "Current Affairs": TrendingUp,
  "Polity": Scale,
  "Economy": TrendingUp,
  "Geography": Globe,
  "History": History,
  "Environment": Leaf,
  "Science & Tech": Cpu,
  "Ethics": Users,
};

const categoryColors: { [key: string]: string } = {
  "Current Affairs": "from-blue-500 to-purple-500",
  "Polity": "from-green-500 to-teal-500",
  "Economy": "from-pink-500 to-rose-500",
  "Geography": "from-orange-500 to-red-500",
  "History": "from-purple-500 to-pink-500",
  "Environment": "from-emerald-500 to-green-500",
  "Science & Tech": "from-cyan-500 to-blue-500",
  "Ethics": "from-yellow-500 to-orange-500",
};

interface Category {
  name: string;
  icon: any;
  count: string;
  color: string;
}

export const CategoriesSection = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjectCounts();
  }, []);

  const fetchSubjectCounts = async () => {
    try {
      const subjectCounts = await DatabaseService.getSubjectCounts();
      
      const categoriesWithCounts: Category[] = Object.entries(subjectCounts).map(([name, count]) => ({
        name,
        icon: categoryIcons[name] || BookOpen,
        count: count > 0 ? `${count} lectures` : "Coming Soon",
        color: categoryColors[name] || "from-gray-500 to-gray-600"
      }));

      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error("Error fetching subject counts:", error);
      // Fallback to default categories if database fails
      const defaultCategories: Category[] = Object.keys(categoryIcons).map(name => ({
        name,
        icon: categoryIcons[name],
        count: "Coming Soon",
        color: categoryColors[name]
      }));
      setCategories(defaultCategories);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/subject/${encodeURIComponent(categoryName)}`);
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">Loading subjects...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            UPSC
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {" "}Subjects
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive coverage of all UPSC subjects with expert-curated content
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.name}
                className="glass-card hover:shadow-card transition-smooth hover:scale-105 cursor-pointer group"
                onClick={() => handleCategoryClick(category.name)}
              >
                <div className="p-4 text-center">
                  <div className={`w-10 h-10 mx-auto mb-3 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-smooth">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{category.count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};