import { Star } from "lucide-react";
import { GuestReviewCard, PanelHeader } from "../components";
import type { DashboardData } from "../data";
import styles from "../dashboard.module.css";

interface ReviewsSectionProps {
  data: DashboardData;
  getGuestName: (clientId: number) => string;
}

export default function ReviewsSection({ data, getGuestName }: ReviewsSectionProps) {
  const reviews = data.reviews.slice().sort((a, b) => b.review_date.localeCompare(a.review_date));
  const averageRating = (data.reviews.reduce((sum, review) => sum + review.rating, 0) / Math.max(data.reviews.length, 1)).toFixed(1);

  return (
    <>
      <section className={styles.sectionHeading} id="reviews">
        <div><h2>Avis clients</h2><p>Retours récents associés aux séjours terminés (BR-16, BR-17).</p></div>
      </section>
      <section className={styles.panel} aria-label="Avis clients récents">
        <PanelHeader
          title="Avis récents"
          subtitle={`${data.reviews.length} avis dans la base de données`}
          action={<span className={styles.reviewRating}><Star size={14} fill="currentColor" /> {averageRating} / 5</span>}
        />
        <div className={styles.reviewList}>
          {reviews.map((review) => {
            const reservation = data.reservations.find((item) => item.reservation_id === review.reservation_id);
            return (
              <GuestReviewCard
                key={review.review_id}
                name={getGuestName(review.client_id)}
                date={review.review_date}
                room={reservation?.rooms[0]?.room_number ?? 0}
                rating={review.rating}
                comment={review.comment}
              />
            );
          })}
        </div>
      </section>
    </>
  );
}
