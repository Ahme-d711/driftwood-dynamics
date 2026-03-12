import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50 mt-20">
      <div className="section-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                <span className="font-display text-sm font-bold text-accent-foreground">L</span>
              </div>
              <span className="font-display text-xl font-semibold">Luxe</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium products curated for the modern lifestyle.
            </p>
          </div>
          {[
            { title: "Shop", links: ["All Products", "New Arrivals", "Best Sellers", "Sale"] },
            { title: "Support", links: ["Contact Us", "Shipping", "Returns", "FAQ"] },
            { title: "Company", links: ["About", "Careers", "Press", "Blog"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-sm mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link to="/products" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-border/50 text-center text-sm text-muted-foreground">
          © 2026 Luxe. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
