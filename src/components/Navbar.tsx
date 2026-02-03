import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Crown, User, LogOut, Settings, Database, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, subscription, isAdmin, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Início" },
    { path: "/chat", label: "Chat", icon: <MessageCircle size={14} />, highlight: true },
    { path: "/gerador", label: "Gerador" },
    { path: "/marketplace", label: "Marketplace" },
    { path: "/personagens", label: "Personagens" },
    { path: "/como-usar", label: "Como Usar" },
  ];

  const tierLabel = subscription?.subscribed ? "PRO" : "FREE";
  const tierColor = subscription?.subscribed ? "text-primary" : "text-muted-foreground";

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center text-background font-bold italic shadow-lg shadow-black/20">
              K
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground editorial-spacing">
              KAIZEN <span className="font-light text-muted-foreground">PROMPTS</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                  (link as any).highlight
                    ? isActive(link.path)
                      ? 'text-primary border-b-2 border-primary pb-1'
                      : 'text-primary hover:opacity-80'
                    : isActive(link.path) 
                      ? 'text-foreground border-b-2 border-foreground pb-1' 
                      : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {(link as any).icon}
                {link.label}
              </Link>
            ))}
            
            {!subscription?.subscribed && (
              <Link
                to="/premium"
                className={`text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-1 ${
                  isActive("/premium") 
                    ? 'text-primary border-b-2 border-primary pb-1' 
                    : 'text-primary hover:opacity-80'
                }`}
              >
                <Crown size={12} />
                Premium
              </Link>
            )}
            
            {user && (
              <div className="flex items-center gap-3 pl-4 border-l border-border">
                <Database size={14} className="text-green-500" />
                <div className="flex flex-col text-right">
                  <span className="text-[10px] font-bold text-foreground">
                    {user.email?.split('@')[0]}
                  </span>
                  <span className={`text-[9px] uppercase font-bold tracking-widest ${tierColor}`}>
                    {tierLabel} PLAN
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Section - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <User size={18} className="text-primary" />
                  </div>
                  {subscription?.subscribed && (
                    <Crown size={16} className="text-primary" />
                  )}
                </button>
                
                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-card border border-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    to="/conta"
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    <User size={16} />
                    Minha Conta
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <Settings size={16} />
                      Painel Admin
                    </Link>
                  )}
                  <button
                    onClick={signOut}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut size={16} />
                    Sair
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Entrar
                </Link>
                <Link
                  to="/cadastro"
                  className="px-4 py-2 bg-foreground text-background rounded-lg font-bold text-sm hover:opacity-90"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-card border-b border-border p-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            
            {!subscription?.subscribed && (
              <Link
                to="/premium"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2"
              >
                <Crown size={14} /> Premium
              </Link>
            )}

            <div className="border-t border-border pt-4 mt-4">
              {user ? (
                <>
                  <Link
                    to="/conta"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm hover:text-foreground"
                  >
                    Minha Conta
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-sm hover:text-foreground"
                    >
                      Painel Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-sm text-destructive"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/cadastro"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 px-4 bg-foreground text-background rounded-lg text-center mt-2 font-bold text-sm"
                  >
                    Cadastrar
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
