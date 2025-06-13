
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { formatDateLocal } from '../utils/formatDateLocal';

const Privacy = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Navbar />
      
      <div className="pt-24 pb-16 bg-sky-50">
        <div className="section-container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-navy-600 max-w-2xl mx-auto text-lg">
              La tua privacy è importante per noi. Leggi come raccogliamo, utilizziamo e proteggiamo i tuoi dati.
            </p>
          </div>

          <div className="max-w-4xl mx-auto prose prose-lg">
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">1. Informazioni che Raccogliamo</h2>
              <p className="text-gray-700 mb-4">
                Raccogliamo informazioni che ci fornisci direttamente, come quando crei un account, 
                effettui una prenotazione o ci contatti per assistenza. Questo include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Nome, indirizzo email e informazioni di contatto</li>
                <li>Informazioni di pagamento e fatturazione</li>
                <li>Dettagli del viaggio e preferenze</li>
                <li>Comunicazioni con il nostro team di supporto</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">2. Come Utilizziamo le Tue Informazioni</h2>
              <p className="text-gray-700 mb-4">
                Utilizziamo le informazioni raccolte per:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Fornire e migliorare i nostri servizi</li>
                <li>Elaborare prenotazioni e pagamenti</li>
                <li>Comunicare con te riguardo ai tuoi viaggi</li>
                <li>Inviare aggiornamenti e offerte promozionali (se acconsentito)</li>
                <li>Garantire la sicurezza e prevenire frodi</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">3. Condivisione delle Informazioni</h2>
              <p className="text-gray-700 mb-4">
                Non vendiamo, scambiamo o trasfeريamo le tue informazioni personali a terzi, 
                eccetto nei seguenti casi:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Con compagnie aeree e fornitori di servizi per completare le prenotazioni</li>
                <li>Con processori di pagamento per elaborare transazioni</li>
                <li>Quando richiesto dalla legge o per proteggere i nostri diritti</li>
                <li>Con il tuo consenso esplicito</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">4. Sicurezza dei Dati</h2>
              <p className="text-gray-700 mb-4">
                Implementiamo misure di sicurezza appropriate per proteggere le tue informazioni 
                personali contro accesso non autorizzato, alterazione, divulgazione o distruzione. 
                Questo include crittografia, controlli di accesso e monitoraggio regolare dei sistemi.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">5. I Tuoi Diritti</h2>
              <p className="text-gray-700 mb-4">
                Hai il diritto di:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Accedere alle tue informazioni personali</li>
                <li>Correggere informazioni inesatte</li>
                <li>Richiedere la cancellazione dei tuoi dati</li>
                <li>Opporti al trattamento dei tuoi dati</li>
                <li>Richiedere la portabilità dei dati</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">6. Cookie e Tecnologie Simili</h2>
              <p className="text-gray-700 mb-4">
                Utilizziamo cookie e tecnologie simili per migliorare la tua esperienza sul nostro sito, 
                analizzare il traffico e personalizzare i contenuti. Puoi gestire le preferenze dei 
                cookie nelle impostazioni del tuo browser.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">7. Modifiche a Questa Policy</h2>
              <p className="text-gray-700 mb-4">
                Potremmo aggiornare questa privacy policy periodicamente. Ti notificheremo 
                eventuali modifiche significative tramite email o attraverso un avviso sul nostro sito.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">8. Contattaci</h2>
              <p className="text-gray-700 mb-4">
                Se hai domande riguardo a questa privacy policy o al trattamento dei tuoi dati, 
                puoi contattarci all'indirizzo:
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> indusviaggi@gmail.com<br/>
                <strong>Telefono/WhatsApp:</strong> +39 388 822 0982<br/>
                <strong>Ufficio: </strong> 0522 434 627<br/>
                <strong>Indirizzo: </strong> Via Don Giovanni Alai 6/A Reggio Emilia, RE 42121<br/>
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 text-sm">
              Ultimo aggiornamento: {formatDateLocal(new Date(), 'IT')}
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy;
