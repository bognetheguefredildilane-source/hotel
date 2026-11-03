import type {
  DashboardData,
  Guest,
  Invoice,
  InvoiceLine,
  MonthlyMetric,
  Payment,
  Reservation,
  Review,
  Room,
  Service,
  ServiceBooking,
} from "./data";

const guests: Guest[] = [
  { client_id: 1, last_name: "Smith", first_name: "John", phone_number: "+1-555-0101", email: "john.smith@email.com" },
  { client_id: 2, last_name: "Dupont", first_name: "Marie", phone_number: "+33-600-0102", email: "marie.dupont@email.com" },
  { client_id: 3, last_name: "Johnson", first_name: "Bob", phone_number: "+1-555-0103", email: "bob.johnson@email.com" },
  { client_id: 4, last_name: "Martin", first_name: "Claire", phone_number: "+33-600-0104", email: "claire.martin@email.com" },
  { client_id: 5, last_name: "Williams", first_name: "Tom", phone_number: "+1-555-0105", email: "tom.williams@email.com" },
  { client_id: 6, last_name: "Bernard", first_name: "Alice", phone_number: "+33-600-0106", email: "alice.bernard@email.com" },
  { client_id: 7, last_name: "Taylor", first_name: "James", phone_number: "+1-555-0107", email: "james.taylor@email.com" },
  { client_id: 8, last_name: "Moreau", first_name: "Sophie", phone_number: "+33-600-0108", email: "sophie.moreau@email.com" },
  { client_id: 9, last_name: "Anderson", first_name: "Peter", phone_number: "+1-555-0109", email: "peter.anderson@email.com" },
  { client_id: 10, last_name: "Leroy", first_name: "Emma", phone_number: "+33-600-0110", email: "emma.leroy@email.com" },
];

const rooms: Room[] = [
  { room_number: 101, floor: 1, room_type: "simple", max_capacity: 1, base_price: 80, operational_status: "available", amenity_ids: [4, 5] },
  { room_number: 102, floor: 1, room_type: "simple", max_capacity: 1, base_price: 80, operational_status: "available", amenity_ids: [4, 5] },
  { room_number: 103, floor: 1, room_type: "simple", max_capacity: 2, base_price: 90, operational_status: "available", amenity_ids: [2, 4, 5] },
  { room_number: 104, floor: 1, room_type: "simple", max_capacity: 2, base_price: 90, operational_status: "available", amenity_ids: [] },
  { room_number: 105, floor: 1, room_type: "simple", max_capacity: 1, base_price: 75, operational_status: "out_of_service", amenity_ids: [] },
  { room_number: 201, floor: 2, room_type: "double", max_capacity: 2, base_price: 120, operational_status: "available", amenity_ids: [1, 4, 5] },
  { room_number: 202, floor: 2, room_type: "double", max_capacity: 2, base_price: 120, operational_status: "available", amenity_ids: [4, 5] },
  { room_number: 203, floor: 2, room_type: "double", max_capacity: 3, base_price: 140, operational_status: "available", amenity_ids: [1, 2, 4] },
  { room_number: 204, floor: 2, room_type: "double", max_capacity: 3, base_price: 140, operational_status: "available", amenity_ids: [] },
  { room_number: 205, floor: 2, room_type: "double", max_capacity: 2, base_price: 130, operational_status: "available", amenity_ids: [] },
  { room_number: 301, floor: 3, room_type: "suite", max_capacity: 4, base_price: 250, operational_status: "available", amenity_ids: [1, 2, 3, 4, 5] },
  { room_number: 302, floor: 3, room_type: "suite", max_capacity: 4, base_price: 250, operational_status: "available", amenity_ids: [1, 3, 4, 5] },
  { room_number: 303, floor: 3, room_type: "suite", max_capacity: 6, base_price: 320, operational_status: "available", amenity_ids: [1, 2, 3, 4, 5] },
  { room_number: 304, floor: 3, room_type: "suite", max_capacity: 4, base_price: 280, operational_status: "available", amenity_ids: [] },
  { room_number: 305, floor: 3, room_type: "suite", max_capacity: 2, base_price: 200, operational_status: "available", amenity_ids: [] },
];

