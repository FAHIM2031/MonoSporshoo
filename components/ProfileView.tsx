import React, { useRef } from 'react';
import { UserData } from '../types';
import { AuthService } from '../services/auth';

interface ProfileViewProps {
  user: UserData;
  avatarUrl: string;
  onUpdateUser: (user: UserData) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, avatarUrl, onUpdateUser }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const updatedUser = AuthService.updateProfilePicture(user.phone, base64String);
        if (updatedUser) {
          onUpdateUser(updatedUser);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-8 animate-fade-in px-2">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-[#9ba29a] to-[#6d8a7c] relative">
          <div className="absolute -bottom-16 left-16">
            <div 
              className="relative group w-40 h-40 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden cursor-pointer"
              onClick={handleAvatarClick}
              title="Change Profile Picture"
            >
              <img src={avatarUrl} className="w-full h-full object-cover transition-opacity group-hover:opacity-75" alt="Profile avatar" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                <span className="text-white font-bold text-xs uppercase tracking-widest">Change</span>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>
        <div className="pt-20 pb-10 px-16">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-4xl font-black text-gray-900 leading-tight">{user.name}</h2>
              <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mt-1">MonoSporsho Ally</p>
              <div className="mt-6 grid grid-cols-2 gap-x-12 gap-y-4">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase">Email Address</p>
                  <p className="font-bold text-gray-700">{user.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase">Phone Number</p>
                  <p className="font-bold text-gray-700">{user.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase">Age</p>
                  <p className="font-bold text-gray-700">{user.age}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase">Gender</p>
                  <p className="font-bold text-gray-700">{user.gender}</p>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100 grid grid-cols-2 gap-x-12">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase">Member Since</p>
                  <p className="font-bold text-gray-700">
                    {user.registrationDate ? new Date(user.registrationDate).toLocaleDateString([], { dateStyle: 'long' }) : '—'}
                  </p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">
                    {user.registrationDate ? new Date(user.registrationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase">Last Login</p>
                  <p className="font-bold text-gray-700">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString([], { dateStyle: 'long' }) : '—'}
                  </p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
