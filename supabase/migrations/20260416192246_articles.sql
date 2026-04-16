-- Categories
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  created_at timestamptz default now()
);

-- Articles
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  content text not null,
  cover_image text not null,
  category_id uuid references public.categories(id) on delete set null,
  author text not null default 'CryptoUptrend Editorial',
  read_minutes int not null default 4,
  is_featured boolean not null default false,
  published_at timestamptz not null default now(),
  created_at timestamptz default now()
);

create index articles_category_idx on public.articles(category_id);
create index articles_published_idx on public.articles(published_at desc);

alter table public.categories enable row level security;
alter table public.articles enable row level security;

create policy "categories public read" on public.categories for select using (true);
create policy "articles public read" on public.articles for select using (true);

-- Seed categories (matching nav exactly)
insert into public.categories (slug, name, description) values
  ('bitcoin-news', 'Bitcoin News', 'Latest Bitcoin headlines, market moves, and on-chain insights.'),
  ('ai-web3', 'AI & Web3', 'Where artificial intelligence meets decentralized infrastructure.'),
  ('altcoin-updates', 'Altcoin Updates', 'Ethereum, Solana, and the rest of the altcoin universe.'),
  ('price-predictions', 'Price Predictions', 'Analyst forecasts, technical setups, and market outlooks.');

