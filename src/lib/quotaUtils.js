import { base44 } from "@/api/base44Client";

export const QUOTAS_BY_PLAN = {
  free: {
    text: { day: 300, week: 300, month: 300 },
    image: { day: 0, week: 0, month: 0 },
    audio: { day: 0, week: 0, month: 0 }
  },
  starter: {
    text: { day: 0, week: 0, month: 10000 },
    image: { day: 2, week: 8, month: 30 },
    audio: { day: 1, week: 4, month: 15 }
  },
  premium: {
    text: { day: 0, week: 0, month: 15000 },
    image: { day: 4, week: 15, month: 50 },
    audio: { day: 2, week: 8, month: 25 }
  },
  team: {
    text: { day: 0, week: 0, month: 20000 },
    image: { day: 8, week: 30, month: 100 },
    audio: { day: 4, week: 15, month: 40 }
  },
  startup: {
    text: { day: 0, week: 0, month: 25000 },
    image: { day: 12, week: 45, month: 150 },
    audio: { day: 6, week: 22, month: 60 }
  },
  enterprise: {
    text: { day: 0, week: 0, month: 40000 },
    image: "unlimited",
    audio: "unlimited"
  }
};

let usageCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 30000;

export async function getUsageCounts() {
  const now = Date.now();
  if (usageCache && (now - cacheTimestamp) < CACHE_TTL) {
    return usageCache;
  }

  try {
    const records = await base44.entities.TokenUsage.list();
    const date = new Date();
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const startOfWeek = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);

    const counts = {};
    records.forEach((r) => {
      if (!r.model) return;
      if (!counts[r.model]) counts[r.model] = { day: 0, week: 0, month: 0, total: 0 };
      const d = new Date(r.created_date);
      counts[r.model].total++;
      if (d >= startOfDay) counts[r.model].day++;
      if (d >= startOfWeek) counts[r.model].week++;
      if (d >= startOfMonth) counts[r.model].month++;
    });

    usageCache = counts;
    cacheTimestamp = now;
    return counts;
  } catch (err) {
    console.error("Erro ao carregar uso:", err);
    return {};
  }
}

export function invalidateUsageCache() {
  usageCache = null;
  cacheTimestamp = 0;
}

export async function checkModelQuota(plan, modelName, category) {
  const quotas = QUOTAS_BY_PLAN[plan] || QUOTAS_BY_PLAN.free;
  const categoryQuota = quotas[category];

  if (categoryQuota === "unlimited") {
    return { exceeded: false, unlimited: true };
  }

  if (!categoryQuota || (categoryQuota.day === 0 && categoryQuota.week === 0 && categoryQuota.month === 0)) {
    return { exceeded: true, notIncluded: true, limit: 0, consumed: 0 };
  }

  const counts = await getUsageCounts();
  const usage = counts[modelName] || { day: 0, week: 0, month: 0 };

  if (categoryQuota.day > 0 && usage.day >= categoryQuota.day) {
    return { exceeded: true, period: "day", consumed: usage.day, limit: categoryQuota.day };
  }
  if (categoryQuota.week > 0 && usage.week >= categoryQuota.week) {
    return { exceeded: true, period: "week", consumed: usage.week, limit: categoryQuota.week };
  }
  if (categoryQuota.month > 0 && usage.month >= categoryQuota.month) {
    return { exceeded: true, period: "month", consumed: usage.month, limit: categoryQuota.month };
  }

  return { exceeded: false };
}