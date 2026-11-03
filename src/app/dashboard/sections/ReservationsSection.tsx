import { Search } from "lucide-react";
import { EmptyState, Pagination, PanelHeader, ReservationRow } from "../components";
import type { Reservation, ReservationStatus } from "../data";
import styles from "../dashboard.module.css";

const statusOptions: { value: "all" | ReservationStatus; label: string }[] = [
  { value: "all", label: "Tous les statuts" },
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmée" },
  { value: "cancelled", label: "Annulée" },
  { value: "completed", label: "Terminée" },
];

interface ReservationsSectionProps {
  reservations: Reservation[];
  totalCount: number;
  page: number;
  pageCount: number;
  search: string;
  status: "all" | ReservationStatus;
  getGuestName: (clientId: number) => string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: "all" | ReservationStatus) => void;
  onPageChange: (page: number) => void;
  onSelectReservation: (reservationId: number) => void;
}

export default function ReservationsSection({
  reservations,
  totalCount,
  page,
  pageCount,
  search,
  status,
  getGuestName,
  onSearchChange,
  onStatusChange,
  onPageChange,
  onSelectReservation,
}: ReservationsSectionProps) {
  return (
    <>
      <section className={styles.sectionHeading} id="reservations">
        <div>
          <h2>Réservations récentes</h2>
          <p>Consultez les séjours, les clients et les statuts de réservation.</p>
        </div>
      </section>
      <section className={styles.panel} aria-label="Liste des réservations">
        <PanelHeader
          title="Toutes les réservations"
          subtitle={`${totalCount} séjours dans les données`}
          action={
            <div className={styles.tableControls}>
              <label className={styles.searchBox}>
                <Search size={15} />
                <span className={styles.srOnly}>Rechercher une réservation</span>
                <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Client, chambre, n°…" />
              </label>
              <label>
                <span className={styles.srOnly}>Filtrer les réservations par statut</span>
                <select
                  className={styles.selectControl}
                  value={status}
                  onChange={(event) => onStatusChange(event.target.value as "all" | ReservationStatus)}
                >
                  {statusOptions.map((option) => (
                    <option value={option.value} key={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          }
        />
        {reservations.length ? (
          <>
            <div className={styles.tableScroller}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Réservation</th><th>Client</th><th>Arrivée</th><th>Départ</th><th>Chambre</th><th>Statut</th>
                    <th className={styles.numericCell}>Montant</th><th><span className={styles.srOnly}>Détails</span></th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <ReservationRow
                      key={reservation.reservation_id}
                      reservation={reservation}
                      guestName={getGuestName(reservation.client_id)}
                      onSelect={() => onSelectReservation(reservation.reservation_id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} pageCount={pageCount} count={totalCount} onChange={onPageChange} />
          </>
        ) : (
          <EmptyState title="Aucune réservation trouvée" detail="Modifiez votre recherche ou le filtre de statut." />
        )}
      </section>
    </>
  );
}