-- Seed articles
with cats as (
  select id, slug from public.categories
)
insert into public.articles (slug, title, excerpt, content, cover_image, category_id, author, read_minutes, is_featured)
select * from (values
  ('bitcoin-reclaims-key-resistance-as-etf-inflows-surge',
   'Bitcoin Reclaims Key Resistance as ETF Inflows Surge',
   'Spot Bitcoin ETFs absorbed over $1.2B in net inflows last week, pushing BTC back above a critical technical level.',
   E'Bitcoin has reclaimed a critical resistance level following a sharp uptick in spot ETF demand, with institutional flows accelerating into the close of the trading week.\n\nAccording to data aggregated across the eleven approved spot Bitcoin ETF products, net inflows topped $1.2 billion over the past five sessions — the strongest weekly print since the post-halving rally earlier this year. BlackRock''s IBIT once again led the pack, accounting for nearly half of total flows.\n\nAnalysts point to a confluence of macro factors: cooling US inflation data, dovish commentary from Federal Reserve officials, and growing expectations that allocators are rotating out of cash and into hard assets ahead of year-end.\n\n"This is what sustained institutional adoption looks like," said one trader at a major prime brokerage. "It''s no longer a story about retail FOMO."\n\nOn-chain metrics support the bullish narrative. Long-term holder supply hit a fresh all-time high, while exchange reserves continued their multi-month decline.',
   'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&q=80',
   (select id from cats where slug='bitcoin-news'), 'Marcus Chen', 5, true),

  ('ethereum-pectra-upgrade-what-changes-for-stakers',
   'Ethereum''s Pectra Upgrade: What Changes for Stakers',
   'The next major Ethereum hard fork bundles eleven EIPs that reshape validator economics and account abstraction.',
   E'Ethereum''s upcoming Pectra upgrade represents the most significant protocol change since the Merge, bundling improvements to validator operations, account abstraction, and data availability.\n\nKey changes include EIP-7251, which raises the maximum effective balance for validators from 32 to 2,048 ETH, dramatically simplifying operations for large staking providers. EIP-7702 introduces native account abstraction primitives, allowing externally owned accounts to behave like smart contract wallets on a per-transaction basis.\n\nFor solo stakers, the changes are largely positive: faster withdrawal processing, more flexible balance management, and improved reward distribution. Liquid staking protocols are expected to benefit most from the consolidation of validator slots.',
   'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80',
   (select id from cats where slug='altcoin-updates'), 'Priya Nair', 6, true),

  ('ai-agents-on-chain-the-rise-of-autonomous-defi',
   'AI Agents On-Chain: The Rise of Autonomous DeFi',
   'A new wave of protocols is letting language models execute trades, manage liquidity, and govern treasuries autonomously.',
   E'The convergence of large language models and decentralized finance is producing an entirely new category of on-chain primitives: autonomous AI agents with their own wallets, strategies, and governance rights.\n\nProjects spanning multiple chains have launched frameworks where AI agents can hold assets, execute strategies, and even participate in DAO voting. Early experiments include market-making bots that adjust spreads based on volatility forecasts, treasury managers that rebalance reserves across yield sources, and content moderation agents for decentralized social platforms.\n\nThe technical architecture typically combines a hosted LLM with on-chain attestation, ensuring that agent decisions are auditable and reversible. Critics warn that the same autonomy that makes these agents powerful could become catastrophic in adversarial conditions.',
   'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80',
   (select id from cats where slug='ai-web3'), 'Damon Wright', 7, true),

  ('solana-hits-new-developer-activity-high',
   'Solana Hits New Developer Activity High',
   'Monthly active developers on Solana have crossed a new threshold, narrowing the gap with Ethereum''s ecosystem.',
   E'Solana''s developer ecosystem continues to expand at a remarkable pace, with monthly active contributors hitting a new all-time high according to a closely watched developer report.\n\nThe network now ranks second only to Ethereum in total developer activity, with particularly strong growth in DePIN, consumer applications, and on-chain games. The Solana Foundation''s ongoing hackathon program has been credited with bringing thousands of new builders into the ecosystem.\n\nNotable launches in the past quarter include several high-throughput trading venues, a wave of mobile-first wallets, and the long-awaited Firedancer validator client which entered mainnet testing.',
   'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=1200&q=80',
   (select id from cats where slug='altcoin-updates'), 'Elena Sokolova', 4, false),

  ('btc-price-prediction-q1-2026-analysts-divided',
   'BTC Price Prediction Q1 2026: Analysts Divided',
   'Wall Street strategists offer wildly different targets for Bitcoin in the first quarter of 2026, ranging from $95k to $185k.',
   E'Bitcoin price forecasts for the first quarter of 2026 are diverging more than at any point in the last cycle, with reputable analysts publishing targets that span nearly 100% in either direction.\n\nThe bull case rests on three pillars: continued ETF accumulation, a weakening US dollar, and the ongoing supply shock from the April halving. Analysts in this camp point to historical post-halving patterns and argue that institutional demand is structurally different from previous cycles.\n\nThe bear case emphasizes overheated derivatives markets, concentration risk in a handful of large holders, and the possibility that macro conditions sour faster than expected.\n\nMost retail-facing analysts remain in the middle, with consensus targets clustering around $130,000 by end of Q1.',
   'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=1200&q=80',
   (select id from cats where slug='price-predictions'), 'Jordan Hale', 8, false),

  ('stablecoins-cross-200b-supply-milestone',
   'Stablecoins Cross $200B Supply Milestone',
   'Total stablecoin market cap has crossed a historic threshold, driven by Treasury-backed tokens and emerging market demand.',
   E'The total supply of stablecoins has surpassed $200 billion for the first time, marking a milestone for what has become one of crypto''s most important product categories.\n\nUSDT and USDC continue to dominate, but the fastest growth has come from yield-bearing alternatives backed by short-term US Treasuries. Tokenized money market funds from major asset managers have crossed $5 billion in TVL, suggesting institutional appetite for on-chain dollar exposure is just beginning.\n\nEmerging markets remain a key driver. In Argentina, Turkey, and Nigeria, stablecoins are increasingly used as a savings instrument and a medium of exchange — often outpacing local banking infrastructure.',
   'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200&q=80',
   (select id from cats where slug='bitcoin-news'), 'Sofia Reyes', 5, false),

  ('layer-2-wars-base-vs-arbitrum-vs-optimism',
   'Layer 2 Wars: Base vs Arbitrum vs Optimism',
   'The competitive landscape among Ethereum Layer 2s has reshuffled, with Base posting eye-watering growth metrics.',
   E'The competitive dynamics among Ethereum Layer 2 networks have shifted dramatically over the past six months, with Coinbase''s Base now leading on several key metrics.\n\nBase has captured the lion''s share of consumer onchain activity, particularly in social and creator economy applications. Arbitrum continues to dominate in DeFi TVL, while Optimism remains the home of the OP Stack and its growing roster of "Superchain" partners.\n\nFor users, the practical differences are increasingly cosmetic. Bridging is faster, fees are lower, and most major dApps are deployed across all three networks.',
   'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1200&q=80',
   (select id from cats where slug='altcoin-updates'), 'Marcus Chen', 6, false),

  ('ai-tokens-rally-as-compute-demand-explodes',
   'AI Tokens Rally as Compute Demand Explodes',
   'Decentralized GPU networks and AI infrastructure tokens have outperformed the broader market amid surging demand for compute.',
   E'AI-focused crypto tokens have led the market higher in recent weeks, as decentralized compute networks report exploding demand from both Web3 and traditional AI customers.\n\nProtocols offering distributed GPU infrastructure have seen utilization rates above 90%, prompting fresh capacity expansion and waitlists for premium hardware. Token holders benefit through fee burn mechanisms, staking rewards, and governance over network parameters.\n\nThe sector now commands a combined market cap of over $40 billion, up significantly from the start of the year. Skeptics warn the rally has gotten ahead of fundamentals, but proponents argue that real revenue is finally flowing through these networks.',
   'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
   (select id from cats where slug='ai-web3'), 'Damon Wright', 5, false),

  ('ethereum-price-prediction-can-eth-reclaim-5k',
   'Ethereum Price Prediction: Can ETH Reclaim $5K?',
   'With staking yields stabilizing and L2 fees eating into mainnet revenue, can ETH still hit a new all-time high?',
   E'Ethereum''s path to a new all-time high is more nuanced than it was in previous cycles. The network''s economic model has evolved substantially, and the rise of Layer 2 networks has changed how value accrues to ETH the asset.\n\nBulls point to spot ETF inflows, the structural deflationary mechanics of EIP-1559, and the reflexive demand from a growing on-chain economy. Bears highlight that L2 activity, while great for users, reduces direct mainnet fee burn.\n\nMost models converge on a $5,000-$6,500 range for the next major cycle peak, contingent on Bitcoin sustaining its uptrend and risk appetite remaining strong.',
   'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=1200&q=80',
   (select id from cats where slug='price-predictions'), 'Priya Nair', 7, false)
) as v(slug, title, excerpt, content, cover_image, category_id, author, read_minutes, is_featured);
