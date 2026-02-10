import { Link, useLocation } from "wouter";
import { useData } from "@/lib/store";
import { cn } from "@/lib/utils";
import { 
  ClipboardList, 
  Settings, 
  BarChart3, 
  Scale, 
  Gamepad2,
  ChevronRight 
} from "lucide-react";

export function AppSidebar() {
  const [location] = useLocation();
  const { matches } = useData();

  // Get recent matches for the sidebar list
  const recentMatches = [...matches].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);

  const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
    const isActive = location === href;
    return (
      <Link href={href}>
        <div
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-none transition-all cursor-pointer group border-l-2",
            isActive
              ? "bg-primary/10 border-primary text-primary"
              : "border-transparent text-muted-foreground hover:bg-white/5 hover:text-white"
          )}
        >
          <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "group-hover:text-white")} />
          <span className="font-display tracking-wider text-sm font-medium">{label}</span>
          {isActive && <ChevronRight className="ml-auto w-4 h-4" />}
        </div>
      </Link>
    );
  };

  return (
    <div className="w-64 h-screen bg-sidebar border-r border-border flex flex-col fixed left-0 top-0 overflow-hidden">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <Gamepad2 className="w-8 h-8 text-primary" />
          SCOUT<span className="text-primary">OS</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1 tracking-widest uppercase">FRC 數據系統</p>
      </div>

      <nav className="flex-1 py-6 space-y-1">
        <NavItem href="/" icon={ClipboardList} label="數據輸入" />
        <NavItem href="/analysis" icon={BarChart3} label="隊伍分析" />
        <NavItem href="/compare" icon={Scale} label="隊伍比較" />
        <NavItem href="/settings" icon={Settings} label="系統設定" />
      </nav>

      <div className="p-4 border-t border-border">
        <h3 className="text-xs font-display text-muted-foreground mb-3 px-2">最近比賽</h3>
        <div className="space-y-1">
          {recentMatches.length === 0 ? (
            <p className="text-xs text-muted-foreground px-2 italic">尚無紀錄</p>
          ) : (
            recentMatches.map((match) => (
              <div key={match.id} className="px-2 py-2 text-sm text-gray-400 hover:text-white border border-transparent hover:border-white/10 bg-white/0 hover:bg-white/5 transition-colors">
                <span className="text-primary font-mono">M{match.matchNumber}</span>
                <span className="mx-2">·</span>
                <span className="">隊伍 {match.teamNumber}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
