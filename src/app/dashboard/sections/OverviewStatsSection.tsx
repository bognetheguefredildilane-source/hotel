import { BedDouble, CalendarCheck, LogOut, Users, Wallet } from "lucide-react";
import { StatCard, formatXaf } from "../components";
import styles from "../dashboard.module.css";

interface OverviewStatsSectionProps {
  roomCount: number;
  occupiedCount: number;
  availableCount: number;
  cleaningCount: number;
  arrivalsToday: number;
  departuresToday: number;
  todayLabel: string;
  outstandingBalance: number;
  unpaidInvoiceCount: number;
}

export default function OverviewStatsSection({
  roomCount,
  occupiedCount,
  availableCount,
  cleaningCount,
  arrivalsToday,
  departuresToday,
  todayLabel,
  outstandingBalance,
  unpaidInvoiceCount,
}: OverviewStatsSectionProps) {
  return (
    <section aria-label="Indicateurs clés">
      <div className={styles.statsGrid}>
        <StatCard label="Total des chambres" value={String(roomCount)} note="Inventaire de l’établissement" icon={BedDouble} tone="blue" />
        <StatCard
          label="Chambres occupées"
          value={`${occupiedCount} / ${roomCount}`}
          note={`${Math.round((occupiedCount / roomCount) * 100)}% du parc actif`}
          icon={Users}
          tone="green"
        />
        <StatCard
          label="Chambres disponibles"
          value={String(availableCount)}
          note={`${cleaningCount} en cours de nettoyage`}
          icon={BedDouble}
          tone="green"
        />
        <StatCard label="Arrivées du jour" value={String(arrivalsToday)} note={todayLabel} icon={CalendarCheck} tone="blue" />
        <StatCard label="Départs du jour" value={String(departuresToday)} note="Départs à préparer" icon={LogOut} tone="amber" />
        <StatCard
          label="Solde des factures"
          value={formatXaf(outstandingBalance)}
          note={`${unpaidInvoiceCount} factures à suivre`}
          icon={Wallet}
          tone="amber"
        />
      </div>
    </section>
  );
}
