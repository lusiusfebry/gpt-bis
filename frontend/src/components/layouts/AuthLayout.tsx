import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="font-display flex flex-col min-h-screen text-slate-900 bg-background-light">
      <main className="flex-grow flex flex-col lg:flex-row h-screen">
        <section className="relative w-full lg:w-7/12 h-64 lg:h-full overflow-hidden flex flex-col justify-between p-8 lg:p-16 text-white">
          <div
            className="absolute inset-0 bg-cover bg-center"
            data-alt="High-quality aerial view of an open-pit mining site"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBnrSzoHyun5dwR6ti5KfWNS5vtier2mJSGGmFeSuDSGbePTrNOVjuc_qGfWkYRhch7T8Xd29X63LrCSvJwkUCIJhAwLbGwmbL6rv22WU6DltGlBDwr-9lD0VW1-wzZblYRTRlZIk2TITWz--aP-N3HAHe2c7u97w7jMXJuTEm6jf5jqs0xjkulhcQpJJJUX-gzG5zArPz2D-ZP3FPVOihIIpino0_Nd7poC1xfhKc0a6oGJGLmj5fzxxKcKH9Y-UOGAevS0mPH600")',
            }}
          />
          <div className="absolute inset-0 bg-slate-900/60" />

          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-primary text-slate-900 flex items-center justify-center rounded-lg shadow-lg">
                <span className="material-symbols-outlined font-bold">manufacturing</span>
              </div>
              <h2 className="text-2xl font-black tracking-tighter">PSG Taliabu</h2>
            </div>
            
            <div className="mt-8 max-w-xl">
              <h1 className="text-4xl lg:text-6xl font-black leading-tight mb-4 text-primary">
                Bebang Sistem Informasi
              </h1>
              <p className="text-lg lg:text-xl text-slate-200 font-medium leading-relaxed">
                Integrated information system for PT Prima Sarana Gemilang Site Taliabu. Streamlining operations and management across the site.
              </p>
            </div>
          </div>

          <div className="relative z-10 hidden lg:flex items-center gap-12 border-t border-white/20 pt-8">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">badge</span>
              <span className="text-sm font-bold tracking-widest uppercase">HR INFO</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">inventory_2</span>
              <span className="text-sm font-bold tracking-widest uppercase">INVENTORY</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">restaurant</span>
              <span className="text-sm font-bold tracking-widest uppercase">MESS MGMT</span>
            </div>
          </div>
        </section>

        <section className="w-full lg:w-5/12 bg-white flex flex-col justify-center px-6 py-12 lg:px-20 relative">
          <div className="max-w-md w-full mx-auto">
            <Outlet />
          </div>
        </section>
      </main>

      <footer className="bg-white py-6 px-8 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 font-medium">
            © 2024 PT Prima Sarana Gemilang - Site Taliabu. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-slate-400 hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-slate-400 hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AuthLayout;
