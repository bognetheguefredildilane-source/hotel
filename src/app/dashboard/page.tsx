"use client";

import {
  BedDouble,
  Bell,
  CalendarDays,
  LayoutDashboard,
  Receipt,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  InvoiceDetailsModal,
  invoicePaid,
  invoiceTotal,
  ReservationDetailsModal,
} from "./components";
import {
  loadDashboardData,
  type DashboardData,
  type ReservationStatus,
  type RoomStatus,
  type RoomType,
} from "./data";
import styles from "./dashboard.module.css";
import MonthlyOverviewSection from "./sections/MonthlyOverviewSection";
import OverviewStatsSection from "./sections/OverviewStatsSection";
import ReservationRoomOverviewSection from "./sections/ReservationRoomOverviewSection";
import RevenueInvoicesSection from "./sections/RevenueInvoicesSection";
import UpcomingReservationsSection from "./sections/UpcomingReservationsSection";
import ReservationsSection from "./sections/ReservationsSection";
import RoomsSection from "./sections/RoomsSection";
import GuestsSection from "./sections/GuestsSection";
import ServicesSection from "./sections/ServicesSection";
import InvoicesSection from "./sections/InvoicesSection";
import ReviewsSection from "./sections/ReviewsSection";
import ReportsSection from "./sections/ReportsSection";

const navigation = [
  { label: "Overview", href: "#overview", icon: LayoutDashboard },
  { label: "Reservations", href: "#reservations", icon: CalendarDays },
  { label: "Rooms", href: "#rooms", icon: BedDouble },
  { label: "Guests", href: "#guests", icon: Users },
  { label: "Services", href: "#services", icon: Sparkles },
  { label: "Invoices", href: "#invoices", icon: Receipt },
  { label: "Reviews", href: "#reviews", icon: Star },
  { label: "Reports", href: "#reports", icon: TrendingUp },
];

const pageSize = 5;

function todayISO(): string {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function subscribeToDate(): () => void {
  return () => {};
}

function displayDate(value: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Douala",
  }).format(new Date(`${value}T12:00:00`));
}

