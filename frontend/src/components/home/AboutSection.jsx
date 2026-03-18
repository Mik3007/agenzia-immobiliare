import fotoChiSono from "../../assets/images/sectionChiSono.jpg";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

/**
 * =========================
 * ABOUT SECTION (CHI SONO)
 * =========================
 * Sezione descrittiva dell’agente immobiliare.
 * 
 * Struttura:
 * - Colonna sinistra: immagine
 * - Colonna destra: testo descrittivo
 * 
 * Animazioni:
 * - Entrata da sinistra (immagine)
 * - Entrata da destra (testo)
 */
export default function AboutSection() {
  return (
    <section
      id="about" // anchor per navigazione
      className="px-4 py-20 bg-transparent"
    >
      {/* Container principale con grid responsive */}
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-start">

        {/* =========================
            IMMAGINE
        ========================= */}
        <motion.div
          className="w-full overflow-hidden rounded-3xl bg-[#dddddd]"
          initial={{ opacity: 0, x: -40 }} // partenza fuori a sinistra
          whileInView={{ opacity: 1, x: 0 }} // entrata in viewport
          viewport={{ once: true }} // animazione eseguita una sola volta
          transition={{ duration: 0.6 }}
        >
          <img
            src={fotoChiSono} // immagine importata
            alt="Chi sono"
            className="w-full object-cover object-[center_40%] h-72 sm:h-80 md:h-105 lg:h-120"
            loading="lazy" // lazy loading per performance
          />
        </motion.div>

        {/* =========================
            TESTO
        ========================= */}
        <motion.div
          initial={{ opacity: 0, x: 40 }} // partenza da destra
          whileInView={{ opacity: 1, x: 0 }} // entrata in viewport
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }} // leggero ritardo rispetto immagine
        >
          {/* Titolo */}
          <h2 className="text-2xl font-semibold text-[#282828]">
            Chi sono
          </h2>

          {/* Descrizione */}
          <p className="mt-4 text-sm leading-relaxed text-[#99997b]">
            Sono un agente immobiliare con oltre dieci anni di esperienza
            reale sul campo, costruita collaborando con diverse agenzie e
            vivendo ogni giorno trattative, sfide e relazioni che mi hanno
            insegnato cosa significa davvero fare questo lavoro. Il mio
            percorso nasce dall’esperienza diretta e dal contatto continuo
            con le persone, perché prima ancora degli immobili vengono
            sempre le storie e le esigenze di chi mi sceglie. Nel tempo ho
            capito che vendere o comprare casa non è solo una questione
            tecnica o economica: è un passaggio importante nella vita di una
            persona. Per questo metto al centro sia il cliente venditore che
            il cliente acquirente, accompagnandoli con attenzione, ascolto e
            trasparenza in ogni fase del percorso. Con i venditori lavoro
            per valorizzare al massimo l’immobile, costruendo strategie
            mirate e realistiche che permettano di raggiungere il miglior
            risultato possibile senza illusioni o promesse irrealistiche.
            Con gli acquirenti, invece, il mio obiettivo è offrire guida,
            chiarezza e sicurezza, aiutandoli a orientarsi tra dubbi, scelte
            e opportunità, affinché possano fare un passo così importante
            con serenità e consapevolezza. Negli anni ho sviluppato un modo
            di lavorare che unisce esperienza pratica, approccio umano e
            strumenti moderni, perché credo che professionalità e relazione
            debbano andare insieme. Ogni incarico rappresenta per me una
            responsabilità reale: non si tratta solo di concludere una
            trattativa, ma di costruire un rapporto basato sulla fiducia e
            sul rispetto reciproco. E se vi state chiedendo se il prezzo di
            una casa è trattabile, la mia risposta è sempre la stessa: il
            prezzo è trattabile solo se vi piace.
          </p>
        </motion.div>

      </div>
    </section>
  );
}