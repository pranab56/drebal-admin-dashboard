"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { useState } from 'react';
import { BaseModalProps, PersonalInfoForm } from '../settingsType';

interface ValidationErrors {
  fullName?: string;
  email?: string;
  contact?: string;
  image?: string;
}

export const PersonalInfoModal = ({ onClose }: BaseModalProps) => {
  const [formData, setFormData] = useState<PersonalInfoForm>({
    fullName: 'James Don',
    email: 'emily@gmail.com',
    contact: '+99-01846875456'
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Contact number validation
    const contactRegex = /^\+?[\d\s-()]+$/;
    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    } else if (!contactRegex.test(formData.contact.replace(/\s/g, ''))) {
      newErrors.contact = 'Please enter a valid contact number';
    } else if (formData.contact.replace(/\D/g, '').length < 10) {
      newErrors.contact = 'Contact number must be at least 10 digits';
    }

    // Image validation (optional)
    if (imageFile) {
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validImageTypes.includes(imageFile.type)) {
        newErrors.image = 'Please select a valid image (JPEG, PNG, GIF)';
      }
      if (imageFile.size > 5 * 1024 * 1024) { // 5MB
        newErrors.image = 'Image size must be less than 5MB';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate image file
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validImageTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, image: 'Please select a valid image (JPEG, PNG, GIF)' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
        return;
      }

      setImageFile(file);
      setErrors(prev => ({ ...prev, image: undefined }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop');
    setErrors(prev => ({ ...prev, image: undefined }));
  };

  const handleInputChange = (field: keyof PersonalInfoForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Here you would typically send the data to your backend
      console.log('Form data:', { ...formData, imageFile });

      // Show success message or handle response
      alert('Profile updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Personal Information</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={imagePreview} alt="Profile" />
              <AvatarFallback className="text-lg">
                {getInitials(formData.fullName)}
              </AvatarFallback>
            </Avatar>

            {/* Image Upload Button */}
            <label htmlFor="image-upload" className="absolute bottom-0 right-0 bg-primary rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
              <Upload className="w-4 h-4 text-white" />
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {/* Remove Image Button */}
            {imageFile && (
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-0 right-0 bg-destructive rounded-full p-1 hover:bg-destructive/90 transition-colors"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            )}
          </div>

          <h2 className="text-xl font-semibold">{formData.fullName}</h2>
          <p className="text-muted-foreground">Admin</p>

          {errors.image && (
            <p className="text-sm text-destructive mt-2">{errors.image}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className={errors.fullName ? 'border-destructive' : ''}
            />
            {errors.fullName && (
              <p className="text-sm text-destructive">{errors.fullName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Contact number</Label>
            <Input
              id="contact"
              type="tel"
              value={formData.contact}
              onChange={(e) => handleInputChange('contact', e.target.value)}
              className={errors.contact ? 'border-destructive' : ''}
            />
            {errors.contact && (
              <p className="text-sm text-destructive">{errors.contact}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};