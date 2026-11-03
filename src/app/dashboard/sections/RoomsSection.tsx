import { EmptyState, formatXaf, Pagination, PanelHeader, StatusBadge } from "../components";
import type { Room, RoomStatus, RoomType } from "../data";
import styles from "../dashboard.module.css";

const roomTypeOptions: { value: "all" | RoomType; label: string }[] = [
  { value: "all", label: "Tous les types" }, { value: "simple", label: "Simple" },
  { value: "double", label: "Double" }, { value: "suite", label: "Suite" },
  { value: "familiale", label: "Familiale" },
];
const roomStatusOptions: { value: "all" | RoomStatus; label: string }[] = [
  { value: "all", label: "Tous les statuts" }, { value: "available", label: "Disponible" },
  { value: "occupied", label: "Occupée" }, { value: "being_cleaned", label: "Nettoyage" },
  { value: "out_of_service", label: "Hors service" },
];

interface RoomsSectionProps {
  rooms: Room[];
  totalCount: number;
  page: number;
  pageCount: number;
  type: "all" | RoomType;
  status: "all" | RoomStatus;
  onTypeChange: (value: "all" | RoomType) => void;
  onStatusChange: (value: "all" | RoomStatus) => void;
  onPageChange: (page: number) => void;
}

export default function RoomsSection({
  rooms, totalCount, page, pageCount, type, status, onTypeChange, onStatusChange, onPageChange,
}: RoomsSectionProps) {
  return (
    <>
      <section className={styles.sectionHeading} id="rooms">
        <div><h2>Chambres</h2><p>Inventaire et état opérationnel des chambres de l’établissement.</p></div>
      </section>
      <section className={styles.panel} aria-label="Liste des chambres">
        <PanelHeader
          title="Inventaire des chambres"
          subtitle={`${totalCount} chambres correspondent aux filtres`}
          action={
            <div className={styles.roomFilterRow}>
              <label><span className={styles.srOnly}>Filtrer par type de chambre</span>
                <select className={styles.selectControl} value={type} onChange={(event) => onTypeChange(event.target.value as "all" | RoomType)}>
                  {roomTypeOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
                </select>
              </label>
              <label><span className={styles.srOnly}>Filtrer par statut de chambre</span>
                <select className={styles.selectControl} value={status} onChange={(event) => onStatusChange(event.target.value as "all" | RoomStatus)}>
                  {roomStatusOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
                </select>
              </label>
            </div>
          }
        />
        {rooms.length ? (
          <>
            <div className={styles.tableScroller}>
              <table className={styles.dataTable}>
                <thead><tr><th>Chambre</th><th>Type</th><th>Étage</th><th>Capacité</th><th>Tarif / nuit</th><th>Statut opérationnel</th></tr></thead>
                <tbody>{rooms.map((room) => (
                  <tr key={room.room_number}>
                    <td><span className={styles.roomTableName}>#{room.room_number}</span></td>
                    <td><span className={styles.roomTypeLabel}>{roomTypeOptions.find((option) => option.value === room.room_type)?.label}</span></td>
                    <td>{room.floor}</td><td>{room.max_capacity} pers.</td><td>{formatXaf(room.base_price)}</td>
                    <td><StatusBadge status={room.operational_status} /></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <Pagination page={page} pageCount={pageCount} count={totalCount} onChange={onPageChange} />
          </>
        ) : <EmptyState title="Aucune chambre correspondante" detail="Essayez un autre type ou statut opérationnel." />}
      </section>
    </>
  );
}