const reservations: Reservation[] = [
  { reservation_id: 1, client_id: 1, check_in_date: "2026-01-10", check_out_date: "2026-01-15", num_guests: 1, status: "completed", creation_date: "2025-12-20 10:00:00", cancellation_date: null, rooms: [{ room_number: 101, nightly_price: 80 }] },
  { reservation_id: 2, client_id: 2, check_in_date: "2026-01-20", check_out_date: "2026-01-25", num_guests: 4, status: "completed", creation_date: "2025-12-22 14:00:00", cancellation_date: null, rooms: [{ room_number: 201, nightly_price: 120 }, { room_number: 202, nightly_price: 120 }] },
  { reservation_id: 3, client_id: 3, check_in_date: "2026-02-01", check_out_date: "2026-02-08", num_guests: 3, status: "completed", creation_date: "2026-01-05 09:00:00", cancellation_date: null, rooms: [{ room_number: 301, nightly_price: 250 }] },
  { reservation_id: 4, client_id: 4, check_in_date: "2026-02-15", check_out_date: "2026-02-17", num_guests: 1, status: "completed", creation_date: "2026-01-10 11:00:00", cancellation_date: null, rooms: [{ room_number: 102, nightly_price: 80 }] },
  { reservation_id: 5, client_id: 5, check_in_date: "2026-03-01", check_out_date: "2026-03-05", num_guests: 2, status: "completed", creation_date: "2026-02-01 10:00:00", cancellation_date: null, rooms: [{ room_number: 203, nightly_price: 140 }] },
  { reservation_id: 6, client_id: 6, check_in_date: "2026-03-10", check_out_date: "2026-03-15", num_guests: 4, status: "completed", creation_date: "2026-02-15 08:00:00", cancellation_date: null, rooms: [{ room_number: 302, nightly_price: 250 }] },
  { reservation_id: 7, client_id: 7, check_in_date: "2026-04-01", check_out_date: "2026-04-04", num_guests: 1, status: "completed", creation_date: "2026-03-01 12:00:00", cancellation_date: null, rooms: [{ room_number: 103, nightly_price: 90 }] },
  { reservation_id: 8, client_id: 8, check_in_date: "2026-04-20", check_out_date: "2026-04-25", num_guests: 2, status: "completed", creation_date: "2026-03-20 09:00:00", cancellation_date: null, rooms: [{ room_number: 204, nightly_price: 140 }] },
  { reservation_id: 9, client_id: 1, check_in_date: "2026-05-01", check_out_date: "2026-05-03", num_guests: 2, status: "completed", creation_date: "2026-04-10 10:00:00", cancellation_date: null, rooms: [{ room_number: 104, nightly_price: 90 }] },
  { reservation_id: 10, client_id: 2, check_in_date: "2026-05-10", check_out_date: "2026-05-15", num_guests: 4, status: "completed", creation_date: "2026-04-15 11:00:00", cancellation_date: null, rooms: [{ room_number: 303, nightly_price: 320 }] },
  { reservation_id: 11, client_id: 3, check_in_date: "2026-06-01", check_out_date: "2026-06-05", num_guests: 1, status: "cancelled", creation_date: "2026-05-01 10:00:00", cancellation_date: "2026-05-20 14:00:00", rooms: [{ room_number: 102, nightly_price: 80 }] },
  { reservation_id: 12, client_id: 4, check_in_date: "2026-06-10", check_out_date: "2026-06-12", num_guests: 2, status: "cancelled", creation_date: "2026-05-10 09:00:00", cancellation_date: "2026-05-25 16:00:00", rooms: [{ room_number: 201, nightly_price: 120 }] },
  { reservation_id: 13, client_id: 5, check_in_date: "2026-11-01", check_out_date: "2026-11-05", num_guests: 3, status: "confirmed", creation_date: "2026-09-01 10:00:00", cancellation_date: null, rooms: [{ room_number: 301, nightly_price: 260 }] },
  { reservation_id: 14, client_id: 6, check_in_date: "2026-11-10", check_out_date: "2026-11-15", num_guests: 1, status: "confirmed", creation_date: "2026-09-10 14:00:00", cancellation_date: null, rooms: [{ room_number: 101, nightly_price: 85 }] },
  { reservation_id: 15, client_id: 7, check_in_date: "2026-11-20", check_out_date: "2026-11-25", num_guests: 2, status: "confirmed", creation_date: "2026-09-15 09:00:00", cancellation_date: null, rooms: [{ room_number: 202, nightly_price: 125 }] },
  { reservation_id: 16, client_id: 8, check_in_date: "2026-12-01", check_out_date: "2026-12-05", num_guests: 4, status: "confirmed", creation_date: "2026-10-01 10:00:00", cancellation_date: null, rooms: [{ room_number: 304, nightly_price: 280 }] },
  { reservation_id: 17, client_id: 9, check_in_date: "2026-12-10", check_out_date: "2026-12-14", num_guests: 2, status: "pending", creation_date: "2026-10-15 08:00:00", cancellation_date: null, rooms: [{ room_number: 205, nightly_price: 130 }] },
  { reservation_id: 18, client_id: 1, check_in_date: "2026-12-20", check_out_date: "2026-12-25", num_guests: 1, status: "pending", creation_date: "2026-10-15 09:00:00", cancellation_date: null, rooms: [{ room_number: 104, nightly_price: 92 }] },
  { reservation_id: 19, client_id: 2, check_in_date: "2026-12-28", check_out_date: "2027-01-02", num_guests: 3, status: "pending", creation_date: "2026-10-16 11:00:00", cancellation_date: null, rooms: [{ room_number: 103, nightly_price: 92 }] },
  { reservation_id: 20, client_id: 3, check_in_date: "2027-01-10", check_out_date: "2027-01-15", num_guests: 4, status: "pending", creation_date: "2026-10-17 10:00:00", cancellation_date: null, rooms: [{ room_number: 203, nightly_price: 145 }, { room_number: 305, nightly_price: 205 }] },
];

