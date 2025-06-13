
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Refunds = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Navbar />
      
      <div className="pt-24 pb-16 bg-sky-50">
        <div className="section-container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4">
              Politica Rimborsi
            </h1>
            <p className="text-navy-600 max-w-2xl mx-auto text-lg">
              Informazioni dettagliate sulla nostra politica di rimborso per prenotazioni e servizi.
            </p>
          </div>

          <div className="max-w-4xl mx-auto prose prose-lg">
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">Politica Generale</h2>
              <p className="text-gray-700 mb-4">
                I rimborsi per le prenotazioni di voli sono soggetti ai termini e alle condizioni della compagnia aerea specifica. 
                Indus Viaggi facilita il processo di rimborso ma non determina l'ammissibilità o l'importo del rimborso.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">Voli Rimborsabili</h2>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>I biglietti completamente rimborsabili possono essere cancellati con rimborso completo</li>
                <li>Potrebbero essere applicate commissioni di elaborazione</li>
                <li>Il rimborso verrà elaborato entro 7-14 giorni lavorativi</li>
                <li>Il rimborso sarà accreditato sulla carta utilizzata per l'acquisto</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">Voli Non Rimborsabili</h2>
              <p className="text-gray-700 mb-4">
                Per i biglietti non rimborsabili:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Nessun rimborso in contanti disponibile</li>
                <li>Potrebbero essere disponibili crediti di viaggio</li>
                <li>Le tasse aeroportuali potrebbero essere rimborsabili</li>
                <li>Consulta sempre i termini specifici della tariffa</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">Cancellazioni da Parte della Compagnia Aerea</h2>
              <p className="text-gray-700 mb-4">
                In caso di cancellazione del volo da parte della compagnia aerea:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Hai diritto al rimborso completo indipendentemente dal tipo di biglietto</li>
                <li>Puoi scegliere il re-booking senza costi aggiuntivi</li>
                <li>Potrebbero essere disponibili compensazioni aggiuntive secondo le normative EU261</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">Come Richiedere un Rimborso</h2>
              <ol className="list-decimal pl-6 text-gray-700 mb-4">
                <li>Contatta il nostro servizio clienti con i dettagli della prenotazione</li>
                <li>Fornisci la documentazione necessaria (es. certificato medico se applicabile)</li>
                <li>Compila il modulo di richiesta rimborso</li>
                <li>Attendi la conferma di elaborazione</li>
                <li>Il rimborso verrà processato secondo i termini della compagnia aerea</li>
              </ol>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">Commissioni di Servizio</h2>
              <p className="text-gray-700 mb-4">
                Le commissioni di servizio di Indus Viaggi sono generalmente non rimborsabili, 
                eccetto nei casi in cui l'errore sia attribuibile al nostro servizio.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">Contatti per Rimborsi</h2>
              <p className="text-gray-700 mb-4">
                Per assistenza con i rimborsi:
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> indusviaggi@gmail.com<br/>
                <strong>Telefono/WhatsApp:</strong> +39 388 822 0982<br/>
                <strong>Ufficio: </strong> 0522 434 627<br/>
                <strong>Indirizzo: </strong> Via Don Giovanni Alai 6/A Reggio Emilia, RE 42121<br/>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Refunds;
