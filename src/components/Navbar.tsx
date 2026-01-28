import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sparkles, Crown, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, subscription, isAdmin, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/prompts", label: "Prompts" },
    { path: "/como-usar", label: "Como Usar" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold hidden sm:block">
              <span className="purple-gradient-text">KAIZEN</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive(link.path)
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {!subscription?.subscribed && (
              <Link
                to="/premium"
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  isActive("/premium")
                    ? "bg-amber-500/20 text-amber-500"
                    : "text-amber-500 hover:bg-amber-500/10"
                }`}
              >
                <Crown size={18} />
                Premium
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <User size={18} className="text-primary" />
                  </div>
                  {subscription?.subscribed && (
                    <Crown size={16} className="text-amber-500" />
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
                  className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/cadastro"
                  className="btn-primary-glow px-4 py-2 rounded-lg"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {!subscription?.subscribed && (
                <Link
                  to="/premium"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg flex items-center gap-2 text-amber-500 hover:bg-amber-500/10"
                >
                  <Crown size={18} />
                  Premium
                </Link>
              )}

              <div className="border-t border-border my-2 pt-2">
                {user ? (
                  <>
                    <Link
                      to="/conta"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-lg flex items-center gap-3 hover:bg-muted"
                    >
                      <User size={18} />
                      Minha Conta
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-3 rounded-lg flex items-center gap-3 hover:bg-muted"
                      >
                        <Settings size={18} />
                        Painel Admin
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 rounded-lg flex items-center gap-3 text-destructive hover:bg-destructive/10"
                    >
                      <LogOut size={18} />
                      Sair
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-lg block hover:bg-muted"
                    >
                      Entrar
                    </Link>
                    <Link
                      to="/cadastro"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-lg block btn-primary-glow text-center mt-2"
                    >
                      Cadastrar
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