const services: Service[] = [
  { service_id: 1, service_name: "Spa", category: "Wellness", unit_price: 60 },
  { service_id: 2, service_name: "Restaurant", category: "Dining", unit_price: 35 },
  { service_id: 3, service_name: "Gym", category: "Wellness", unit_price: 20 },
  { service_id: 4, service_name: "Pool", category: "Wellness", unit_price: 15 },
];

const serviceBookings: ServiceBooking[] = [
  { booking_id: 1, reservation_id: 1, service_id: 1, quantity: 1, booking_date: "2026-01-12", status: "completed" },
  { booking_id: 2, reservation_id: 1, service_id: 2, quantity: 1, booking_date: "2026-01-13", status: "completed" },
  { booking_id: 3, reservation_id: 2, service_id: 4, quantity: 2, booking_date: "2026-01-21", status: "completed" },
  { booking_id: 4, reservation_id: 3, service_id: 3, quantity: 1, booking_date: "2026-02-02", status: "completed" },
  { booking_id: 5, reservation_id: 3, service_id: 1, quantity: 2, booking_date: "2026-02-05", status: "completed" },
  { booking_id: 6, reservation_id: 5, service_id: 2, quantity: 2, booking_date: "2026-03-03", status: "completed" },
  { booking_id: 7, reservation_id: 6, service_id: 1, quantity: 4, booking_date: "2026-03-11", status: "completed" },
  { booking_id: 8, reservation_id: 8, service_id: 4, quantity: 2, booking_date: "2026-04-22", status: "completed" },
];

