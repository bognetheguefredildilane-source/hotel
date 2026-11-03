import { ArrowRight, BedDouble, Coffee, MapPin, Sparkles, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import styles from "./home.module.css";

const highlights = [
  {
    icon: BedDouble,
    title: "Des chambres accueillantes",
    description: "Des espaces confortables pour vous reposer et profiter pleinement de votre séjour.",
  },
  {
    icon: Coffee,
    title: "Des services attentionnés",
    description: "Restauration, bien-être et petites attentions pour rendre chaque visite spéciale.",
  },
  {
    icon: MapPin,
    title: "Un séjour sans souci",
    description: "Une équipe disponible pour vous accompagner à chaque étape de votre séjour.",
  },
];

export default function HomePage() {
  return (
    <main className={styles.home}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Grand Palace Hotel, accueil">
          <span className={styles.brandIcon}><BedDouble size={20} /></span>
          <span>
            <strong>Grand Palace</strong>
            <small>Hotel &amp; Suites</small>
          </span>
        </Link>
        <nav className={styles.navigation} aria-label="Navigation principale">
          <a href="#about">L’hôtel</a>
          <a href="#highlights">Nos services</a>
        </nav>
        <Link className={styles.dashboardLink} href="/dashboard">
          Espace gestion <ArrowRight size={16} />
        </Link>
      </header>

      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}><Sparkles size={14} /> Bienvenue au Grand Palace</span>
          <h1 id="hero-title">Le confort d’un séjour, <span>l’attention d’une maison.</span></h1>
          <p>
            Découvrez un lieu pensé pour votre repos, avec des chambres confortables et une équipe
            heureuse de vous accueillir.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="#highlights">
              Découvrir l’hôtel <ArrowRight size={17} />
            </a>
            <Link className={styles.secondaryButton} href="/dashboard">Accéder au tableau de bord</Link>
          </div>
          <div className={styles.rating}>
            <span className={styles.stars} aria-label="5 étoiles">
              {Array.from({ length: 5 }, (_, index) => <Star key={index} size={15} fill="currentColor" />)}
            </span>
            <span>Un accueil chaleureux, à chaque séjour</span>
          </div>
        </div>
        <div className={styles.heroArt}>
          <Image
            className={styles.heroImage}
            src="/hote.avif"
            alt="Vue de l’hôtel Grand Palace"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 45vw"
          />
          <div className={styles.artLabel}><span /> Votre séjour commence ici</div>
        </div>
      </section>

      <section className={styles.intro} id="about">
        <div>
          <span className={styles.sectionEyebrow}>Grand Palace Hotel &amp; Suites</span>
          <h2>Un accueil simple. Un séjour mémorable.</h2>
        </div>
        <p>
          Que vous soyez ici pour vous détendre ou pour vos activités, nous mettons tout en œuvre
          pour que vous vous sentiez bien dès votre arrivée.
        </p>
      </section>

      <section className={styles.highlights} id="highlights" aria-label="Les atouts de l’hôtel">
        {highlights.map(({ icon: Icon, title, description }, index) => (
          <article className={styles.highlightCard} key={title}>
            <span className={styles.highlightIcon}><Icon size={20} /></span>
            <span className={styles.cardIndex}>0{index + 1}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </section>

      <footer className={styles.footer}>
        <Link className={styles.footerBrand} href="/">
          <BedDouble size={17} /> Grand Palace Hotel &amp; Suites
        </Link>
        <span>Nous serons ravis de vous accueillir.</span>
        <Link href="/dashboard">Espace gestion <ArrowRight size={14} /></Link>
      </footer>
    </main>
  );
}