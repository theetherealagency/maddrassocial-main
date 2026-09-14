import { Link } from "react-router-dom";
import Header from "@/components/Header";
import HomeFooter from "@/components/homepage/HomeFooter";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <div className="min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="text-center max-w-md">
          <p className="text-[10px] tracking-[0.4em] uppercase font-gotham font-medium mb-4" style={{ color: "hsl(var(--gold))" }}>
            404
          </p>
          <h1 className="font-kugile text-3xl sm:text-4xl text-primary mb-4">
            Lost in the Kitchen
          </h1>
          <div className="w-10 h-px mx-auto mb-6" style={{ backgroundColor: "hsl(var(--gold))" }} />
          <p className="text-muted-foreground text-sm font-gotham leading-relaxed mb-8">
            Looks like this page wandered off — even Social can't find it. Let's get you back to something delicious.
          </p>
          <Link
            to="/"
            className="inline-flex items-center font-gotham font-medium text-[11px] uppercase tracking-[0.25em] transition-all duration-200"
            style={{
              height: "44px",
              padding: "0 28px",
              border: "1.5px solid hsl(var(--gold))",
              color: "hsl(var(--mud))",
              backgroundColor: "transparent",
              borderRadius: "2px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "hsl(var(--gold))";
              e.currentTarget.style.color = "#E8DCC8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "hsl(var(--mud))";
            }}
          >
            Return Home →
          </Link>
        </div>
      </div>
      <HomeFooter />
    </div>
  );
};

export default NotFound;