const invoiceLines: InvoiceLine[] = [
  { invoice_line_id: 1, description: "Room 101 (single) - 5 nights", quantity: 5, unit_price: 80, category: "accommodation" },
  { invoice_line_id: 2, description: "Spa session", quantity: 1, unit_price: 60, category: "services" },
  { invoice_line_id: 3, description: "Restaurant dinner", quantity: 1, unit_price: 35, category: "services" },
  { invoice_line_id: 4, description: "Room 201 (double) - 5 nights", quantity: 5, unit_price: 120, category: "accommodation" },
  { invoice_line_id: 5, description: "Room 202 (double) - 5 nights", quantity: 5, unit_price: 120, category: "accommodation" },
  { invoice_line_id: 6, description: "Pool access x2", quantity: 2, unit_price: 15, category: "services" },
  { invoice_line_id: 7, description: "Room 301 (suite) - 7 nights", quantity: 7, unit_price: 250, category: "accommodation" },
  { invoice_line_id: 8, description: "Gym session", quantity: 1, unit_price: 20, category: "services" },
  { invoice_line_id: 9, description: "Spa session x2", quantity: 2, unit_price: 60, category: "services" },
  { invoice_line_id: 10, description: "Room 102 (single) - 2 nights", quantity: 2, unit_price: 80, category: "accommodation" },
  { invoice_line_id: 11, description: "Room 203 (double) - 4 nights", quantity: 4, unit_price: 140, category: "accommodation" },
  { invoice_line_id: 12, description: "Restaurant lunch x2", quantity: 2, unit_price: 35, category: "services" },
  { invoice_line_id: 13, description: "Room 302 (suite) - 5 nights", quantity: 5, unit_price: 250, category: "accommodation" },
  { invoice_line_id: 14, description: "Spa session x4", quantity: 4, unit_price: 60, category: "services" },
  { invoice_line_id: 15, description: "Room 103 (single) - 3 nights", quantity: 3, unit_price: 90, category: "accommodation" },
  { invoice_line_id: 16, description: "Room 204 (double) - 5 nights", quantity: 5, unit_price: 140, category: "accommodation" },
  { invoice_line_id: 17, description: "Pool access x2", quantity: 2, unit_price: 15, category: "services" },
  { invoice_line_id: 18, description: "Room 104 (single) - 2 nights", quantity: 2, unit_price: 90, category: "accommodation" },
  { invoice_line_id: 19, description: "Room 303 (suite) - 5 nights", quantity: 5, unit_price: 320, category: "accommodation" },
];

const payments: Payment[] = [
  { payment_id: 1, amount: 484, payment_date: "2026-01-16 10:00:00", method: "card" },
  { payment_id: 2, amount: 1000, payment_date: "2026-02-09 09:00:00", method: "bank_transfer" },
  { payment_id: 3, amount: 942, payment_date: "2026-02-09 09:30:00", method: "bank_transfer" },
  { payment_id: 4, amount: 679.7, payment_date: "2026-03-06 11:00:00", method: "cash" },
  { payment_id: 5, amount: 297, payment_date: "2026-04-05 10:00:00", method: "card" },
  { payment_id: 6, amount: 700, payment_date: "2026-01-26 14:00:00", method: "mobile_money" },
  { payment_id: 7, amount: 500, payment_date: "2026-03-16 09:00:00", method: "cash" },
];

const invoiceRows = [
  { invoice_id: 1, reservation_id: 1, total_amount: 484, status: "paid", lineIds: [1, 2, 3], paymentIds: [1] },
  { invoice_id: 2, reservation_id: 2, total_amount: 1386, status: "partially_paid", lineIds: [4, 5, 6], paymentIds: [6] },
  { invoice_id: 3, reservation_id: 3, total_amount: 1942, status: "paid", lineIds: [7, 8, 9], paymentIds: [2, 3] },
  { invoice_id: 4, reservation_id: 4, total_amount: 176, status: "due", lineIds: [10], paymentIds: [] },
  { invoice_id: 5, reservation_id: 5, total_amount: 679.7, status: "paid", lineIds: [11, 12], paymentIds: [4] },
  { invoice_id: 6, reservation_id: 6, total_amount: 1430, status: "partially_paid", lineIds: [13, 14], paymentIds: [7] },
  { invoice_id: 7, reservation_id: 7, total_amount: 297, status: "paid", lineIds: [15], paymentIds: [5] },
  { invoice_id: 8, reservation_id: 8, total_amount: 792, status: "due", lineIds: [16, 17], paymentIds: [] },
  { invoice_id: 9, reservation_id: 9, total_amount: 207.9, status: "due", lineIds: [18], paymentIds: [] },
  { invoice_id: 10, reservation_id: 10, total_amount: 1804, status: "due", lineIds: [19], paymentIds: [] },
] as const;

