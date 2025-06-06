
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="section-container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4">
              Termini e Condizioni
            </h1>
            <p className="text-navy-600 max-w-2xl mx-auto text-lg">
              I termini e le condizioni che disciplinano l'uso dei nostri servizi di viaggio.
            </p>
          </div>

          <div className="max-w-4xl mx-auto prose prose-lg">
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">1. Accettazione dei Termini</h2>
              <p className="text-gray-700 mb-4">
                Utilizzando i servizi di Indus Viaggi, accetti di essere vincolato da questi termini e condizioni. 
                Se non accetti questi termini, non utilizzare i nostri servizi.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">2. Servizi Offerti</h2>
              <p className="text-gray-700 mb-4">
                Indus Viaggi fornisce servizi di prenotazione voli e consulenza di viaggio. Non siamo una compagnia aerea 
                e agiamo come intermediari tra te e i fornitori di servizi di viaggio.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">3. Prenotazioni e Pagamenti</h2>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Tutte le prenotazioni sono soggette alla disponibilità</li>
                <li>I prezzi possono variare fino alla conferma del pagamento</li>
                <li>Il pagamento completo è richiesto al momento della prenotazione</li>
                <li>Tutte le tariffe sono soggette ai termini della compagnia aerea</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">4. Cancellazioni e Modifiche</h2>
              <p className="text-gray-700 mb-4">
                Le cancellazioni e le modifiche sono soggette ai termini e alle condizioni della compagnia aerea 
                e possono comportare costi aggiuntivi. Ti consigliamo di consultare la politica di cancellazione 
                specifica prima di effettuare la prenotazione.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">5. Responsabilità</h2>
              <p className="text-gray-700 mb-4">
                Indus Viaggi non è responsabile per ritardi, cancellazioni o altri problemi causati dalle compagnie aeree 
                o da altri fornitori di servizi. La nostra responsabilità è limitata al costo del servizio di prenotazione.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">6. Comportamento dell'Utente</h2>
              <p className="text-gray-700 mb-4">
                Gli utenti si impegnano a:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Fornire informazioni accurate durante la prenotazione</li>
                <li>Rispettare i termini delle compagnie aeree e degli altri fornitori</li>
                <li>Non utilizzare i nostri servizi per attività illegali</li>
                <li>Trattare il personale con rispetto</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">7. Modifiche ai Termini</h2>
              <p className="text-gray-700 mb-4">
                Ci riserviamo il diritto di modificare questi termini in qualsiasi momento. 
                Le modifiche entreranno in vigore dalla data di pubblicazione sul nostro sito web.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 text-sm">
              Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;
