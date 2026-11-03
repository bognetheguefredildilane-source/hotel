import { Clock3, Printer } from "lucide-react";
import { OccupancyChart, PanelHeader, RevenueChart } from "../components";
import type { MonthlyMetric } from "../data";
import styles from "../dashboard.module.css";

interface ReportsSectionProps {
  months: MonthlyMetric[];
  reportMonths: number;
  rangeLabel: string;
  onReportMonthsChange: (months: number) => void;
}

export default function ReportsSection({ months, reportMonths, rangeLabel, onReportMonthsChange }: ReportsSectionProps) {
  return (
    <>
      <section className={styles.sectionHeading} id="reports">
        <div><h2>Rapports et revenus</h2><p>Suivi des performances par période, en XAF.</p></div>
        <div className={styles.reportControls}>
          <label>
            <span className={styles.srOnly}>Période du rapport</span>
            <select className={styles.selectControl} value={reportMonths} onChange={(event) => onReportMonthsChange(Number(event.target.value))}>
              <option value={3}>3 derniers mois</option><option value={6}>6 derniers mois</option><option value={12}>Cette année</option>
            </select>
          </label>
          <button className={styles.primaryButton} onClick={() => window.print()}><Printer size={14} /> Imprimer</button>
        </div>
      </section>
      <section className={`${styles.dashboardGrid} ${styles.dashboardGridEqual}`} aria-label="Graphiques des rapports">
        <article className={styles.panel}>
          <PanelHeader title="Occupation mensuelle" subtitle={`Taux d’occupation · ${rangeLabel}`} />
          <OccupancyChart months={months} />
        </article>
        <article className={styles.panel}>
          <PanelHeader title="Revenus mensuels" subtitle={`Hébergement, services et divers · ${rangeLabel}`} />
          <RevenueChart months={months} />
        </article>
      </section>
     
    </>
  );
}
