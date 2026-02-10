import { useState, useMemo } from "react";
import { useData } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, History } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AnalysisPage() {
  const { getTeamMatches, items } = useData();
  const [searchTeam, setSearchTeam] = useState("");
  const [activeTeam, setActiveTeam] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTeam(searchTeam);
  };

  const matches = useMemo(() => activeTeam ? getTeamMatches(activeTeam) : [], [activeTeam, getTeamMatches]);
  
  // Prepare Chart Data
  const chartData = useMemo(() => {
    return matches.map(m => {
      const point: any = { match: `M${m.matchNumber}` };
      items.filter(i => i.type === "score").forEach(item => {
        point[item.name] = Number(m.data[item.id]) || 0;
      });
      return point;
    });
  }, [matches, items]);

  // Calculate Averages
  const averages = useMemo(() => {
    const stats: Record<string, number> = {};
    if (matches.length === 0) return stats;

    items.filter(i => i.type === "score").forEach(item => {
      const total = matches.reduce((sum, m) => sum + (Number(m.data[item.id]) || 0), 0);
      stats[item.name] = parseFloat((total / matches.length).toFixed(1));
    });
    return stats;
  }, [matches, items]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-white">隊伍分析</h2>
        <p className="text-muted-foreground">深入了解特定隊伍的表現。</p>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center py-8">
        <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-lg">
          <Input 
             placeholder="輸入隊伍編號 (例如 254)" 
             value={searchTeam}
             onChange={(e) => setSearchTeam(e.target.value)}
             className="bg-black/50 border-white/20 h-12 text-lg font-mono text-center focus:border-primary"
          />
          <Button type="submit" size="lg" className="h-12 w-12 px-0 bg-primary hover:bg-primary/90 text-black">
            <Search className="w-5 h-5" />
          </Button>
        </form>
      </div>

      {activeTeam && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4">
             <div className="text-5xl font-display font-bold text-white tracking-tighter">
               <span className="text-primary text-2xl mr-2">隊伍</span>
               {activeTeam}
             </div>
             <div className="bg-white/10 px-3 py-1 rounded text-xs uppercase tracking-widest text-gray-400">
               已紀錄 {matches.length} 場比賽
             </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(averages).map(([name, value]) => (
              <Card key={name} className="bg-secondary/30 border-white/10 hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs uppercase tracking-widest text-gray-400">{name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-mono font-bold text-white">{value}</div>
                  <div className="text-xs text-primary mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> 平均值
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trend Chart */}
          <Card className="bg-secondary/30 border-white/10 cyber-border">
            <CardHeader>
              <CardTitle className="text-primary font-display tracking-widest text-lg">表現趨勢</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="match" stroke="#666" tick={{ fill: '#666' }} />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#333', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  {items.filter(i => i.type === "score").slice(0, 3).map((item, idx) => (
                    <Line 
                      key={item.id} 
                      type="monotone" 
                      dataKey={item.name} 
                      stroke={idx === 0 ? "#f97316" : idx === 1 ? "#3b82f6" : "#10b981"} 
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#09090b", strokeWidth: 2 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Match History List */}
          <Card className="bg-secondary/30 border-white/10">
            <CardHeader>
               <CardTitle className="text-primary font-display tracking-widest text-lg flex items-center gap-2">
                 <History className="w-5 h-5" /> 比賽歷史
               </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {matches.map((match) => (
                  <AccordionItem key={match.id} value={match.id} className="border-white/10">
                    <AccordionTrigger className="hover:no-underline hover:bg-white/5 px-2 rounded group">
                      <div className="flex items-center gap-4 w-full">
                        <span className="font-mono text-primary font-bold">場次 {match.matchNumber}</span>
                        <span className="text-xs text-muted-foreground ml-auto mr-4">
                          {new Date(match.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-4 bg-black/20">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {items.map(item => (
                          <div key={item.id} className="border-l-2 border-white/10 pl-3">
                            <div className="text-[10px] uppercase text-gray-500 mb-1">{item.name}</div>
                            <div className="text-sm font-mono text-white">
                              {match.data[item.id] || "-"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
