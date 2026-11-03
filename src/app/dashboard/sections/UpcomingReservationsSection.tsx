import { CalendarDays, LogOut } from "lucide-react";
import { EmptyState, formatShortDate, PanelHeader, StatusBadge } from "../components";
import type { Reservation } from "../data";
import styles from "../dashboard.module.css";

interface UpcomingReservationsSectionProps {
  arrivals: Reservation[];
  departures: Reservation[];
  getGuestName: (clientId: number) => string;
  onSelectReservation: (reservationId: number) => void;
}

export default function UpcomingReservationsSection({
  arrivals,
  departures,
  getGuestName,
  onSelectReservation,
}: UpcomingReservationsSectionProps) {
  return (
    <section className={styles.splitTables} aria-label="Arrivées et départs à venir">
      {[
        {
          title: "Prochaines arrivées",
          subtitle: "Séjours à préparer",
          emptyTitle: "Aucune arrivée prévue",
          emptyDetail: "Aucun séjour n’est prévu pour les jours à venir.",
          date: (reservation: Reservation) => reservation.check_in_date,
          reservations: arrivals,
          Icon: CalendarDays,
        },
        {
          title: "Prochains départs",
          subtitle: "Départs à coordonner",
          emptyTitle: "Aucun départ prévu",
          emptyDetail: "Aucun départ n’est prévu pour les jours à venir.",
          date: (reservation: Reservation) => reservation.check_out_date,
          reservations: departures,
          Icon: LogOut,
        },
      ].map(({ title, subtitle, emptyTitle, emptyDetail, date, reservations, Icon }) => (
        <article className={styles.panel} key={title}>
          <PanelHeader
            title={title}
            subtitle={subtitle}
            action={<span className={styles.subtleLink}>{reservations.length} à venir</span>}
          />
          <div className={styles.miniList}>
            {reservations.map((reservation) => (
              <div className={styles.miniRow} key={reservation.reservation_id}>
                <div className={styles.miniMain}>
                  <span className={styles.miniIcon}>
                    <Icon size={15} />
                  </span>
                  <div>
                    <button className={styles.textButton} onClick={() => onSelectReservation(reservation.reservation_id)}>
                      {getGuestName(reservation.client_id)}
                    </button>
                    <span>
                      Ch. {reservation.rooms.map((room) => room.room_number).join(", ")} · {reservation.num_guests} pers.
                    </span>
                  </div>
                </div>
                <div className={styles.miniMeta}>
                  <strong>{formatShortDate(date(reservation))}</strong>
                  <StatusBadge status={reservation.status} />
                </div>
              </div>
            ))}
            {!reservations.length && (
              <EmptyState title={emptyTitle} detail={emptyDetail} />
            )}
          </div>
        </article>
      ))}
    </section>
  );
}
