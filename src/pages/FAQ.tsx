
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "Come posso prenotare un volo su Indus Viaggi?",
      answer: "Puoi prenotare un volo utilizzando il nostro motore di ricerca nella homepage. Inserisci le tue date di viaggio, destinazione e numero di passeggeri, quindi scegli tra le opzioni disponibili."
    },
    {
      question: "Posso cancellare la mia prenotazione?",
      answer: "Sì, puoi cancellare la tua prenotazione seguendo i termini e le condizioni della compagnia aerea. Controlla la tua email di conferma per i dettagli sulla politica di cancellazione."
    },
    {
      question: "Come posso modificare la mia prenotazione?",
      answer: "Le modifiche alle prenotazioni dipendono dalla politica della compagnia aerea. Contatta il nostro servizio clienti per assistenza nelle modifiche."
    },
    {
      question: "Quali metodi di pagamento accettate?",
      answer: "Accettiamo tutte le principali carte di credito, carte di debito e PayPal per rendere il processo di pagamento sicuro e conveniente."
    },
    {
      question: "Come posso contattare il servizio clienti?",
      answer: "Puoi contattarci tramite email, telefono o chat dal vivo. I nostri dettagli di contatto sono disponibili nella sezione Contatti del nostro sito web."
    },
    {
      question: "Offrite assicurazione di viaggio?",
      answer: "Sì, offriamo opzioni di assicurazione di viaggio durante il processo di prenotazione per proteggere il tuo investimento di viaggio."
    },
    {
      question: "Posso scegliere il mio posto a sedere?",
      answer: "Sì, molte compagnie aeree permettono la selezione del posto durante il processo di prenotazione, anche se potrebbero applicarsi costi aggiuntivi."
    },
    {
      question: "Cosa succede se il mio volo viene cancellato?",
      answer: "Se il tuo volo viene cancellato, ti contatteremo immediatamente per rebooking o rimborso secondo la politica della compagnia aerea e i tuoi diritti come passeggero."
    }
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="section-container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4">
              Domande Frequenti
            </h1>
            <p className="text-navy-600 max-w-2xl mx-auto text-lg">
              Trova le risposte alle domande più comuni sui nostri servizi di viaggio.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4 bg-white rounded-lg shadow-md border border-gray-200">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                >
                  <h3 className="text-lg font-semibold text-navy-900 pr-4">
                    {faq.question}
                  </h3>
                  {openItems.includes(index) ? (
                    <ChevronUp className="h-5 w-5 text-gold-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gold-500 flex-shrink-0" />
                  )}
                </button>
                {openItems.includes(index) && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Non hai trovato quello che cercavi?
            </p>
            <a href="/contact" className="btn-accent">
              Contattaci
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQ;
