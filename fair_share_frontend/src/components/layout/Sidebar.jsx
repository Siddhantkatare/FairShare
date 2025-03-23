import { Home, Users, LogOut, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Groups", path: "/groups" },
    { icon: DollarSign, label: "Settle", path: "/settle" },
  ];

  return (
    <div className="h-full w-64 bg-card border-r flex flex-col overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-2xl font-medium flex items-center">
          <span className="bg-primary text-primary-foreground p-1 rounded mr-2 text-sm">FS</span>
          FairShare
        </h2>
        {isMobile && (
          <Button
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="lg:hidden"
          >
            <XIcon className="h-5 w-5" />
          </Button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path}>
                <Link to={item.path} onClick={onClose}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center rounded-md p-3 transition-all ${
                      isActive
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active-indicator"
                        className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary"
                      />
                    )}
                  </motion.div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 mt-auto border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );
};
