import { useState } from 'react';
import apiFetch from '@/utils/apiFetch';
import { Send, Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      toast({
        title: "Email non valida",
        description: "Inserisci un indirizzo email valido.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/mail/send-mail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: formData.email,
          type: 'query',
          name: formData.name,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        toast({
          title: "Errore",
          description: "Impossibile inviare il messaggio. Riprova più tardi.",
          variant: "destructive",
          duration: 5000,
        });
        setIsSubmitting(false);
        return;
      }

      setShowSuccessDialog(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore di rete.",
        variant: "destructive",
        duration: 5000,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-50 rounded-full translate-y-1/3 -translate-x-1/4" />
      
      <div className="section-container relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">Contattaci</h2>
            <p className="text-navy-600 max-w-2xl mx-auto">
              Hai domande sui nostri pacchetti di viaggio o hai bisogno di assistenza per la prenotazione? 
              I nostri esperti di viaggio sono qui per aiutarti a pianificare la tua fuga perfetta.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow flex items-start space-x-4">
                <div className="bg-sky-50 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-sky-500" />
                </div>
                <div>
                  <h3 className="text-navy-900 font-semibold mb-2">Scrivici</h3>
                  <a href="mailto:info@indusviaggi.com" className="text-navy-600 hover:text-gold-500 transition-colors">
                    indusviaggi@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow flex items-start space-x-4">
                <div className="bg-gold-50 p-3 rounded-lg">
                  <Phone className="h-6 w-6 text-gold-500" />
                </div>
                <div>
                  <h3 className="text-navy-900 font-semibold mb-2">Chiamaci</h3>
                  <a href="tel:+1234567890" className="text-navy-600 hover:text-gold-500 transition-colors">
                    +39 388 822 0982
                    <br></br>
                    +39 0522 434 627
                  </a>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow flex items-start space-x-4">
                <div className="bg-navy-50 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-navy-500" />
                </div>
                <div>
                  <h3 className="text-navy-900 font-semibold mb-2">Visitaci</h3>
                  <p className="text-navy-600">
                    Via Don Giovanni Alai 6/A<br />
                    Reggio Emilia, RE 42121
                  </p>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-navy-900 font-medium mb-2">Il Tuo Nome</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      placeholder="Mario Rossi"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-navy-900 font-medium mb-2">La Tua Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      placeholder="mario@esempio.com"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="subject" className="block text-navy-900 font-medium mb-2">Oggetto</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  >
                    <option value="">Seleziona un oggetto</option>
                    <option value="booking">Prenotazione Volo</option>
                    <option value="package">Pacchetto Viaggio</option>
                    <option value="inquiry">Richiesta Generale</option>
                    <option value="support">Assistenza Clienti</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-navy-900 font-medium mb-2">Messaggio</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    placeholder="Come possiamo aiutarti?"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-accent w-full flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>Invio in corso...</>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Invia Messaggio
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Messaggio Inviato!</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-gray-600">
              Grazie per averci contattato! Ti risponderemo il prima possibile.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ContactSection;
