import Link from "next/link";

const NotFound = () => {
  return (
    <div className="bg-foreground relative overflow-hidden min-h-[70vh] flex items-center justify-center">
      <div className="relative text-center px-6">
        <p className="text-[6rem] md:text-[8rem] font-black text-primary-foreground/10 leading-none mb-2">404</p>
        <h1 className="text-2xl font-black text-primary-foreground mb-3">Sayfa bulunamadı</h1>
        <p className="text-sm text-primary-foreground/50 mb-8">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
        <Link href="/" className="inline-flex items-center bg-accent hover:brightness-110 text-accent-foreground font-bold px-8 py-4 rounded-full transition-all duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-foreground">
          Ana Sayfa
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