function getGuestName(data: DashboardData, clientId: number): string {
  const guest = data.guests.find((item) => item.client_id === clientId);
  return guest ? `${guest.first_name} ${guest.last_name}` : "Client inconnu";
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [activeNav, setActiveNav] = useState("Overview");
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Filtres
  const [reservationSearch, setReservationSearch] = useState("");
  const [reservationStatus, setReservationStatus] = useState<"all" | ReservationStatus>("all");
  const [reservationPage, setReservationPage] = useState(1);
  const [roomType, setRoomType] = useState<"all" | RoomType>("all");
  const [roomStatus, setRoomStatus] = useState<"all" | RoomStatus>("all");
  const [roomPage, setRoomPage] = useState(1);
  const [guestSearch, setGuestSearch] = useState("");
  const [guestPage, setGuestPage] = useState(1);
  const [invoicePage, setInvoicePage] = useState(1);
  const [reportMonths, setReportMonths] = useState(12);

  // Modals
  const [selectedReservation, setSelectedReservation] = useState<number | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    loadDashboardData()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : "Impossible de charger les données du tableau de bord.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [loadAttempt]);

  const retryLoading = () => {
    setData(null);
    setError(null);
    setLoading(true);
    setLoadAttempt((attempt) => attempt + 1);
  };

  const today = useSyncExternalStore(subscribeToDate, todayISO, () => "2026-11-03");
  const currentMonthIndex = Number(today.slice(5, 7)) - 1;
  const todayLabel = displayDate(today);
  const currentMonthMetric = data?.monthlyMetrics[currentMonthIndex] ?? data?.monthlyMetrics.at(-1);
  const visibleMetrics =
    data?.monthlyMetrics.slice(Math.max(0, currentMonthIndex - reportMonths + 1), currentMonthIndex + 1) ?? [];
  const rangeLabel = reportMonths === 12 ? "Cette année" : `${reportMonths} derniers mois`;

  const upcomingArrivals = useMemo(
    () =>
      (data?.reservations ?? [])
        .filter((reservation) => reservation.status !== "cancelled" && reservation.check_in_date >= today)
        .sort((a, b) => a.check_in_date.localeCompare(b.check_in_date))
        .slice(0, 4),
    [data, today]
  );

  const upcomingDepartures = useMemo(
    () =>
      (data?.reservations ?? [])
        .filter((reservation) => reservation.status !== "cancelled" && reservation.check_out_date >= today)
        .sort((a, b) => a.check_out_date.localeCompare(b.check_out_date))
        .slice(0, 4),
    [data, today]
  );

  const filteredReservations = useMemo(() => {
    if (!data) return [];
    const query = reservationSearch.trim().toLocaleLowerCase("fr");
    return data.reservations
      .filter((reservation) => reservationStatus === "all" || reservation.status === reservationStatus)
      .filter((reservation) => {
        const guest = getGuestName(data, reservation.client_id).toLocaleLowerCase("fr");
        const id = reservation.reservation_id.toString();
        return (
          !query ||
          guest.includes(query) ||
          id.includes(query) ||
          reservation.rooms.some((room) => room.room_number.toString().includes(query))
        );
      })
      .sort((a, b) => b.creation_date.localeCompare(a.creation_date));
  }, [data, reservationSearch, reservationStatus]);

  const filteredRooms = useMemo(
    () =>
      (data?.rooms ?? [])
        .filter((room) => roomType === "all" || room.room_type === roomType)
        .filter((room) => roomStatus === "all" || room.operational_status === roomStatus)
        .sort((a, b) => a.room_number - b.room_number),
    [data, roomType, roomStatus]
  );

  const filteredGuests = useMemo(
    () =>
      (data?.guests ?? [])
        .filter((guest) =>
          `${guest.first_name} ${guest.last_name} ${guest.email} ${guest.phone_number}`
            .toLocaleLowerCase("fr")
            .includes(guestSearch.trim().toLocaleLowerCase("fr"))
        )
        .sort((a, b) => a.last_name.localeCompare(b.last_name, "fr")),
    [data, guestSearch]
  );

  const unpaidInvoices = useMemo(
    () => (data?.invoices ?? []).filter((invoice) => invoice.status !== "paid").sort((a, b) => a.due_date.localeCompare(b.due_date)),
    [data]
  );

  const reservationPageCount = Math.max(1, Math.ceil(filteredReservations.length / pageSize));
  const roomPageCount = Math.max(1, Math.ceil(filteredRooms.length / pageSize));
  const guestPageCount = Math.max(1, Math.ceil(filteredGuests.length / pageSize));
  const invoicePageCount = Math.max(1, Math.ceil(unpaidInvoices.length / pageSize));

  const visibleReservations = filteredReservations.slice((reservationPage - 1) * pageSize, reservationPage * pageSize);
  const visibleRooms = filteredRooms.slice((roomPage - 1) * pageSize, roomPage * pageSize);
  const visibleGuests = filteredGuests.slice((guestPage - 1) * pageSize, guestPage * pageSize);
  const visibleInvoices = unpaidInvoices.slice((invoicePage - 1) * pageSize, invoicePage * pageSize);

  const outstandingBalance = (data?.invoices ?? []).reduce(
    (sum, invoice) => sum + Math.max(0, invoiceTotal(invoice) - invoicePaid(invoice)),
    0
  );

  const occupiedRooms = data?.rooms.filter((room) => room.operational_status === "occupied") ?? [];
  const availableRooms = data?.rooms.filter((room) => room.operational_status === "available") ?? [];
  const cleaningRooms = data?.rooms.filter((room) => room.operational_status === "being_cleaned") ?? [];
  const outOfServiceRooms = data?.rooms.filter((room) => room.operational_status === "out_of_service") ?? [];

  const arrivalsToday = (data?.reservations ?? []).filter((item) => item.status !== "cancelled" && item.check_in_date === today).length;
  const departuresToday = (data?.reservations ?? []).filter((item) => item.status !== "cancelled" && item.check_out_date === today).length;

  const reservationStatusCounts = {
    pending: (data?.reservations ?? []).filter((item) => item.status === "pending").length,
    confirmed: (data?.reservations ?? []).filter((item) => item.status === "confirmed").length,
    cancelled: (data?.reservations ?? []).filter((item) => item.status === "cancelled").length,
    completed: (data?.reservations ?? []).filter((item) => item.status === "completed").length,
  };

  const totalAccommodation = currentMonthMetric?.accommodation ?? 0;
  const totalServices = currentMonthMetric?.services ?? 0;
  const totalMiscellaneous = currentMonthMetric?.miscellaneous ?? 0;

  const selectedReservationRecord = data?.reservations.find((item) => item.reservation_id === selectedReservation) ?? null;
  const selectedInvoiceRecord = data?.invoices.find((item) => item.invoice_id === selectedInvoice) ?? null;
  const activeServiceBookings = (data?.serviceBookings ?? []).filter((booking) => booking.status !== "cancelled");

  // ÉTAT DE CHARGEMENT
  if (loading && !data) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.shell}>
          <aside className={styles.sidebar}>
            <Link className={styles.brand} href="/">
              <span className={styles.brandMark}>
                <BedDouble size={18} />
              </span>
              <span className={styles.brandText}>
                <span className={styles.brandName}>Grand Palace</span>
                <span className={styles.brandSub}>Hotel & Suites</span>
              </span>
            </Link>
          </aside>
          <main className={styles.main}>
            <header className={styles.topbar}>
              <h1 className={styles.topTitle}>Chargement du tableau de bord...</h1>
            </header>
            <div className={styles.content} aria-live="polite">
              <div className={styles.statsGrid}>
                {Array.from({ length: 6 }, (_, index) => (
                  <div key={index} className={`${styles.skeleton} ${styles.skeletonCard}`} />
                ))}
              </div>
              <div className={styles.dashboardGrid}>
                <div className={`${styles.skeleton} ${styles.skeletonPanel}`} />
                <div className={`${styles.skeleton} ${styles.skeletonPanel}`} />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ÉTAT D'ERREUR
  if (error || !data) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.shell}>
          <aside className={styles.sidebar}>
            <Link className={styles.brand} href="/">
              <span className={styles.brandMark}>
                <BedDouble size={18} />
              </span>
              <span className={styles.brandText}>
                <span className={styles.brandName}>Grand Palace</span>
                <span className={styles.brandSub}>Hotel & Suites</span>
              </span>
            </Link>
          </aside>
          <main className={styles.main}>
            <header className={styles.topbar}>
              <h1 className={styles.topTitle}>Tableau de bord</h1>
            </header>
            <div className={styles.content}>
              <div className={styles.errorState} role="alert">
                <div>
                  <strong>Le tableau de bord n’a pas pu être chargé.</strong>
                  <span>{error ?? "Aucune donnée n’a été renvoyée."}</span>
                </div>
                <button className={styles.primaryButton} onClick={retryLoading}>
                  Réessayer
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.shell}>
        {/* SIDEBAR NAVIGATION */}
        <aside className={styles.sidebar}>
          <Link className={styles.brand} href="/" aria-label="Grand Palace Hotel, accueil">
            <span className={styles.brandMark}>
              <BedDouble size={18} strokeWidth={1.9} />
            </span>
            <span className={styles.brandText}>
              <span className={styles.brandName}>Grand Palace</span>
              <span className={styles.brandSub}>Hotel & Suites</span>
            </span>
          </Link>
          <p className={styles.navLabel}>Gestion hôtelière</p>
          <nav aria-label="Navigation principale">
            <ul className={styles.navList}>
              {navigation.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    className={`${styles.navLink} ${activeNav === label ? styles.navActive : ""}`}
                    href={href}
                    onClick={() => setActiveNav(label)}
                    aria-current={activeNav === label ? "page" : undefined}
                    title={label}
                  >
                    <Icon size={17} strokeWidth={1.8} />
                    <span>{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.sideBottom}>
            <div className={styles.helpCard}>
              <strong>Besoin d’aide ?</strong>
              <p>Consultez les rapports ou revenez à la gestion opérationnelle.</p>
              <Link className={styles.helpLink} href="/">
                Aller à l’accueil
              </Link>
            </div>
            <div className={styles.sideUser}>
              <span className={styles.avatar}>AM</span>
              <div>
                <span className={styles.sideUserName}>Aïcha Mballa</span>
                <span className={styles.sideUserRole}>Responsable réception</span>
              </div>
            </div>
          </div>
        </aside>

        {/* CONTENU PRINCIPAL */}
        <main className={styles.main}>
          {/* HEADER TOPBAR */}
          <header className={styles.topbar}>
            <div className={styles.topLeft}>
              <h1 className={styles.topTitle}>Opérations</h1>
              <span className={styles.topDivider} />
              <span className={styles.today}>{todayLabel}</span>
            </div>
            <div className={styles.topActions}>
              <div className={styles.notificationWrap}>
                <button
                  className={styles.iconButton}
                  aria-label="Notifications"
                  aria-expanded={notificationOpen}
                  onClick={() => setNotificationOpen(!notificationOpen)}
                >
                  <Bell size={17} />
                  <span className={styles.notificationDot} />
                </button>
                {notificationOpen && (
                  <div className={styles.notificationPopover} role="status">
                    <strong>À suivre aujourd’hui</strong>
                    <p>
                      {arrivalsToday} arrivée{arrivalsToday > 1 ? "s" : ""} et {departuresToday} départ{departuresToday > 1 ? "s" : ""} à planifier.
                    </p>
                    <p>{unpaidInvoices.length} factures en attente de règlement.</p>
                  </div>
                )}
              </div>
              <div className={styles.topProfile}>
                <span className={styles.avatar}>AM</span>
                <span className={styles.profileName}>Aïcha Mballa</span>
              </div>
            </div>
          </header>

          <div className={styles.content}>
            {activeNav === "Overview" && (
              <>
            {/* INTRO HERO */}
            <div className={styles.pageIntro} id="overview">
              <div>
                <p className={styles.eyebrow}>Aujourd’hui · Vue d’ensemble</p>
                <h2 className={styles.pageTitle}>Bonjour, Aïcha</h2>
                <p className={styles.pageDescription}>Voici le point sur l’activité et l’exploitation de l’établissement.</p>
              </div>
              <div className={styles.introActions}>
                <span className={styles.demoTag}>
                  <span className={styles.legendDot} /> Base MySQL hotel_db (XAF)
                </span>
              </div>
            </div>

            <OverviewStatsSection
              roomCount={data.rooms.length}
              occupiedCount={occupiedRooms.length}
              availableCount={availableRooms.length}
              cleaningCount={cleaningRooms.length}
              arrivalsToday={arrivalsToday}
              departuresToday={departuresToday}
              todayLabel={todayLabel}
              outstandingBalance={outstandingBalance}
              unpaidInvoiceCount={unpaidInvoices.length}
            />
            <MonthlyOverviewSection
              months={visibleMetrics}
              reportMonths={reportMonths}
              onReportMonthsChange={setReportMonths}
              rangeLabel={rangeLabel}
            />
            <ReservationRoomOverviewSection
              roomCount={data.rooms.length}
              reservationStatusCounts={reservationStatusCounts}
              roomsByStatus={{
                available: availableRooms.map((room) => room.room_number),
                occupied: occupiedRooms.map((room) => room.room_number),
                being_cleaned: cleaningRooms.map((room) => room.room_number),
                out_of_service: outOfServiceRooms.map((room) => room.room_number),
              }}
            />

            <RevenueInvoicesSection
              data={data}
              monthLabel={currentMonthMetric?.month ?? "ce mois"}
              accommodation={totalAccommodation}
              services={totalServices}
              miscellaneous={totalMiscellaneous}
              unpaidInvoices={unpaidInvoices}
              getGuestName={(clientId) => getGuestName(data, clientId)}
              onSelectInvoice={setSelectedInvoice}
            />
            <UpcomingReservationsSection
              arrivals={upcomingArrivals}
              departures={upcomingDepartures}
              getGuestName={(clientId) => getGuestName(data, clientId)}
              onSelectReservation={setSelectedReservation}
            />
              </>
            )}

            {activeNav === "Reservations" && <ReservationsSection
              reservations={visibleReservations}
              totalCount={filteredReservations.length}
              page={reservationPage}
              pageCount={reservationPageCount}
              search={reservationSearch}
              status={reservationStatus}
              getGuestName={(clientId) => getGuestName(data, clientId)}
              onSearchChange={(value) => {
                setReservationSearch(value);
                setReservationPage(1);
              }}
              onStatusChange={(value) => {
                setReservationStatus(value);
                setReservationPage(1);
              }}
              onPageChange={setReservationPage}
              onSelectReservation={setSelectedReservation}
            />}

            {activeNav === "Rooms" && <RoomsSection
              rooms={visibleRooms}
              totalCount={filteredRooms.length}
              page={roomPage}
              pageCount={roomPageCount}
              type={roomType}
              status={roomStatus}
              onTypeChange={(value) => {
                setRoomType(value);
                setRoomPage(1);
              }}
              onStatusChange={(value) => {
                setRoomStatus(value);
                setRoomPage(1);
              }}
              onPageChange={setRoomPage}
            />}

            {activeNav === "Guests" && <GuestsSection
              data={data}
              guests={visibleGuests}
              totalCount={filteredGuests.length}
              page={guestPage}
              pageCount={guestPageCount}
              search={guestSearch}
              onSearchChange={(value) => {
                setGuestSearch(value);
                setGuestPage(1);
              }}
              onPageChange={setGuestPage}
            />}
            {activeNav === "Services" && <ServicesSection
              data={data}
              bookings={activeServiceBookings}
              getGuestName={(clientId) => getGuestName(data, clientId)}
            />}

            {activeNav === "Invoices" && <InvoicesSection
              data={data}
              invoices={visibleInvoices}
              totalCount={unpaidInvoices.length}
              page={invoicePage}
              pageCount={invoicePageCount}
              outstandingBalance={outstandingBalance}
              getGuestName={(clientId) => getGuestName(data, clientId)}
              onPageChange={setInvoicePage}
              onSelectInvoice={setSelectedInvoice}
            />}
            {activeNav === "Reviews" && <ReviewsSection data={data} getGuestName={(clientId) => getGuestName(data, clientId)} />}
            {activeNav === "Reports" && (
              <ReportsSection
                months={visibleMetrics}
                reportMonths={reportMonths}
                rangeLabel={rangeLabel}
                onReportMonthsChange={setReportMonths}
              />
            )}
          </div>
        </main>
      </div>

      {/* MODALS DÉTAILLED */}
      {selectedReservationRecord && (
        <ReservationDetailsModal
          reservation={selectedReservationRecord}
          data={data}
          onClose={() => setSelectedReservation(null)}
        />
      )}
      {selectedInvoiceRecord && (
        <InvoiceDetailsModal
          invoice={selectedInvoiceRecord}
          data={data}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}
