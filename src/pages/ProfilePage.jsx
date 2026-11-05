import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { Camera, Check } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user.name || '',
    userName: user.userName || '',
    email: user.email || '',
    password: user.password || '••••••••',
    dob: user.dob || '',
    presentAddress: user.presentAddress || '',
    permanentAddress: user.permanentAddress || '',
    city: user.city || '',
    postalCode: user.postalCode || '',
    country: user.country || '',
    avatarUrl: user.avatarUrl || '',
  });

  const [isSaving, setIsSaving] = useState(false);

  // Sync state if user changes
  useEffect(() => {
    setFormData({
      name: user.name || '',
      userName: user.userName || '',
      email: user.email || '',
      password: user.password || '••••••••',
      dob: user.dob || '',
      presentAddress: user.presentAddress || '',
      permanentAddress: user.permanentAddress || '',
      city: user.city || '',
      postalCode: user.postalCode || '',
      country: user.country || '',
      avatarUrl: user.avatarUrl || '',
    });
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultUrl = reader.result;
        setFormData((prev) => ({ ...prev, avatarUrl: resultUrl }));
        updateProfile({ avatarUrl: resultUrl });
        addToast({ message: 'Profile photo updated!', type: 'success' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      updateProfile(formData);
      setIsSaving(false);
      addToast({
        message: 'Profile updated successfully!',
        type: 'success',
      });
    }, 300);
  };

  return (
    <div className="bg-white rounded-3xl border border-surface-border shadow-card p-6 sm:p-8 animate-in fade-in duration-200">
      {/* Hidden file input for photo upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        accept="image/*"
        className="hidden"
      />

      {/* Tab Navigation header */}
      <div className="flex items-center gap-6 border-b border-surface-border pb-4 mb-8">
        <button className="text-sm font-bold text-primary border-b-2 border-primary pb-4 -mb-4">
          Edit Profile
        </button>
        <button className="text-sm font-semibold text-dark-body hover:text-dark-heading pb-4 -mb-4 transition-colors">
          Preferences
        </button>
        <button className="text-sm font-semibold text-dark-body hover:text-dark-heading pb-4 -mb-4 transition-colors">
          Security
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-3 w-full lg:w-44 flex-shrink-0">
          <div className="relative group">
            <img
              src={formData.avatarUrl || user.avatarUrl}
              alt={formData.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover ring-4 ring-primary-light"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Change photo"
              className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary-hover transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center">
            <h4 className="font-bold text-sm text-dark-heading">{formData.name}</h4>
            <p className="text-xs text-dark-body">{formData.email}</p>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit} className="flex-1 w-full space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              label="User Name"
              value={formData.userName}
              onChange={(e) =>
                setFormData({ ...formData, userName: e.target.value })
              }
              required
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <Input
              label="Date of Birth"
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            />

            <Input
              label="Present Address"
              value={formData.presentAddress}
              onChange={(e) =>
                setFormData({ ...formData, presentAddress: e.target.value })
              }
            />

            <Input
              label="Permanent Address"
              value={formData.permanentAddress}
              onChange={(e) =>
                setFormData({ ...formData, permanentAddress: e.target.value })
              }
            />

            <Input
              label="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />

            <Input
              label="Postal Code"
              value={formData.postalCode}
              onChange={(e) =>
                setFormData({ ...formData, postalCode: e.target.value })
              }
            />

            <Input
              label="Country"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full sm:w-auto min-w-[140px]"
              isLoading={isSaving}
              icon={Check}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
