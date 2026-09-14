import { useEffect, useRef } from "react";
import Header from "@/components/Header";
import HomeFooter from "@/components/homepage/HomeFooter";
import giftCardsMami from "@/assets/gift-cards-mami.png";

const cardAmount = "$50";

const GiftCards = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ease =
      "opacity .8s cubic-bezier(.4,0,.2,1), transform .8s cubic-bezier(.4,0,.2,1)";

    const hero = root.querySelectorAll<HTMLElement>("[data-hero]");
    hero.forEach((n, i) => {
      n.style.opacity = "0";
      n.style.transform = "translateY(24px)";
      n.style.transition = ease;
      n.style.transitionDelay = 0.1 * i + "s";
    });
    const t1 = window.setTimeout(() => {
      hero.forEach((n) => {
        n.style.opacity = "1";
        n.style.transform = "none";
      });
    }, 80);

    const els = root.querySelectorAll<HTMLElement>("[data-reveal]");
    const reveal = (t: HTMLElement) => {
      t.style.transitionDelay = (t.getAttribute("data-delay") || "0") + "ms";
      t.style.opacity = "1";
      t.style.transform = "none";
    };
    els.forEach((n) => {
      n.style.opacity = "0";
      n.style.transform = "translateY(26px)";
      n.style.transition =
        "opacity .7s cubic-bezier(.4,0,.2,1), transform .7s cubic-bezier(.4,0,.2,1)";
    });

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              reveal(en.target as HTMLElement);
              io?.unobserve(en.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      els.forEach((n) => io!.observe(n));
    } else {
      els.forEach(reveal);
    }
    const t2 = window.setTimeout(() => {
      els.forEach((n) => {
        if (getComputedStyle(n).opacity !== "1") reveal(n);
      });
    }, 900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      io?.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#efe7d3]">
      <Header />
      <main className="flex-1 pt-16">
        <style>{`
          .gc-wrap{max-width:1200px;margin:0 auto;padding:0 20px;width:100%;}
          .gc-hero-grid{display:flex;flex-direction:column;gap:36px;align-items:center;}
          .gc-hero-copy{text-align:center;width:100%;}
          .gc-hero-cta{justify-content:center;}
          .gc-hero-art{width:100%;max-width:440px;}
          @media(min-width:900px){
            .gc-hero-grid{flex-direction:row;align-items:center;gap:56px;}
            .gc-hero-copy{flex:1.05;text-align:left;}
            .gc-hero-cta{justify-content:flex-start;}
            .gc-hero-art{flex:0.95;max-width:none;}
          }
          .gc-reason-row{display:flex;flex-direction:column;align-items:center;gap:24px;}
          .gc-scrap{flex:none;width:min(320px,100%);}
          @media(min-width:760px){
            .gc-reason-row{flex-direction:row;justify-content:center;align-items:flex-start;gap:0;}
            .gc-scrap{width:300px;}
            .gc-scrap + .gc-scrap{margin-left:-22px;}
          }
          .gc-toast-frame{width:100%;min-height:1180px;border:0;border-radius:14px;background:#e8dcbf;display:block;}
          @media(min-width:640px){ .gc-toast-frame{min-height:820px;} }
        `}</style>

        <div
          ref={rootRef}
          style={{
            background: "#efe7d3",
            color: "#452E18",
            fontFamily: "'Gotham','Jost',sans-serif",
            overflowX: "hidden",
          }}
        >
          {/* HERO */}
          <section
            id="top"
            style={{
              position: "relative",
              background: "#21331a",
              color: "#e8dcbf",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "radial-gradient(circle, rgba(215,189,104,0.15) 1.3px, transparent 1.5px)",
                backgroundSize: "30px 30px",
                opacity: 0.5,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "-200px",
                right: "-140px",
                width: "560px",
                height: "560px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(215,189,104,0.18), rgba(215,189,104,0) 62%)",
                pointerEvents: "none",
              }}
            />

            <div
              className="gc-wrap"
              style={{
                position: "relative",
                paddingTop: "clamp(40px,6vw,64px)",
                paddingBottom: "clamp(40px,6vw,64px)",
              }}
            >
              <div className="gc-hero-grid">
                <div className="gc-hero-copy">
                  <div
                    data-hero=""
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "24px",
                    }}
                  >
                    <span
                      style={{
                        height: "1px",
                        width: "34px",
                        background: "#d7bd68",
                        display: "inline-block",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "11px",
                        letterSpacing: "0.4em",
                        textTransform: "uppercase",
                        color: "#d7bd68",
                        fontWeight: 500,
                      }}
                    >
                      A gift from Mami
                    </span>
                  </div>
                  <h1
                    data-hero=""
                    style={{
                      fontFamily: "'Kugile','Playfair Display',serif",
                      fontWeight: 600,
                      fontSize: "clamp(52px,11vw,104px)",
                      lineHeight: 0.96,
                      letterSpacing: "-0.015em",
                      margin: 0,
                      color: "#e8dcbf",
                    }}
                  >
                    Ghar ki
                    <br />
                    <span style={{ color: "#d7bd68", fontFamily: "Kugile" }}>
                      yaad
                    </span>
                  </h1>

                  <p
                    data-hero=""
                    style={{
                      fontSize: "17px",
                      lineHeight: 1.72,
                      color: "rgba(232,220,191,0.84)",
                      maxWidth: "520px",
                      margin: "22px 0 32px",
                      fontWeight: 300,
                    }}
                  >
                    For the days you miss your home. A Madras Mami gift card
                    sends a little of that feeling home — hot dosa, soft idli,
                    strong filter coffee, and a table that still feels familiar.
                  </p>

                  <div
                    data-hero=""
                    className="gc-hero-cta"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      flexWrap: "wrap",
                    }}
                  >
                    <a
                      href="#buy"
                      style={{
                        textDecoration: "none",
                        background: "#d7bd68",
                        color: "#21331a",
                        fontSize: "13px",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        padding: "16px 30px",
                        borderRadius: "8px",
                        boxShadow: "0 8px 22px rgba(0,0,0,0.26)",
                        transition: "all .3s cubic-bezier(.4,0,.2,1)",
                      }}
                    >
                      Buy Gift Card
                    </a>
                    <a
                      href="/menu"
                      style={{
                        textDecoration: "none",
                        border: "1px solid rgba(232,220,191,0.45)",
                        color: "#e8dcbf",
                        fontSize: "13px",
                        fontWeight: 500,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        padding: "15px 28px",
                        borderRadius: "8px",
                        transition: "all .3s cubic-bezier(.4,0,.2,1)",
                      }}
                    >
                      View Menu →
                    </a>
                  </div>
                </div>

                {/* Mami card */}
                <div className="gc-hero-art" data-hero="">
                  <div
                    style={{
                      position: "relative",
                      background: "#e8dcbf",
                      borderRadius: "18px",
                      padding: "14px",
                      boxShadow: "0 26px 60px rgba(0,0,0,0.4)",
                      border: "1px solid rgba(215,189,104,0.5)",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        borderRadius: "12px",
                        overflow: "hidden",
                        background:
                          "radial-gradient(circle at 50% 26%, #35492a 0%, #1c2c16 78%)",
                        height: "clamp(360px,52vh,470px)",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backgroundImage:
                            "radial-gradient(circle, rgba(215,189,104,0.14) 1.1px, transparent 1.3px)",
                          backgroundSize: "24px 24px",
                          opacity: 0.55,
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: "34%",
                          transform: "translate(-50%,-50%)",
                          width: "74%",
                          paddingBottom: "74%",
                          height: 0,
                          borderRadius: "50%",
                          background:
                            "radial-gradient(circle, rgba(215,189,104,0.32), rgba(215,189,104,0) 64%)",
                        }}
                      />
                      <img
                        src={giftCardsMami}
                        alt="Mami — holding filter coffee and a thali"
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          objectPosition: "center bottom",
                          display: "block",
                          filter:
                            "drop-shadow(0 18px 22px rgba(0,0,0,0.4))",
                        }}
                      />
                    </div>
                    {/* gift card overlapping */}
                    <div
                      style={{
                        position: "absolute",
                        left: "-6px",
                        bottom: "18px",
                        width: "min(70%,270px)",
                        aspectRatio: "1.6 / 1",
                        transform: "rotate(-7deg)",
                        transformOrigin: "bottom left",
                        zIndex: 4,
                        borderRadius: "13px",
                        background:
                          "linear-gradient(150deg,#2a4330,#16240f 72%)",
                        boxShadow: "0 22px 44px rgba(0,0,0,0.5)",
                        border: "1px solid rgba(215,189,104,0.45)",
                        padding: "5%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: "7px",
                          border: "1px solid rgba(215,189,104,0.3)",
                          borderRadius: "9px",
                          pointerEvents: "none",
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          position: "relative",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "8px",
                            letterSpacing: "0.34em",
                            textTransform: "uppercase",
                            color: "#d7bd68",
                          }}
                        >
                          Gift Card
                        </span>
                        <span
                          style={{
                            fontSize: "8px",
                            letterSpacing: "0.28em",
                            textTransform: "uppercase",
                            color: "rgba(232,220,191,0.62)",
                          }}
                        >
                          Pure Veg
                        </span>
                      </div>
                      <div style={{ position: "relative", textAlign: "center" }}>
                        <div
                          style={{
                            fontFamily:
                              "'Kugile','Playfair Display',serif",
                            fontStyle: "italic",
                            fontWeight: 600,
                            fontSize: "clamp(18px,5vw,25px)",
                            color: "#e8dcbf",
                            lineHeight: 1,
                          }}
                        >
                          Ghar ki yaad
                        </div>
                        <div
                          style={{
                            fontSize: "8px",
                            letterSpacing: "0.4em",
                            textTransform: "uppercase",
                            color: "#d7bd68",
                            marginTop: "7px",
                          }}
                        >
                          Madras Mami
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-end",
                          position: "relative",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "8px",
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: "rgba(232,220,191,0.55)",
                          }}
                        >
                          From our table to yours
                        </span>
                        <span
                          style={{
                            fontFamily:
                              "'Kugile','Playfair Display',serif",
                            fontWeight: 700,
                            fontSize: "clamp(18px,5vw,24px)",
                            color: "#d7bd68",
                            lineHeight: 0.9,
                          }}
                        >
                          {cardAmount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* WHY */}
          <section
            id="why"
            style={{
              position: "relative",
              overflow: "hidden",
              background: "#efe7d3",
              padding: "clamp(64px,11vw,108px) 0",
            }}
          >
            <svg
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                opacity: 0.06,
                pointerEvents: "none",
              }}
            >
              <defs>
                <pattern
                  id="mm-kolam"
                  width="120"
                  height="120"
                  patternUnits="userSpaceOnUse"
                >
                  <g fill="none" stroke="#21331a" strokeWidth="2">
                    <path d="M60 60 Q72 44 60 28 Q48 44 60 60Z" />
                    <path d="M60 60 Q76 48 92 60 Q76 72 60 60Z" />
                    <path d="M60 60 Q72 76 60 92 Q48 76 60 60Z" />
                    <path d="M60 60 Q44 48 28 60 Q44 72 60 60Z" />
                  </g>
                  <g fill="#21331a">
                    <circle cx="60" cy="60" r="2.6" />
                    <circle cx="60" cy="20" r="2" />
                    <circle cx="100" cy="60" r="2" />
                    <circle cx="60" cy="100" r="2" />
                    <circle cx="20" cy="60" r="2" />
                  </g>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mm-kolam)" />
            </svg>

            <div className="gc-wrap" style={{ position: "relative", zIndex: 1 }}>
              <div
                data-reveal=""
                style={{
                  textAlign: "center",
                  maxWidth: "680px",
                  margin: "0 auto 50px",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "20px",
                  }}
                >
                  <span
                    style={{
                      height: "1px",
                      width: "28px",
                      background: "#d7bd68",
                      display: "inline-block",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.4em",
                      textTransform: "uppercase",
                      color: "#a8842e",
                      fontWeight: 600,
                    }}
                  >
                    Why it feels like home
                  </span>
                  <span
                    style={{
                      height: "1px",
                      width: "28px",
                      background: "#d7bd68",
                      display: "inline-block",
                    }}
                  />
                </div>
                <h2
                  style={{
                    fontFamily: "'Kugile','Playfair Display',serif",
                    fontWeight: 600,
                    fontSize: "clamp(34px,7vw,56px)",
                    lineHeight: 1.04,
                    letterSpacing: "-0.01em",
                    margin: "0 0 22px",
                    color: "#21331a",
                  }}
                >
                  A simple way to send home
                </h2>
                <p
                  style={{
                    fontSize: "clamp(16px,4.2vw,18px)",
                    lineHeight: 1.75,
                    color: "#5c4326",
                    margin: 0,
                    fontWeight: 300,
                  }}
                >
                  A Madras Mami gift card is for the people you wish you could
                  cook for, sit with, or take out for dosa yourself. They can
                  spend it on the food that feels closest to home, crisp dosa,
                  idli and sambar, vadai, filter coffee, desserts, and on the
                  unhurried time that comes with it.
                </p>
              </div>

              <div className="gc-reason-row">
                {[
                  {
                    rot: "-3deg",
                    ty: "0",
                    title: "Friends who moved away",
                    body: "For friends who moved away and are still finding their own spots.",
                    delay: "0",
                    icon: (
                      <>
                        <rect x="3" y="7" width="18" height="13" rx="2" />
                        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <path d="M3 13h18" />
                      </>
                    ),
                  },
                  {
                    rot: "2deg",
                    ty: "16px",
                    title: "Family who miss home",
                    body: "For family who miss the food they grew up with.",
                    delay: "110",
                    icon: (
                      <>
                        <path d="M3 10.5 12 4l9 6.5" />
                        <path d="M5 9.5V20h14V9.5" />
                        <path d="M12 20v-5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2" />
                      </>
                    ),
                  },
                  {
                    rot: "-2deg",
                    ty: "6px",
                    title: "Anyone craving home",
                    body: "For anyone who just needs a familiar South Indian meal.",
                    delay: "220",
                    icon: (
                      <>
                        <path d="M4 9h12v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z" />
                        <path d="M16 10h2.5a2.5 2.5 0 0 1 0 5H16" />
                        <path d="M8 3c-.5 1 .5 1.5 0 2.5M11 3c-.5 1 .5 1.5 0 2.5" />
                        <path d="M5 21h11" />
                      </>
                    ),
                  },
                ].map((c, i) => (
                  <div
                    key={i}
                    className="gc-scrap"
                    data-reveal=""
                    data-delay={c.delay}
                  >
                    <div
                      style={{
                        position: "relative",
                        zIndex: 1,
                        background: "#fbf8ef",
                        borderRadius: "4px",
                        padding: "30px 26px 34px",
                        textAlign: "center",
                        boxShadow: "0 12px 28px rgba(69,46,24,0.16)",
                        border: "1px solid rgba(69,46,24,0.05)",
                        transform: `rotate(${c.rot}) translateY(${c.ty})`,
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: "-10px",
                          left: "50%",
                          transform: `translateX(-50%) rotate(${c.rot})`,
                          width: "76px",
                          height: "22px",
                          background:
                            "linear-gradient(180deg, rgba(215,189,104,0.9), rgba(215,189,104,0.62))",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        }}
                      />
                      <div
                        style={{
                          width: "58px",
                          height: "58px",
                          borderRadius: "50%",
                          background: "rgba(215,189,104,0.22)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "8px auto 18px",
                        }}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#a8842e"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {c.icon}
                        </svg>
                      </div>
                      <h3
                        style={{
                          fontFamily: "'Kugile','Playfair Display',serif",
                          fontWeight: 600,
                          fontSize: "21px",
                          color: "#21331a",
                          margin: "0 0 9px",
                          lineHeight: 1.15,
                        }}
                      >
                        {c.title}
                      </h3>
                      <p
                        style={{
                          fontSize: "15px",
                          lineHeight: 1.7,
                          color: "#5c4326",
                          margin: 0,
                          fontWeight: 300,
                        }}
                      >
                        {c.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Toast widget */}
              <div
                id="buy"
                data-reveal=""
                style={{
                  position: "relative",
                  marginTop: "clamp(40px,7vw,68px)",
                  borderRadius: "22px",
                  background: "#21331a",
                  padding: "clamp(24px,5vw,52px)",
                  overflow: "hidden",
                  boxShadow: "0 22px 52px rgba(20,40,20,0.3)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                      "repeating-linear-gradient(118deg, rgba(255,255,255,0.045) 0 2px, transparent 2px 26px)",
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    textAlign: "center",
                    maxWidth: "560px",
                    margin: "0 auto clamp(22px,4vw,34px)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.4em",
                      textTransform: "uppercase",
                      color: "#d7bd68",
                      fontWeight: 500,
                    }}
                  >
                    Send ghar ki yaad
                  </span>
                  <h2
                    style={{
                      fontFamily: "'Kugile','Playfair Display',serif",
                      fontWeight: 600,
                      fontSize: "clamp(30px,6vw,46px)",
                      lineHeight: 1.05,
                      margin: "14px 0 12px",
                      color: "#e8dcbf",
                    }}
                  >
                    Buy a gift card
                  </h2>
                  <p
                    style={{
                      fontSize: "clamp(15px,4vw,17px)",
                      lineHeight: 1.6,
                      color: "rgba(232,220,191,0.82)",
                      margin: 0,
                      fontWeight: 300,
                    }}
                  >
                    Pick an amount and send it in a minute.
                  </p>
                </div>
                <div
                  style={{
                    position: "relative",
                    background: "#e8dcbf",
                    borderRadius: "18px",
                    padding: "clamp(10px,2.5vw,18px)",
                    boxShadow: "inset 0 0 0 1px rgba(215,189,104,0.4)",
                  }}
                >
                  <iframe
                    className="gc-toast-frame"
                    src="https://order.toasttab.com/egiftcards/madras-mami-6261-mayfield-road-unit-145"
                    title="Madras Mami Gift Cards"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <HomeFooter />
    </div>
  );
};

export default GiftCards;
