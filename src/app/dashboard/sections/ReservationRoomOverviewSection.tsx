import { PanelHeader, ReservationStatusChart, RoomStatusCard } from "../components";
import type { ReservationStatus } from "../data";
import styles from "../dashboard.module.css";

interface ReservationRoomOverviewSectionProps {
  roomCount: number;
  reservationStatusCounts: Record<ReservationStatus, number>;
  roomsByStatus: {
    available: number[];
    occupied: number[];
    being_cleaned: number[];
    out_of_service: number[];
  };
}

export default function ReservationRoomOverviewSection({
  roomCount,
  reservationStatusCounts,
  roomsByStatus,
}: ReservationRoomOverviewSectionProps) {
  return (
    <section className={`${styles.dashboardGrid} ${styles.dashboardGridEqual}`} aria-label="Réservations et état des chambres">
      <article className={styles.panel}>
        <PanelHeader title="Statut des réservations" subtitle="Répartition des séjours enregistrés" />
        <ReservationStatusChart values={reservationStatusCounts} />
      </article>
      <article className={styles.panel}>
        <PanelHeader
          title="État des chambres"
          subtitle={`${roomCount} chambres au total`}
          action={
            <a href="#rooms" className={styles.subtleLink}>
              Voir les chambres
            </a>
          }
        />
        <div className={styles.roomGrid}>
          {(["available", "occupied", "being_cleaned", "out_of_service"] as const).map((status) => (
            <RoomStatusCard
              key={status}
              status={status}
              count={roomsByStatus[status].length}
              total={roomCount}
              rooms={roomsByStatus[status]}
            />
          ))}
        </div>
      </article>
    </section>
  );
}
