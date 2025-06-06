
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, New York, NY 10001',
    dateOfBirth: '1990-01-01',
    passportNumber: 'A12345678',
    emergencyContact: 'Jane Doe - +1 (555) 987-6543'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Mock save operation
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-navy-900 mb-2">My Profile</h1>
            <p className="text-navy-600">Manage your personal information and travel preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture & Basic Info */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-24 h-24 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-12 w-12 text-gold-600" />
                </div>
                <h3 className="text-xl font-semibold text-navy-900 mb-1">
                  {profile.firstName} {profile.lastName}
                </h3>
                <p className="text-gray-600 mb-4">{profile.email}</p>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "outline" : "default"}
                  className={isEditing ? "" : "bg-gold-500 hover:bg-gold-600 text-white"}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
                <h4 className="font-semibold text-navy-900 mb-4">Travel Stats</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Countries Visited</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Flights</span>
                    <span className="font-medium">28</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Miles Earned</span>
                    <span className="font-medium">25,420</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-medium">2022</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-navy-900 mb-6">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <User className="h-4 w-4 inline mr-1" />
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <User className="h-4 w-4 inline mr-1" />
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Mail className="h-4 w-4 inline mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Phone className="h-4 w-4 inline mr-1" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      Address
                    </label>
                    <input
                      type="text"
                      value={profile.address}
                      onChange={(e) => setProfile({...profile, address: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => setProfile({...profile, dateOfBirth: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                    <input
                      type="text"
                      value={profile.passportNumber}
                      onChange={(e) => setProfile({...profile, passportNumber: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                    <input
                      type="text"
                      value={profile.emergencyContact}
                      onChange={(e) => setProfile({...profile, emergencyContact: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                    />
                  </div>
                </div>
                
                {isEditing && (
                  <div className="mt-6 flex gap-4">
                    <Button
                      onClick={handleSave}
                      className="bg-gold-500 hover:bg-gold-600 text-white"
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;