const invoices: Invoice[] = invoiceRows.map((row) => {
  const reservation = reservations.find((item) => item.reservation_id === row.reservation_id);
  const issueDate = reservation?.check_out_date ?? "2026-01-01";

  return {
    invoice_id: row.invoice_id,
    reservation_id: row.reservation_id,
    issue_date: issueDate,
    due_date: issueDate,
    status: row.status,
    total_amount: row.total_amount,
    tax_rate: 10,
    lines: invoiceLines.filter((line) => row.lineIds.some((lineId) => lineId === line.invoice_line_id)),
    payments: payments.filter((payment) => row.paymentIds.some((paymentId) => paymentId === payment.payment_id)),
  };
});

const reviews: Review[] = [
  { review_id: 1, reservation_id: 1, client_id: 1, rating: 5, comment: "Excellent stay! Very clean room and great service.", review_date: "2026-01-16" },
  { review_id: 2, reservation_id: 2, client_id: 2, rating: 4, comment: "Beautiful rooms, the pool was amazing.", review_date: "2026-01-26" },
  { review_id: 3, reservation_id: 3, client_id: 3, rating: 3, comment: "Good stay overall, spa was worth it.", review_date: "2026-02-09" },
  { review_id: 4, reservation_id: 4, client_id: 4, rating: 2, comment: "Room was okay but service was slow.", review_date: "2026-02-18" },
  { review_id: 5, reservation_id: 5, client_id: 5, rating: 1, comment: "Disappointing experience, room was noisy.", review_date: "2026-03-06" },
  { review_id: 6, reservation_id: 7, client_id: 7, rating: 5, comment: "Perfect weekend, will definitely return!", review_date: "2026-04-05" },
];

function createMonthlyMetrics(): MonthlyMetric[] {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const operationalRoomCount = rooms.filter((room) => room.operational_status !== "out_of_service").length;

  return monthNames.map((month, monthIndex) => {
    const daysInMonth = new Date(Date.UTC(2026, monthIndex + 1, 0)).getUTCDate();
    let occupiedRoomNights = 0;
    let accommodation = 0;

    for (const reservation of reservations) {
      if (reservation.status === "cancelled") continue;
      for (const room of reservation.rooms) {
        const start = new Date(`${reservation.check_in_date}T00:00:00Z`);
        const end = new Date(`${reservation.check_out_date}T00:00:00Z`);
        for (let date = start; date < end; date = new Date(date.getTime() + 86_400_000)) {
          if (date.getUTCFullYear() === 2026 && date.getUTCMonth() === monthIndex) {
            occupiedRoomNights += 1;
            accommodation += room.nightly_price;
          }
        }
      }
    }

    const servicesTotal = serviceBookings.reduce((total, booking) => {
      const bookingDate = new Date(`${booking.booking_date}T00:00:00Z`);
      if (bookingDate.getUTCFullYear() !== 2026 || bookingDate.getUTCMonth() !== monthIndex) return total;
      const service = services.find((item) => item.service_id === booking.service_id);
      return total + (service?.unit_price ?? 0) * booking.quantity;
    }, 0);

    return {
      month,
      occupancy: Math.round((occupiedRoomNights / (operationalRoomCount * daysInMonth)) * 100),
      accommodation,
      services: servicesTotal,
      miscellaneous: 0,
    };
  });
}

export const dashboardData: DashboardData = {
  rooms,
  guests,
  reservations,
  services,
  serviceBookings,
  invoices,
  reviews,
  monthlyMetrics: createMonthlyMetrics(),
};
