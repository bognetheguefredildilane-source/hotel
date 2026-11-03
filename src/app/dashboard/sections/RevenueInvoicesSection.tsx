import { BedDouble, CircleDollarSign, FileText, Sparkles } from "lucide-react";
import { EmptyState, formatShortDate, formatXaf, invoicePaid, invoiceTotal, PanelHeader, StatusBadge } from "../components";
import type { DashboardData, Invoice } from "../data";
import styles from "../dashboard.module.css";

interface RevenueInvoicesSectionProps {
  data: DashboardData;
  monthLabel: string;
  accommodation: number;
  services: number;
  miscellaneous: number;
  unpaidInvoices: Invoice[];
  getGuestName: (clientId: number) => string;
  onSelectInvoice: (invoiceId: number) => void;
}

export default function RevenueInvoicesSection({
  data,
  monthLabel,
  accommodation,
  services,
  miscellaneous,
  unpaidInvoices,
  getGuestName,
  onSelectInvoice,
}: RevenueInvoicesSectionProps) {
  const revenueItems = [
    { label: "Hébergement", detail: "Chambres et nuitées", value: accommodation, Icon: BedDouble },
    { label: "Services", detail: "Restauration, transport, bien-être", value: services, Icon: Sparkles },
    { label: "Divers", detail: "Taxes et frais annexes", value: miscellaneous, Icon: CircleDollarSign },
  ];

  return (
    <section className={styles.dashboardGrid} aria-label="Revenus du mois et factures">
      <article className={styles.panel}>
        <PanelHeader title="Revenus par activité" subtitle={`Estimations de ${monthLabel} · XAF`} />
        <div className={styles.miniList}>
          {revenueItems.map(({ label, detail, value, Icon }) => (
            <div className={styles.miniRow} key={label}>
              <div className={styles.miniMain}>
                <span className={styles.miniIcon}>
                  <Icon size={15} />
                </span>
                <div>
                  <strong>{label}</strong>
                  <span>{detail}</span>
                </div>
              </div>
              <strong className={styles.invoiceDue}>{formatXaf(value)}</strong>
            </div>
          ))}
        </div>
        <div className={styles.modalTotal}>
          <span>Chiffre d’affaires total</span>
          <strong>{formatXaf(accommodation + services + miscellaneous)}</strong>
        </div>
      </article>
      <article className={styles.panel}>
        <PanelHeader
          title="Factures à suivre"
          subtitle={`${unpaidInvoices.length} factures non soldées`}
          action={
            <a href="#invoices" className={styles.subtleLink}>
              Tout voir
            </a>
          }
        />
        <div className={styles.miniList}>
          {unpaidInvoices.slice(0, 3).map((invoice) => {
            const reservation = data.reservations.find((item) => item.reservation_id === invoice.reservation_id);
            return (
              <div className={styles.miniRow} key={invoice.invoice_id}>
                <div className={styles.miniMain}>
                  <span className={styles.miniIcon}>
                    <FileText size={15} />
                  </span>
                  <div>
                    <button className={styles.textButton} onClick={() => onSelectInvoice(invoice.invoice_id)}>
                      Facture #{invoice.invoice_id}
                    </button>
                    <span>
                      {reservation ? getGuestName(reservation.client_id) : "Client inconnu"} · échéance{" "}
                      {formatShortDate(invoice.due_date)}
                    </span>
                  </div>
                </div>
                <div className={styles.miniMeta}>
                  <strong className={styles.invoiceDue}>{formatXaf(invoiceTotal(invoice) - invoicePaid(invoice))}</strong>
                  <StatusBadge status={invoice.status} />
                </div>
              </div>
            );
          })}
          {!unpaidInvoices.length && (
            <EmptyState title="Aucune facture en attente" detail="Les factures non réglées apparaîtront ici." />
          )}
        </div>
      </article>
    </section>
  );
}
