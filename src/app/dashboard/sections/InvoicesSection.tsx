import { EmptyState, formatXaf, InvoiceRow, Pagination, PanelHeader } from "../components";
import type { DashboardData, Invoice } from "../data";
import styles from "../dashboard.module.css";

interface InvoicesSectionProps {
  data: DashboardData;
  invoices: Invoice[];
  totalCount: number;
  page: number;
  pageCount: number;
  outstandingBalance: number;
  getGuestName: (clientId: number) => string;
  onPageChange: (page: number) => void;
  onSelectInvoice: (invoiceId: number) => void;
}

export default function InvoicesSection({
  data, invoices, totalCount, page, pageCount, outstandingBalance, getGuestName, onPageChange, onSelectInvoice,
}: InvoicesSectionProps) {
  return (
    <>
      <section className={styles.sectionHeading} id="invoices">
        <div><h2>Facturation</h2><p>Factures ouvertes, règlements reçus et soldes à suivre (BR-13, BR-14, BR-15).</p></div>
      </section>
      <section className={styles.panel} aria-label="Factures non réglées">
        <PanelHeader title="Factures non soldées" subtitle={`Solde à recouvrer : ${formatXaf(outstandingBalance)}`} />
        {invoices.length ? (
          <>
            <div className={styles.tableScroller}>
              <table className={styles.dataTable}>
                <thead><tr><th>Facture</th><th>Client</th><th>Échéance</th><th>Statut</th><th className={styles.numericCell}>Solde restant</th><th><span className={styles.srOnly}>Détails</span></th></tr></thead>
                <tbody>{invoices.map((invoice) => {
                  const reservation = data.reservations.find((item) => item.reservation_id === invoice.reservation_id);
                  return (
                    <InvoiceRow
                      key={invoice.invoice_id}
                      invoice={invoice}
                      guestName={reservation ? getGuestName(reservation.client_id) : "Client inconnu"}
                      onSelect={() => onSelectInvoice(invoice.invoice_id)}
                    />
                  );
                })}</tbody>
              </table>
            </div>
            <Pagination page={page} pageCount={pageCount} count={totalCount} onChange={onPageChange} />
          </>
        ) : <EmptyState title="Toutes les factures sont réglées" detail="Aucun solde restant à recouvrer." />}
      </section>
    </>
  );
}
