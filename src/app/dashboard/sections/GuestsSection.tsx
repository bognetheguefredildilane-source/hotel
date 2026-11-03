import { Search } from "lucide-react";
import { EmptyState, Pagination, PanelHeader } from "../components";
import type { DashboardData, Guest } from "../data";
import styles from "../dashboard.module.css";

interface GuestsSectionProps {
  data: DashboardData;
  guests: Guest[];
  totalCount: number;
  page: number;
  pageCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
}

export default function GuestsSection({
  data, guests, totalCount, page, pageCount, search, onSearchChange, onPageChange,
}: GuestsSectionProps) {
  return (
    <>
      <section className={styles.sectionHeading} id="guests">
        <div><h2>Clients</h2><p>Coordonnées des clients enregistrés dans la base MySQL (BR-09, BR-10).</p></div>
      </section>
      <section className={styles.panel} aria-label="Liste des clients">
        <PanelHeader
          title="Répertoire clients"
          subtitle={`${totalCount} clients`}
          action={
            <label className={styles.searchBox}>
              <Search size={15} /><span className={styles.srOnly}>Rechercher un client</span>
              <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Nom, e-mail, téléphone…" />
            </label>
          }
        />
        {guests.length ? (
          <>
            <div className={styles.tableScroller}>
              <table className={styles.dataTable}>
                <thead><tr><th>Client</th><th>E-mail</th><th>Téléphone</th><th>Séjours enregistrés</th></tr></thead>
                <tbody>{guests.map((guest) => (
                  <tr key={guest.client_id}>
                    <td><span className={styles.guestName}>{guest.first_name} {guest.last_name}</span></td>
                    <td>{guest.email}</td><td>{guest.phone_number}</td>
                    <td>{data.reservations.filter((reservation) => reservation.client_id === guest.client_id).length}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <Pagination page={page} pageCount={pageCount} count={totalCount} onChange={onPageChange} />
          </>
        ) : <EmptyState title="Aucun client trouvé" detail="Vérifiez votre recherche et réessayez." />}
      </section>
    </>
  );
}
