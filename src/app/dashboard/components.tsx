"use client";

import type { ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BedDouble,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileText,
  Star,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type {
  DashboardData,
  Invoice,
  InvoiceStatus,
  MonthlyMetric,
  Reservation,
  ReservationStatus,
  RoomStatus,
} from "./data";
import styles from "./dashboard.module.css";

export interface StatCardProps {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
  tone?: "green" | "blue" | "amber" | "red";
  trend?: "up" | "down";
}

export function StatCard({ label, value, note, icon: Icon, tone = "blue", trend }: StatCardProps) {
  return (
    <article className={styles.statCard}>
      <div className={styles.statTop}>
        <span className={styles.statLabel}>{label}</span>
        <span className={`${styles.statIcon} ${styles[`tone_${tone}`]}`}>
          <Icon size={18} strokeWidth={1.8} />
        </span>
      </div>
      <strong className={styles.statValue}>{value}</strong>
      <span className={styles.statNote}>
        {trend && (trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />)}
        {note}
      </span>
    </article>
  );
}

export const statusNames: Record<ReservationStatus | InvoiceStatus | RoomStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  cancelled: "Annulée",
  completed: "Terminée",
  due: "À régler",
  partially_paid: "Part. réglée",
  paid: "Payée",
  available: "Disponible",
  occupied: "Occupée",
  being_cleaned: "Nettoyage",
  out_of_service: "Hors service",
};

export const statusStyles: Record<ReservationStatus | InvoiceStatus | RoomStatus, string> = {
  pending: "badge_amber",
  confirmed: "badge_green",
  cancelled: "badge_red",
  completed: "badge_gray",
  due: "badge_red",
  partially_paid: "badge_amber",
  paid: "badge_green",
  available: "badge_green",
  occupied: "badge_blue",
  being_cleaned: "badge_amber",
  out_of_service: "badge_red",
};

export function StatusBadge({ status }: { status: ReservationStatus | InvoiceStatus | RoomStatus }) {
  return <span className={`${styles.statusBadge} ${styles[statusStyles[status]]}`}>{statusNames[status]}</span>;
}

export function PanelHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className={styles.panelHeader}>
      <div>
        <h2 className={styles.panelTitle}>{title}</h2>
        {subtitle && <p className={styles.panelSubtitle}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className={styles.emptyState}>
      <span className={styles.emptyIcon}>
        <CircleAlert size={18} />
      </span>
      <strong>{title}</strong>
      <span>{detail}</span>
    </div>
  );
}

export function OccupancyChart({ months }: { months: MonthlyMetric[] }) {
  const width = 660;
  const height = 200;
  const left = 38;
  const right = 10;
  const top = 14;
  const bottom = 30;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const points = months.map((item, index) => {
    const x = left + (months.length === 1 ? plotWidth / 2 : (index * plotWidth) / (months.length - 1));
    const y = top + plotHeight * (1 - item.occupancy / 100);
    return { x, y, item };
  });
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `${left},${top + plotHeight} ${line} ${left + plotWidth},${top + plotHeight}`;

  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartLegend}>
        <span>
          <i className={styles.legendDot} /> Taux d’occupation
        </span>
        <strong>
          86% <small>en novembre</small>
        </strong>
      </div>
      <svg className={styles.chartSvg} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Évolution mensuelle du taux d’occupation">
        {[0, 25, 50, 75, 100].map((value) => {
          const y = top + plotHeight * (1 - value / 100);
          return (
            <g key={value}>
              <line x1={left} x2={width - right} y1={y} y2={y} className={styles.gridLine} />
              <text x="2" y={y + 4} className={styles.axisText}>
                {value}%
              </text>
            </g>
          );
        })}
        <polygon points={area} className={styles.chartArea} />
        <polyline points={line} className={styles.occupancyLine} />
        {points.map(({ x, y, item }) => (
          <circle key={item.month} cx={x} cy={y} r="3.5" className={styles.chartPoint} />
        ))}
        {points.map(({ x, item }) => (
          <text key={item.month} x={x} y={height - 5} textAnchor="middle" className={styles.monthText}>
            {item.month}
          </text>
        ))}
      </svg>
    </div>
  );
}

