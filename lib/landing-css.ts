export const landingCss = `

  :root {
    color-scheme: dark;
  }

  .hmw-page,
  .hmw-page * {
    box-sizing: border-box;
  }

  .hmw-page {
    min-height: 100vh;
    background:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px),
      radial-gradient(circle at 65% 0%, rgba(0,255,136,0.18), transparent 30rem),
      #070807;
    background-size: 44px 44px, 44px 44px, auto, auto;
    color: #f7f7f2;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    padding: 24px;
    overflow-x: hidden;
  }

  .hmw-header,
  .hmw-hero,
  .hmw-proof,
  .hmw-section,
  .hmw-final,
  .hmw-footer {
    width: min(1180px, 100%);
    margin-left: auto;
    margin-right: auto;
  }

  .hmw-header {
    position: sticky;
    top: 16px;
    z-index: 30;
    display: grid;
    grid-template-columns: 330px 1fr auto;
    align-items: center;
    gap: 18px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(7,8,7,0.88);
    backdrop-filter: blur(18px);
    border-radius: 18px;
    padding: 14px 16px;
    box-shadow: 0 20px 55px rgba(0,0,0,0.34);
  }

  .hmw-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    color: inherit;
    text-decoration: none;
    min-width: 0;
  }

  .hmw-mark {
    display: grid;
    place-items: center;
    width: 46px;
    height: 46px;
    border: 1px solid rgba(0,255,136,0.42);
    background: rgba(0,255,136,0.10);
    border-radius: 12px;
    color: #00ff88;
    font-family: "IBM Plex Mono", Consolas, monospace;
    font-size: 14px;
    font-weight: 800;
  }

  .hmw-brand-title,
  .hmw-brand-subtitle {
    display: block;
  }

  .hmw-brand-title {
    font-family: "IBM Plex Mono", Consolas, monospace;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #00ff88;
  }

  .hmw-brand-subtitle {
    margin-top: 4px;
    color: #a6abb4;
    font-size: 13px;
    line-height: 1.35;
  }

  .hmw-nav {
    display: flex;
    justify-content: flex-end;
    gap: 22px;
    min-width: 0;
  }

  .hmw-nav a,
  .hmw-footer a {
    color: #b7bcc5;
    text-decoration: none;
    font-size: 14px;
    white-space: nowrap;
  }

  .hmw-nav a:hover,
  .hmw-footer a:hover {
    color: #ffffff;
  }

  .hmw-button {
    border: 0;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border-radius: 12px;
    padding: 13px 18px;
    min-height: 44px;
    font-family: "IBM Plex Mono", Consolas, monospace;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    text-decoration: none;
    white-space: nowrap;
    transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
  }

  .hmw-button:hover {
    transform: translateY(-1px);
  }

  .hmw-button-primary {
    background: #00ff88;
    color: #04130b;
    border: 1px solid #00ff88;
  }

  .hmw-button-secondary {
    background: rgba(255,255,255,0.035);
    color: #ffffff;
    border: 1px solid rgba(255,255,255,0.16);
  }

  .hmw-hero {
    display: grid;
    grid-template-columns: minmax(0, 0.98fr) minmax(420px, 0.82fr);
    gap: 42px;
    align-items: start;
    padding: 86px 0 42px;
  }

  .hmw-hero-copy {
    max-width: 690px;
    min-width: 0;
  }

  .hmw-hero h1 {
    margin: 0;
    font-size: clamp(46px, 4.25vw, 60px);
    line-height: 1.04;
    letter-spacing: 0;
    font-weight: 850;
    text-wrap: balance;
    overflow-wrap: break-word;
  }

  .hmw-hero p {
    margin: 26px 0 0;
    max-width: 770px;
    color: #c8ccd2;
    font-size: 21px;
    line-height: 1.65;
  }

  .hmw-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 30px;
  }

  .hmw-actions.centered {
    justify-content: center;
  }

  .hmw-hero-notes {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1px;
    margin-top: 4px;
    border-top: 1px solid rgba(255,255,255,0.1);
    border-bottom: 1px solid rgba(255,255,255,0.1);
    color: #dbe2e9;
    font-size: 15px;
    line-height: 1.45;
  }

  .hmw-hero-notes span {
    position: relative;
    min-height: 70px;
    padding: 20px 22px 20px 46px;
    border-right: 1px solid rgba(255,255,255,0.1);
  }

  .hmw-hero-notes span:last-child {
    border-right: 0;
  }

  .hmw-hero-notes span::before {
    content: "+";
    position: absolute;
    left: 22px;
    top: 20px;
    color: #00ff88;
    font-family: "IBM Plex Mono", Consolas, monospace;
    font-weight: 800;
  }

  .hmw-hero-visual {
    position: relative;
    min-width: 0;
    transform: translateY(-26px);
  }

  .hmw-hero-image {
    display: block;
    width: 100%;
    max-width: 560px;
    margin-left: auto;
    border-radius: 30px;
    filter: drop-shadow(0 38px 80px rgba(0,0,0,0.55));
  }

  .hmw-console {
    position: absolute;
    left: 0;
    right: 34px;
    bottom: -36px;
    margin-top: 0;
    max-width: 100%;
    border: 1px solid rgba(0,255,136,0.22);
    background: linear-gradient(180deg, rgba(0,255,136,0.08), rgba(255,255,255,0.02)), rgba(0,0,0,0.76);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 26px 90px rgba(0,0,0,0.45);
  }

  .hmw-console-top {
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid rgba(255,255,255,0.09);
    padding: 13px 16px;
  }

  .hmw-dot {
    width: 9px;
    height: 9px;
    border-radius: 999px;
    background: rgba(255,255,255,0.22);
  }

  .hmw-console-title {
    margin-left: 8px;
    color: #8f98a4;
    font-family: "IBM Plex Mono", Consolas, monospace;
    font-size: 12px;
  }

  .hmw-console-body {
    display: grid;
    grid-template-columns: 150px 1fr;
    gap: 14px;
    padding: 16px;
    align-items: stretch;
  }

  .hmw-risk,
  .hmw-scan-lines,
  .hmw-severity {
    border: 1px solid rgba(255,255,255,0.10);
    background: rgba(255,255,255,0.035);
    border-radius: 14px;
    padding: 18px;
  }

  .hmw-risk span,
  .hmw-section span,
  .hmw-detection-copy span {
    display: block;
    color: #00ff88;
    font-family: "IBM Plex Mono", Consolas, monospace;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .hmw-risk strong {
    display: block;
    margin-top: 10px;
    font-size: 46px;
    line-height: 1;
  }

  .hmw-risk em {
    color: #ffb454;
    font-style: normal;
    font-weight: 800;
  }

  .hmw-scan-lines {
    display: grid;
    gap: 12px;
  }

  .hmw-scan-lines span {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #d7dce3;
    font-size: 15px;
  }

  .hmw-scan-lines svg {
    color: #00ff88;
  }

  .hmw-severity {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .hmw-severity span {
    border-radius: 10px;
    padding: 11px 12px;
    font-family: "IBM Plex Mono", Consolas, monospace;
    font-size: 12px;
    font-weight: 800;
  }

  .critical { color: #ff8a8a; background: rgba(239,68,68,0.12); }
  .high { color: #ffb454; background: rgba(245,158,11,0.12); }
  .medium { color: #fde047; background: rgba(234,179,8,0.12); }
  .low { color: #7dd3fc; background: rgba(14,165,233,0.12); }

  .hmw-proof {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    border-top: 1px solid rgba(255,255,255,0.1);
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .hmw-proof div {
    padding: 24px 20px;
    border-right: 1px solid rgba(255,255,255,0.1);
  }

  .hmw-proof div:last-child {
    border-right: 0;
  }

  .hmw-proof strong {
    display: block;
    font-size: 34px;
    line-height: 1;
  }

  .hmw-proof span {
    display: block;
    margin-top: 9px;
    color: #b8bec8;
    font-size: 14px;
    line-height: 1.55;
  }

  .hmw-section {
    padding: 92px 0 0;
  }

  .hmw-section-head {
    max-width: 760px;
  }

  .hmw-section h2,
  .hmw-detection-copy h2,
  .hmw-trust-copy h2,
  .hmw-process h2,
  .hmw-final h2 {
    margin: 14px 0 0;
    max-width: 820px;
    font-size: 42px;
    line-height: 1.08;
    letter-spacing: 0;
  }

  .hmw-section p,
  .hmw-detection-copy p,
  .hmw-trust-copy p,
  .hmw-final p {
    margin: 18px 0 0;
    max-width: 760px;
    color: #c7ccd4;
    font-size: 17px;
    line-height: 1.75;
  }

  .hmw-feature-list {
    margin-top: 36px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.1);
    border-radius: 18px;
    overflow: hidden;
  }

  .hmw-feature-list article {
    min-height: 250px;
    background: rgba(7,8,7,0.94);
    padding: 24px;
  }

  .hmw-feature-list svg {
    color: #00ff88;
  }

  .hmw-feature-list h3 {
    margin: 58px 0 0;
    font-size: 21px;
    line-height: 1.25;
  }

  .hmw-feature-list p {
    margin-top: 14px;
    color: #bfc5ce;
    font-size: 15px;
    line-height: 1.7;
  }

  .hmw-ai-prompts-banner-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 36px;
  }

  .hmw-ai-prompts-card {
    border: 1px solid rgba(0,255,136,0.18);
    border-radius: 28px;
    background:
      radial-gradient(circle at 10% 0%, rgba(0,255,136,0.15), transparent 25rem),
      rgba(7,8,7,0.72);
    box-shadow: 0 22px 80px rgba(0,0,0,0.34);
    padding: 34px;
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 34px;
    align-items: center;
  }

  .hmw-ai-prompts-header h2 {
    font-size: clamp(28px, 2.5vw, 36px);
    line-height: 1.15;
    margin: 14px 0 0;
    font-weight: 850;
    color: #ffffff;
  }

  .hmw-ai-prompts-header p {
    margin-top: 16px;
    color: #c7ccd4;
    font-size: 16px;
    line-height: 1.7;
  }

  .hmw-ai-badge {
    color: #00ff88;
    font-family: "IBM Plex Mono", Consolas, monospace;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.24em;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .hmw-ai-prompts-console {
    border: 1px solid rgba(0,255,136,0.22);
    background: rgba(0,0,0,0.8);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 26px 90px rgba(0,0,0,0.45);
  }

  .hmw-trust-score {
    display: grid;
    grid-template-columns: 1fr 0.82fr;
    gap: 34px;
    align-items: stretch;
  }

  .hmw-trust-copy,
  .hmw-trust-card {
    border: 1px solid rgba(0,255,136,0.18);
    border-radius: 28px;
    background:
      radial-gradient(circle at 18% 0%, rgba(0,255,136,0.15), transparent 20rem),
      rgba(7,8,7,0.72);
    box-shadow: 0 22px 80px rgba(0,0,0,0.34);
  }

  .hmw-trust-copy {
    padding: 34px;
  }

  .hmw-trust-copy > span,
  .hmw-trust-card-top span {
    color: #00ff88;
    font-family: "IBM Plex Mono", Consolas, monospace;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.24em;
    text-transform: uppercase;
  }

  .hmw-trust-verdicts {
    margin-top: 28px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 18px;
    background: rgba(255,255,255,0.1);
  }

  .hmw-trust-verdicts strong,
  .hmw-trust-verdicts span {
    display: block;
    background: rgba(0,0,0,0.62);
    padding: 15px;
  }

  .hmw-trust-verdicts strong {
    color: #00ff88;
    font-size: 19px;
  }

  .hmw-trust-verdicts span {
    color: #c7ccd4;
    font-size: 13px;
    line-height: 1.45;
  }

  .hmw-trust-card {
    padding: 28px;
  }

  .hmw-trust-card-top {
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 24px;
  }

  .hmw-trust-card-top strong {
    display: block;
    margin-top: 14px;
    font-size: clamp(54px, 7vw, 86px);
    line-height: 0.95;
  }

  .hmw-trust-card-top em {
    display: inline-flex;
    margin-top: 12px;
    border-radius: 999px;
    border: 1px solid rgba(255,180,70,0.35);
    background: rgba(255,180,70,0.12);
    padding: 8px 12px;
    color: #ffcf7a;
    font-style: normal;
    font-weight: 800;
  }

  .hmw-trust-card ul {
    list-style: none;
    margin: 22px 0 0;
    padding: 0;
  }

  .hmw-trust-card li {
    display: flex;
    align-items: center;
    gap: 10px;
    border-top: 1px solid rgba(255,255,255,0.08);
    padding: 13px 0;
    color: #dfe4ea;
    font-size: 15px;
  }

  .hmw-trust-card li:first-child {
    border-top: 0;
  }

  .hmw-trust-card li svg {
    flex: 0 0 auto;
    color: #00ff88;
  }

  .hmw-trust-footer {
    margin-top: 22px;
    border-radius: 16px;
    border: 1px solid rgba(74,158,255,0.24);
    background: rgba(74,158,255,0.09);
    padding: 15px;
    color: #cbd9ef;
    font-size: 14px;
    line-height: 1.6;
  }

  .hmw-detection {
    display: grid;
    grid-template-columns: 0.82fr 1.18fr;
    gap: 46px;
    align-items: start;
  }

  .hmw-detection-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  .hmw-detection-column {
    border-left: 1px solid rgba(0,255,136,0.35);
    padding-left: 24px;
  }

  .hmw-detection-column h3 {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 0 18px;
    font-size: 20px;
  }

  .hmw-detection-column h3 svg {
    color: #00ff88;
  }

  .hmw-detection-column ul,
  .hmw-pricing article ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .hmw-detection-column li {
    border-top: 1px solid rgba(255,255,255,0.09);
    padding: 15px 0;
    color: #d9dee5;
    font-size: 15px;
  }

  .hmw-report-column {
    border-left-color: rgba(255,255,255,0.18);
  }

  .hmw-process {
    display: grid;
    grid-template-columns: 0.7fr 1.3fr;
    gap: 48px;
    align-items: start;
  }

  .hmw-process ol {
    margin: 0;
    padding: 0;
    list-style: none;
    counter-reset: steps;
  }

  .hmw-process li {
    counter-increment: steps;
    display: grid;
    grid-template-columns: 68px 1fr;
    gap: 18px;
    border-top: 1px solid rgba(255,255,255,0.1);
    padding: 24px 0;
  }

  .hmw-process li::before {
    content: counter(steps, decimal-leading-zero);
    color: #00ff88;
    font-family: "IBM Plex Mono", Consolas, monospace;
    font-weight: 800;
    letter-spacing: 0.12em;
  }

  .hmw-process strong {
    display: block;
    grid-column: 2;
    font-size: 20px;
  }

  .hmw-process p {
    grid-column: 2;
    margin: 9px 0 0;
    color: #bfc5ce;
    font-size: 15px;
    line-height: 1.7;
  }

  .hmw-pricing-grid {
    margin-top: 36px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
  }

  .hmw-pricing article {
    display: flex;
    flex-direction: column;
    min-height: 520px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.035);
    border-radius: 18px;
    padding: 22px;
  }

  .hmw-pricing article.featured {
    border-color: rgba(0,255,136,0.55);
    background: linear-gradient(180deg, rgba(0,255,136,0.12), rgba(255,255,255,0.035));
  }

  .hmw-plan-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .hmw-plan-top h3 {
    margin: 0;
    font-size: 22px;
  }

  .hmw-plan-top span {
    border: 1px solid rgba(0,255,136,0.3);
    border-radius: 999px;
    padding: 6px 9px;
    color: #00ff88;
    font-family: "IBM Plex Mono", Consolas, monospace;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .hmw-price {
    margin-top: 26px;
  }

  .hmw-price strong {
    display: block;
    font-size: 42px;
    line-height: 1;
  }

  .hmw-price span {
    margin-top: 7px;
    color: #99a2ae;
    font-size: 14px;
  }

  .hmw-pricing article p {
    min-height: 82px;
    color: #c4cad2;
    font-size: 15px;
    line-height: 1.65;
  }

  .hmw-pricing article ul {
    display: grid;
    gap: 13px;
    margin: 10px 0 26px;
  }

  .hmw-pricing article li {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    color: #d8dde4;
    font-size: 14px;
    line-height: 1.5;
  }

  .hmw-pricing article li svg {
    color: #00ff88;
    flex: 0 0 auto;
    margin-top: 2px;
  }

  .hmw-pricing article .hmw-button {
    margin-top: auto;
    width: 100%;
  }

  .hmw-final {
    display: grid;
    grid-template-columns: 0.8fr 1.2fr;
    gap: 26px;
    align-items: center;
    margin-top: 92px;
    text-align: left;
    border: 1px solid rgba(0,255,136,0.22);
    background: rgba(0,255,136,0.07);
    border-radius: 22px;
    padding: 48px 28px;
  }

  .hmw-final svg {
    color: #00ff88;
  }

  .hmw-waitlist-card {
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(0,0,0,0.36);
    border-radius: 20px;
    padding: 24px;
  }

  .hmw-waitlist-card span {
    display: block;
    color: #00ff88;
    font-family: "IBM Plex Mono", Consolas, monospace;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .hmw-waitlist-card h3 {
    margin: 16px 0 0;
    font-size: 24px;
    line-height: 1.2;
  }

  .hmw-waitlist-card p {
    margin: 14px 0 0;
    color: #c7ccd4;
    font-size: 15px;
    line-height: 1.7;
  }

  .hmw-final h2,
  .hmw-final p {
    margin-left: 0;
    margin-right: 0;
  }

  .hmw-footer {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 24px;
    align-items: center;
    margin-top: 72px;
    border-top: 1px solid rgba(255,255,255,0.1);
    padding: 30px 0 12px;
  }

  .hmw-footer strong {
    color: #00ff88;
    font-family: "IBM Plex Mono", Consolas, monospace;
    font-size: 12px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .hmw-footer p {
    margin: 9px 0 0;
    max-width: 560px;
    color: #aab1bc;
    font-size: 14px;
    line-height: 1.6;
  }

  .hmw-footer nav {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 14px;
  }

  @media (max-width: 1050px) {
    .hmw-header {
      grid-template-columns: 1fr auto;
    }

    .hmw-nav {
      grid-column: 1 / -1;
      justify-content: flex-start;
      overflow-x: auto;
      padding-top: 4px;
    }

    .hmw-console-body,
    .hmw-detection,
    .hmw-trust-score,
    .hmw-ai-prompts-card,
    .hmw-process {
      grid-template-columns: 1fr;
    }

    .hmw-hero {
      grid-template-columns: 1fr;
    }

    .hmw-hero-copy {
      max-width: 820px;
    }

    .hmw-hero-image {
      max-width: 680px;
      margin-left: 0;
    }

    .hmw-hero-visual {
      transform: none;
    }

    .hmw-console {
      position: relative;
      left: auto;
      right: auto;
      bottom: auto;
      margin-top: -110px;
      max-width: 650px;
    }

    .hmw-pricing-grid,
    .hmw-feature-list {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .hmw-trust-verdicts {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 720px) {
    .hmw-page {
      padding: 14px;
    }

    .hmw-header,
    .hmw-hero,
    .hmw-proof,
    .hmw-section,
    .hmw-final,
    .hmw-footer {
      width: 100%;
      max-width: calc(100vw - 28px);
    }

    .hmw-header {
      position: static;
      grid-template-columns: 1fr;
      align-items: stretch;
      max-width: 100%;
    }

    .hmw-nav {
      justify-content: flex-start;
    }

    .hmw-header .hmw-button {
      width: 100%;
    }

    .hmw-hero {
      padding-top: 58px;
      max-width: 100%;
      gap: 32px;
    }

    .hmw-hero h1 {
      max-width: 340px;
      font-size: clamp(30px, 8vw, 35px);
      line-height: 1.03;
      text-wrap: pretty;
      overflow-wrap: break-word;
    }

    .hmw-hero p {
      max-width: 340px;
      font-size: 16px;
      line-height: 1.58;
      overflow-wrap: break-word;
    }

    .hmw-hero-notes {
      max-width: 100%;
      grid-template-columns: 1fr;
    }

    .hmw-hero-notes span {
      min-height: auto;
      border-right: 0;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .hmw-hero-notes span:last-child {
      border-bottom: 0;
    }

    .hmw-hero-image {
      max-width: 100%;
    }

    .hmw-console {
      margin-top: -54px;
    }

    .hmw-console,
    .hmw-proof,
    .hmw-section,
    .hmw-final,
    .hmw-footer {
      max-width: 100%;
    }

    .hmw-console-body,
    .hmw-proof,
    .hmw-detection-grid,
    .hmw-trust-verdicts,
    .hmw-pricing-grid,
    .hmw-feature-list,
    .hmw-final,
    .hmw-footer {
      grid-template-columns: 1fr;
    }

    .hmw-console-title,
    .hmw-scan-lines span,
    .hmw-hero-notes span {
      overflow-wrap: anywhere;
    }

    .hmw-proof div {
      border-right: 0;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .hmw-proof div:last-child {
      border-bottom: 0;
    }

    .hmw-section {
      padding-top: 68px;
    }

    .hmw-section h2,
    .hmw-detection-copy h2,
    .hmw-trust-copy h2,
    .hmw-process h2,
    .hmw-final h2 {
      font-size: 34px;
    }

    .hmw-trust-copy,
    .hmw-trust-card {
      padding: 22px;
    }

    .hmw-pricing article {
      min-height: auto;
    }

    .hmw-footer,
    .hmw-footer nav {
      text-align: center;
      justify-content: center;
    }
  }

  @media (max-width: 430px) {
    .hmw-page {
      padding: 14px;
    }

    .hmw-header {
      padding: 14px;
    }

    .hmw-brand {
      align-items: flex-start;
    }

    .hmw-brand-title {
      letter-spacing: 0.16em;
    }

    .hmw-nav {
      gap: 16px;
      padding-bottom: 2px;
    }

    .hmw-actions {
      display: grid;
      grid-template-columns: 1fr;
    }

    .hmw-console-body {
      padding: 16px;
    }

    .hmw-console {
      margin-top: 18px;
    }

    .hmw-severity {
      grid-template-columns: 1fr;
    }
  }
`;
