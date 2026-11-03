import { EmptyState, formatShortDate, formatXaf, PanelHeader, StatusBadge } from "../components";
import type { DashboardData, ServiceBooking } from "../data";
import styles from "../dashboard.module.css";

interface ServicesSectionProps {
  data: DashboardData;
  bookings: ServiceBooking[];
  getGuestName: (clientId: number) => string;
}

export default function ServicesSection({ data, bookings, getGuestName }: ServicesSectionProps) {
  return (
    <>
      <section className={styles.sectionHeading} id="services">
        <div><h2>Services</h2><p>Prestations proposées et réservées par vos clients (BR-11, BR-12).</p></div>
      </section>
      <section className={styles.panel} aria-label="Services réservés">
        <PanelHeader title="Activité des services" subtitle={`${bookings.length} prestations réservées`} />
        {bookings.length ? (
          <div className={styles.tableScroller}>
            <table className={styles.dataTable}>
              <thead><tr><th>Prestation</th><th>Catégorie</th><th>Client</th><th>Date</th><th>Quantité</th><th>Statut</th><th className={styles.numericCell}>Total</th></tr></thead>
              <tbody>{bookings.map((booking) => {
                const service = data.services.find((item) => item.service_id === booking.service_id);
                const reservation = data.reservations.find((item) => item.reservation_id === booking.reservation_id);
                return (
                  <tr key={booking.booking_id}>
                    <td><span className={styles.guestName}>{service?.service_name ?? "Service"}</span></td>
                    <td><span className={styles.serviceCategory}><span />{service?.category ?? "Autre"}</span></td>
                    <td>{reservation ? getGuestName(reservation.client_id) : "Client inconnu"}</td>
                    <td>{formatShortDate(booking.booking_date)}</td><td>{booking.quantity}</td>
                    <td><StatusBadge status={booking.status === "completed" ? "completed" : "confirmed"} /></td>
                    <td className={styles.numericCell}>{formatXaf((service?.unit_price ?? 0) * booking.quantity)}</td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        ) : <EmptyState title="Aucun service réservé" detail="Les prestations apparaîtront ici." />}
      </section>
    </>
  );
}
