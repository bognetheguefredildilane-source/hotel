import { dashboardData } from "./test-data";

export type RoomType = "simple" | "double" | "suite" | "familiale";
export type RoomStatus = "available" | "occupied" | "being_cleaned" | "out_of_service";
export type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type InvoiceStatus = "due" | "partially_paid" | "paid";

export interface Room {
  room_number: number;
  floor: number;
  room_type: RoomType;
  max_capacity: number;
  base_price: number;
  operational_status: RoomStatus;
  amenity_ids: number[];
}

export interface Guest {
  client_id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
}

export interface ReservedRoom {
  room_number: number;
  nightly_price: number;
}

export interface Reservation {
  reservation_id: number;
  client_id: number;
  check_in_date: string;
  check_out_date: string;
  num_guests: number;
  status: ReservationStatus;
  creation_date: string;
  cancellation_date: string | null;
  rooms: ReservedRoom[];
}

export interface Service {
  service_id: number;
  service_name: string;
  category: "Dining" | "Wellness" | "Transport" | "Laundry";
  unit_price: number;
}

export interface ServiceBooking {
  booking_id: number;
  reservation_id: number;
  service_id: number;
  quantity: number;
  booking_date: string;
  status: "confirmed" | "completed" | "cancelled";
}

export interface InvoiceLine {
  invoice_line_id: number;
  description: string;
  quantity: number;
  unit_price: number;
  category: "accommodation" | "services" | "miscellaneous";
}

export interface Payment {
  payment_id: number;
  amount: number;
  payment_date: string;
  method: "cash" | "card" | "mobile_money" | "bank_transfer";
}

export interface Invoice {
  invoice_id: number;
  reservation_id: number;
  issue_date: string;
  due_date: string;
  status: InvoiceStatus;
  total_amount?: number;
  tax_rate?: number;
  lines: InvoiceLine[];
  payments: Payment[];
}

export interface Review {
  review_id: number;
  reservation_id: number;
  client_id: number;
  rating: number;
  comment: string;
  review_date: string;
}

export interface MonthlyMetric {
  month: string;
  occupancy: number;
  accommodation: number;
  services: number;
  miscellaneous: number;
}

export interface DashboardData {
  rooms: Room[];
  guests: Guest[];
  reservations: Reservation[];
  services: Service[];
  serviceBookings: ServiceBooking[];
  invoices: Invoice[];
  reviews: Review[];
  monthlyMetrics: MonthlyMetric[];
}

export { dashboardData };

export async function loadDashboardData(): Promise<DashboardData> {
  return dashboardData;
}