export function RevenueChart({ months }: { months: MonthlyMetric[] }) {
  const max = Math.max(...months.map((item) => item.accommodation + item.services + item.miscellaneous), 1);
  return (
    <div className={styles.revenueChart}>
      <div className={styles.revenueLegend}>
        <span>
          <i className={`${styles.legendDot} ${styles.legendNavy}`} /> Hébergement
        </span>
        <span>
          <i className={`${styles.legendDot} ${styles.legendMint}`} /> Services
        </span>
        <span>
          <i className={`${styles.legendDot} ${styles.legendAmber}`} /> Divers
        </span>
      </div>
      <div className={styles.barChart} role="img" aria-label="Revenus mensuels par source, en XAF">
        {months.map((month) => {
          const total = month.accommodation + month.services + month.miscellaneous;
          return (
            <div className={styles.barColumn} key={month.month} title={`${month.month} · ${formatXaf(total)}`}>
              <div className={styles.barStack}>
                <span className={styles.barMisc} style={{ height: `${(month.miscellaneous / max) * 100}%` }} />
                <span className={styles.barServices} style={{ height: `${(month.services / max) * 100}%` }} />
                <span className={styles.barAccommodation} style={{ height: `${(month.accommodation / max) * 100}%` }} />
              </div>
              <span className={styles.monthText}>{month.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ReservationStatusChart({ values }: { values: Record<ReservationStatus, number> }) {
  const total = Object.values(values).reduce((sum, value) => sum + value, 0) || 1;
  const segments = [
    { key: "confirmed", label: "Confirmées", value: values.confirmed, color: "var(--green)" },
    { key: "completed", label: "Terminées", value: values.completed, color: "var(--navy)" },
    { key: "pending", label: "En attente", value: values.pending, color: "var(--amber)" },
    { key: "cancelled", label: "Annulées", value: values.cancelled, color: "var(--red)" },
  ] as const;
  let start = 0;
  const gradient = segments
    .map((segment) => {
      const end = start + (segment.value / total) * 100;
      const slice = `${segment.color} ${start}% ${end}%`;
      start = end;
      return slice;
    })
    .join(", ");

  return (
    <div className={styles.distribution}>
      <div className={styles.donut} style={{ background: `conic-gradient(${gradient})` }}>
        <span>
          <strong>{total}</strong>
          <small>séjours</small>
        </span>
      </div>
      <div className={styles.distributionLegend}>
        {segments.map((segment) => (
          <div className={styles.distributionRow} key={segment.key}>
            <span>
              <i className={styles.legendDot} style={{ backgroundColor: segment.color }} />
              {segment.label}
            </span>
            <strong>{segment.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RoomStatusCard({
  status,
  count,
  total,
  rooms,
}: {
  status: RoomStatus;
  count: number;
  total: number;
  rooms: number[];
}) {
  const icons: Record<RoomStatus, LucideIcon> = {
    available: BedDouble,
    occupied: Users,
    being_cleaned: Clock3,
    out_of_service: CircleAlert,
  };
  const Icon = icons[status];
  return (
    <article className={styles.roomStatusCard}>
      <div className={styles.roomStatusTop}>
        <span className={`${styles.roomStatusIcon} ${styles[statusStyles[status]]}`}>
          <Icon size={17} />
        </span>
        <strong>{count}</strong>
      </div>
      <span className={styles.roomStatusName}>{statusNames[status]}</span>
      <div className={styles.roomProgress}>
        <span style={{ width: `${total ? (count / total) * 100 : 0}%` }} />
      </div>
      <span className={styles.roomList}>
        {rooms.length ? rooms.map((number) => `#${number}`).join(" · ") : "Aucune chambre"}
      </span>
    </article>
  );
}

export function ReservationRow({
  reservation,
  guestName,
  onSelect,
}: {
  reservation: Reservation;
  guestName: string;
  onSelect: () => void;
}) {
  return (
    <tr>
      <td>
        <button className={styles.textButton} onClick={onSelect}>
          #{reservation.reservation_id.toString().padStart(4, "0")}
        </button>
      </td>
      <td>
        <span className={styles.guestName}>{guestName}</span>
      </td>
      <td>{formatShortDate(reservation.check_in_date)}</td>
      <td>{formatShortDate(reservation.check_out_date)}</td>
      <td>{reservation.rooms.map((room) => `#${room.room_number}`).join(", ")}</td>
      <td>
        <StatusBadge status={reservation.status} />
      </td>
      <td className={styles.numericCell}>{formatXaf(reservationValue(reservation))}</td>
      <td>
        <button className={styles.iconButton} aria-label={`Voir la réservation ${reservation.reservation_id}`} onClick={onSelect}>
          <ChevronDown size={16} />
        </button>
      </td>
    </tr>
  );
}

export function InvoiceRow({
  invoice,
  guestName,
  onSelect,
}: {
  invoice: Invoice;
  guestName: string;
  onSelect: () => void;
}) {
  const total = invoice.lines.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  const paid = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
  return (
    <tr>
      <td>
        <button className={styles.textButton} onClick={onSelect}>
          #{invoice.invoice_id}
        </button>
      </td>
      <td>
        <span className={styles.guestName}>{guestName}</span>
      </td>
      <td>{formatShortDate(invoice.due_date)}</td>
      <td>
        <StatusBadge status={invoice.status} />
      </td>
      <td className={styles.numericCell}>{formatXaf(total - paid)}</td>
      <td>
        <button className={styles.iconButton} aria-label={`Voir la facture ${invoice.invoice_id}`} onClick={onSelect}>
          <FileText size={16} />
        </button>
      </td>
    </tr>
  );
}

export function GuestReviewCard({
  name,
  date,
  room,
  rating,
  comment,
}: {
  name: string;
  date: string;
  room: number;
  rating: number;
  comment: string;
}) {
  return (
    <article className={styles.reviewCard}>
      <div className={styles.reviewTop}>
        <span className={styles.avatar}>
          {name
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")}
        </span>
        <div className={styles.reviewGuest}>
          <strong>{name}</strong>
          <span>
            Chambre {room} · {formatShortDate(date)}
          </span>
        </div>
        <span className={styles.reviewRating}>
          <Star size={14} fill="currentColor" /> {rating.toFixed(1)}
        </span>
      </div>
      <p>{comment}</p>
    </article>
  );
}

export function Pagination({
  page,
  pageCount,
  count,
  pageSize = 5,
  onChange,
}: {
  page: number;
  pageCount: number;
  count: number;
  pageSize?: number;
  onChange: (page: number) => void;
}) {
  const first = count === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, count);
  return (
    <div className={styles.tableFooter}>
      <span className={styles.paginationText}>
        Affichage {first}–{last} sur {count}
      </span>
      <div className={styles.paginationActions} aria-label="Pagination">
        <button className={styles.pageButton} aria-label="Page précédente" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          <ChevronLeft size={15} />
        </button>
        {Array.from({ length: pageCount }, (_, index) => index + 1).map((value) => (
          <button
            key={value}
            className={`${styles.pageButton} ${page === value ? styles.pageButtonCurrent : ""}`}
            aria-label={`Page ${value}`}
            aria-current={page === value ? "page" : undefined}
            onClick={() => onChange(value)}
          >
            {value}
          </button>
        ))}
        <button className={styles.pageButton} aria-label="Page suivante" disabled={page >= pageCount} onClick={() => onChange(page + 1)}>
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

export function ReservationDetailsModal({
  reservation,
  data,
  onClose,
}: {
  reservation: Reservation;
  data: DashboardData;
  onClose: () => void;
}) {
  const guest = data.guests.find((item) => item.client_id === reservation.client_id);
  const nights = Math.max(
    1,
    Math.round(
      (new Date(`${reservation.check_out_date}T12:00:00`).getTime() -
        new Date(`${reservation.check_in_date}T12:00:00`).getTime()) /
        86_400_000
    )
  );

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="reservation-modal-title" tabIndex={-1}>
        <div className={styles.modalHeader}>
          <div>
            <h2 id="reservation-modal-title">Séjour #{reservation.reservation_id.toString().padStart(4, "0")}</h2>
            <p>Créé le {formatShortDate(reservation.creation_date)}</p>
          </div>
          <button className={styles.iconButton} aria-label="Fermer" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className={styles.modalSection}>
          <h3>Informations du séjour</h3>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <span>Client</span>
              <strong>{guest ? `${guest.first_name} ${guest.last_name}` : "Client inconnu"}</strong>
            </div>
            <div className={styles.detailItem}>
              <span>Statut</span>
              <StatusBadge status={reservation.status} />
            </div>
            <div className={styles.detailItem}>
              <span>Arrivée</span>
              <strong>{formatShortDate(reservation.check_in_date)}</strong>
            </div>
            <div className={styles.detailItem}>
              <span>Départ</span>
              <strong>{formatShortDate(reservation.check_out_date)}</strong>
            </div>
            <div className={styles.detailItem}>
              <span>Voyageurs</span>
              <strong>
                {reservation.num_guests} personne{reservation.num_guests > 1 ? "s" : ""}
              </strong>
            </div>
            <div className={styles.detailItem}>
              <span>Durée</span>
              <strong>
                {nights} nuit{nights > 1 ? "s" : ""}
              </strong>
            </div>
          </div>
        </div>
        <div className={styles.modalSection}>
          <h3>Chambres</h3>
          {reservation.rooms.map((room) => (
            <div className={styles.modalLine} key={room.room_number}>
              <span>
                Chambre {room.room_number} · {nights} nuit{nights > 1 ? "s" : ""}
              </span>
              <strong>{formatXaf(room.nightly_price * nights)}</strong>
            </div>
          ))}
          <div className={styles.modalTotal}>
            <span>Total hébergement</span>
            <strong>{formatXaf(reservationValue(reservation))}</strong>
          </div>
        </div>
        {guest && (
          <div className={styles.modalSection}>
            <h3>Coordonnées client</h3>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span>Téléphone</span>
                <strong>{guest.phone_number}</strong>
              </div>
              <div className={styles.detailItem}>
                <span>E-mail</span>
                <strong>{guest.email}</strong>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export function InvoiceDetailsModal({
  invoice,
  data,
  onClose,
}: {
  invoice: Invoice;
  data: DashboardData;
  onClose: () => void;
}) {
  const reservation = data.reservations.find((item) => item.reservation_id === invoice.reservation_id);
  const guest = reservation ? data.guests.find((item) => item.client_id === reservation.client_id) : null;
  const guestName = guest ? `${guest.first_name} ${guest.last_name}` : "Client inconnu";
  const total = invoiceTotal(invoice);
  const paid = invoicePaid(invoice);
  const lineSubtotal = invoice.lines.reduce((sum, line) => sum + line.quantity * line.unit_price, 0);

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="invoice-modal-title" tabIndex={-1}>
        <div className={styles.modalHeader}>
          <div>
            <h2 id="invoice-modal-title">Facture #{invoice.invoice_id}</h2>
            <p>
              {guestName} · échéance {formatShortDate(invoice.due_date)}
            </p>
          </div>
          <button className={styles.iconButton} aria-label="Fermer" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className={styles.modalSection}>
          <h3>Détail des lignes</h3>
          {invoice.lines.map((line) => (
            <div className={styles.modalLine} key={line.invoice_line_id}>
              <span>
                {line.description} · {line.quantity} × {formatXaf(line.unit_price)}
              </span>
              <strong>{formatXaf(line.quantity * line.unit_price)}</strong>
            </div>
          ))}
          {invoice.total_amount !== undefined && lineSubtotal !== invoice.total_amount && (
            <p className={styles.panelSubtitle} role="note">
              Le total enregistré diffère du sous-total calculé à partir des lignes.
            </p>
          )}
          <div className={styles.modalTotal}>
            <span>Total de la facture</span>
            <strong>{formatXaf(total)}</strong>
          </div>
        </div>
        <div className={styles.modalSection}>
          <h3>Paiements enregistrés</h3>
          {invoice.payments.length ? (
            invoice.payments.map((payment) => (
              <div className={styles.modalLine} key={payment.payment_id}>
                <span>
                  {formatShortDate(payment.payment_date)} · {payment.method.replace("_", " ")}
                </span>
                <strong>{formatXaf(payment.amount)}</strong>
              </div>
            ))
          ) : (
            <p className={styles.panelSubtitle}>Aucun règlement enregistré.</p>
          )}
          <div className={styles.modalTotal}>
            <span>Solde restant</span>
            <strong>{formatXaf(Math.max(0, total - paid))}</strong>
          </div>
        </div>
      </section>
    </div>
  );
}

export function formatXaf(amount: number): string {
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(amount))} XAF`;
}

export function formatShortDate(value: string): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" }).format(
    new Date(`${value.slice(0, 10)}T12:00:00`)
  );
}

export function reservationValue(reservation: Reservation): number {
  const nights = Math.max(
    1,
    Math.round(
      (new Date(`${reservation.check_out_date}T12:00:00`).getTime() -
        new Date(`${reservation.check_in_date}T12:00:00`).getTime()) /
        86_400_000
    )
  );
  return reservation.rooms.reduce((sum, room) => sum + room.nightly_price * nights, 0);
}

export function invoiceTotal(invoice: Invoice): number {
  return invoice.total_amount ?? invoice.lines.reduce((sum, line) => sum + line.quantity * line.unit_price, 0);
}

export function invoicePaid(invoice: Invoice): number {
  return invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
}
