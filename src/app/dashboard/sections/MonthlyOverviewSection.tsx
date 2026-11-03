import { TrendingUp } from "lucide-react";
import { OccupancyChart, PanelHeader, RevenueChart } from "../components";
import type { MonthlyMetric } from "../data";
import styles from "../dashboard.module.css";

interface MonthlyOverviewSectionProps {
  months: MonthlyMetric[];
  reportMonths: number;
  onReportMonthsChange: (months: number) => void;
  rangeLabel: string;
}

export default function MonthlyOverviewSection({
  months,
  reportMonths,
  onReportMonthsChange,
  rangeLabel,
}: MonthlyOverviewSectionProps) {
  return (
    <section className={`${styles.dashboardGrid} ${styles.dashboardGridEqual}`} aria-label="Rapports mensuels">
      <article className={styles.panel}>
        <PanelHeader
          title="Taux d’occupation"
          subtitle="Évolution mensuelle · 2026"
          action={
            <select
              className={styles.selectControl}
              value={reportMonths}
              onChange={(event) => onReportMonthsChange(Number(event.target.value))}
              aria-label="Période du rapport"
            >
              <option value={3}>3 derniers mois</option>
              <option value={6}>6 derniers mois</option>
              <option value={12}>Cette année</option>
            </select>
          }
        />
        <OccupancyChart months={months} />
        <p className={styles.reportNote}>
          <TrendingUp size={13} /> Taux d’occupation dynamique calculé sur le parc opérationnel.
        </p>
      </article>
      <article className={styles.panel}>
        <PanelHeader title="Revenus mensuels" subtitle={`Répartition par activité · ${rangeLabel}`} />
        <RevenueChart months={months} />
      </article>
    </section>
  );
}
