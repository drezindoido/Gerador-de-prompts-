import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Prompts from "./pages/Prompts";
import Premium from "./pages/Premium";
import ComoUsar from "./pages/ComoUsar";
import Conta from "./pages/Conta";
import Admin from "./pages/Admin";
import Generator from "./pages/Generator";
import Video from "./pages/Video";
import Marketplace from "./pages/Marketplace";
import Characters from "./pages/Characters";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/prompts" element={<Prompts />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/como-usar" element={<ComoUsar />} />
              <Route path="/conta" element={<Conta />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/gerador" element={<Generator />} />
              <Route path="/video" element={<Video />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/personagens" element={<Characters />} />
              <Route path="/chat" element={<Chat />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
