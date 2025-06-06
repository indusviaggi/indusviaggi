
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Cancellations = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Navbar />
      
      <div className="pt-24 pb-16 bg-sky-50">
        <div className="section-container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4">
              Politica Cancellazioni
            </h1>
            <p className="text-navy-600 max-w-2xl mx-auto text-lg">
              Tutto quello che devi sapere sulle cancellazioni di voli e le procedure da seguire.
            </p>
          </div>

          <div className="max-w-4xl mx-auto prose prose-lg">
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">Cancellazione Entro 24 Ore</h2>
              <p className="text-gray-700 mb-4">
                Per la maggior parte delle prenotazioni, puoi cancellare gratuitamente entro 24 ore dall'acquisto, 
                purché il volo sia programmato per almeno 7 giorni dopo la data di prenotazione.
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Cancellazione gratuita entro 24 ore</li>
                <li>Rimborso completo sulla carta originale</li>
                <li>Nessuna commissione di elaborazione</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">Cancellazione Oltre 24 Ore</h2>
              <p className="text-gray-700 mb-4">
                Dopo il periodo di grazia di 24 ore, le cancellazioni sono soggette ai termini della tariffa acquistata:
              </p>
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold text-navy-900 mb-2">Tariffe Flessibili</h3>
                  <ul className="text-gray-700 text-sm">
                    <li>• Cancellazione consentita</li>
                    <li>• Commissioni ridotte</li>
                    <li>• Credito di viaggio disponibile</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold text-navy-900 mb-2">Tariffe Economy</h3>
                  <ul className="text-gray-700 text-sm">
                    <li>• Commissioni di cancellazione elevate</li>
                    <li>• Possibile perdita del valore del biglietto</li>
                    <li>• Solo tasse rimborsabili</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">Cancellazioni per Motivi di Salute</h2>
              <p className="text-gray-700 mb-4">
                In caso di emergenze mediche documentate:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Certificato medico richiesto</li>
                <li>Possibili esenzioni dalle commissioni</li>
                <li>Valutazione caso per caso</li>
                <li>Documentazione deve essere fornita entro 14 giorni</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">Cancellazioni da Parte della Compagnia</h2>
              <p className="text-gray-700 mb-4">
                Quando la compagnia aerea cancella il tuo volo:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Rimborso completo automatico</li>
                <li>Re-booking gratuito su volo alternativo</li>
                <li>Possibile compensazione secondo EU261</li>
                <li>Assistenza per hotel e pasti se necessario</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">Come Cancellare</h2>
              <ol className="list-decimal pl-6 text-gray-700 mb-4">
                <li>Accedi al tuo account su Indus Viaggi</li>
                <li>Trova la prenotazione nella sezione "I Miei Viaggi"</li>
                <li>Seleziona "Cancella Prenotazione"</li>
                <li>Rivedi le commissioni applicabili</li>
                <li>Conferma la cancellazione</li>
                <li>Riceverai una email di conferma</li>
              </ol>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">Tempi di Elaborazione</h2>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold text-navy-900">Cancellazione Immediata</h3>
                  <p className="text-gray-700 text-sm mt-2">Entro 24 ore: 1-3 giorni lavorativi</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-bold text-navy-900">Cancellazione Standard</h3>
                  <p className="text-gray-700 text-sm mt-2">Oltre 24 ore: 7-14 giorni lavorativi</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-bold text-navy-900">Rimborso Carta</h3>
                  <p className="text-gray-700 text-sm mt-2">Dipende dalla banca: 5-10 giorni</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">Assistenza Cancellazioni</h2>
              <p className="text-gray-700 mb-4">
                Il nostro team è disponibile per assistenza:
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> cancellazioni@indusviaggi.com<br/>
                <strong>Telefono:</strong> +39 02 1234 5678<br/>
                <strong>Chat Live:</strong> Disponibile 24/7 sul sito web<br/>
                <strong>WhatsApp:</strong> +39 333 123 4567
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cancellations;
