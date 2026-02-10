import { useState, useMemo } from "react";
import { useData } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { Search, Users } from "lucide-react";

export default function ComparePage() {
  const { getAllTeams, getTeamMatches, items } = useData();
  const allTeams = getAllTeams();
  
  // State for selected teams (max 8)
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  
  const toggleTeam = (team: string) => {
    if (selectedTeams.includes(team)) {
      setSelectedTeams(prev => prev.filter(t => t !== team));
    } else {
      if (selectedTeams.length < 8) {
        setSelectedTeams(prev => [...prev, team]);
      }
    }
  };

  // Prepare comparison data
  const comparisonData = useMemo(() => {
    return selectedTeams.map(teamNum => {
      const matches = getTeamMatches(teamNum);
      const stats: any = { team: `Team ${teamNum}`, fullTeam: teamNum };
      
      // Calculate averages for score items
      items.filter(i => i.type === "score").forEach(item => {
        const total = matches.reduce((sum, m) => sum + (Number(m.data[item.id]) || 0), 0);
        stats[item.name] = matches.length ? (total / matches.length).toFixed(1) : 0;
      });
      
      return stats;
    });
  }, [selectedTeams, getTeamMatches, items]);

  // Transform for Radar Chart (needs generic axes)
  const radarData = useMemo(() => {
    const scoreItems = items.filter(i => i.type === "score");
    return scoreItems.map(item => {
      const point: any = { subject: item.name, fullMark: 100 }; // assumption
      selectedTeams.forEach((team, idx) => {
        const teamStats = comparisonData.find(d => d.fullTeam === team);
        point[`team${idx}`] = teamStats ? Number(teamStats[item.name]) : 0;
      });
      return point;
    });
  }, [items, comparisonData, selectedTeams]);

  // Colors for teams
  const COLORS = [
    "#f97316", // Orange (Primary)
    "#3b82f6", // Blue
    "#10b981", // Green
    "#8b5cf6", // Purple
    "#ec4899", // Pink
    "#facc15", // Yellow
    "#ef4444", // Red
    "#6366f1"  // Indigo
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-white">Team Comparison</h2>
        <p className="text-muted-foreground">Compare metrics across up to 8 teams.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Team Selector Sidebar */}
        <Card className="bg-secondary/30 border-white/10 md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-sm font-display tracking-widest text-primary">SELECT TEAMS ({selectedTeams.length}/8)</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex flex-wrap gap-2 mb-4">
               {selectedTeams.map((team, idx) => (
                 <div key={team} 
                      className="px-2 py-1 rounded bg-white/10 border border-white/20 text-xs flex items-center gap-2"
                      style={{ borderColor: COLORS[idx] }}
                 >
                   <span className="font-bold" style={{ color: COLORS[idx] }}>{team}</span>
                   <button onClick={() => toggleTeam(team)} className="hover:text-white text-gray-400">×</button>
                 </div>
               ))}
             </div>
             <div className="space-y-1 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
               {allTeams.length === 0 && <p className="text-xs text-muted-foreground">No teams found.</p>}
               {allTeams.map(team => (
                 <div 
                   key={team}
                   onClick={() => toggleTeam(team)}
                   className={`p-2 rounded text-sm cursor-pointer transition-colors flex justify-between items-center ${selectedTeams.includes(team) ? 'bg-primary/20 text-white' : 'hover:bg-white/5 text-gray-400'}`}
                 >
                   <span>Team {team}</span>
                   {selectedTeams.includes(team) && <div className="w-2 h-2 rounded-full bg-primary" />}
                 </div>
               ))}
             </div>
          </CardContent>
        </Card>

        {/* Charts Area */}
        <div className="md:col-span-3 space-y-8">
           {selectedTeams.length === 0 ? (
             <div className="h-96 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-muted-foreground">
               <Users className="w-12 h-12 mb-4 opacity-20" />
               <p>Select teams to view comparison data</p>
             </div>
           ) : (
             <>
               {/* Radar Comparison */}
               <Card className="bg-secondary/30 border-white/10 cyber-border">
                 <CardHeader>
                    <CardTitle className="text-primary font-display tracking-widest text-lg">PERFORMANCE PROFILE</CardTitle>
                 </CardHeader>
                 <CardContent className="h-[400px]">
                   <ResponsiveContainer width="100%" height="100%">
                     <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                       <PolarGrid stroke="#333" />
                       <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                       <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: '#4b5563' }} />
                       {selectedTeams.map((team, idx) => (
                         <Radar
                           key={team}
                           name={`Team ${team}`}
                           dataKey={`team${idx}`}
                           stroke={COLORS[idx]}
                           fill={COLORS[idx]}
                           fillOpacity={0.1}
                         />
                       ))}
                       <Legend wrapperStyle={{ color: '#fff' }} />
                       <Tooltip 
                         contentStyle={{ backgroundColor: '#09090b', borderColor: '#333', color: '#fff' }}
                         itemStyle={{ color: '#fff' }}
                       />
                     </RadarChart>
                   </ResponsiveContainer>
                 </CardContent>
               </Card>

               {/* Bar Comparison */}
               <Card className="bg-secondary/30 border-white/10">
                 <CardHeader>
                    <CardTitle className="text-primary font-display tracking-widest text-lg">AVERAGE SCORES</CardTitle>
                 </CardHeader>
                 <CardContent className="h-[400px]">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={comparisonData}>
                       <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                       <XAxis dataKey="team" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                       <YAxis stroke="#9ca3af" />
                       <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#09090b', borderColor: '#333', color: '#fff' }} />
                       <Legend />
                       {items.filter(i => i.type === "score").slice(0, 4).map((item, idx) => (
                         <Bar key={item.id} dataKey={item.name} fill={idx % 2 === 0 ? COLORS[0] : COLORS[1]} opacity={1 - (idx * 0.2)} radius={[4, 4, 0, 0]} />
                       ))}
                     </BarChart>
                   </ResponsiveContainer>
                 </CardContent>
               </Card>
             </>
           )}
        </div>
      </div>
    </div>
  );
}
