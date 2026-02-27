import Header from "./Header";
import Footer from "./Footer";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen min-h-dvh flex flex-col bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-foreground focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        İçeriğe Geç
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
