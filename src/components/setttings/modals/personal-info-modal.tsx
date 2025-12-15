"use client";

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import Image from 'next/image';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { baseURL } from '../../../../utils/BaseURL';
import { useGetPersonalInformationQuery, useUpdatePersonalInformationMutation } from "../../../features/settings/settingsApi";
import { BaseModalProps, PersonalInfoForm } from '../settingsType';

interface ValidationErrors {
  name?: string;
  email?: string;
  contact?: string;
  image?: string;
}

export const PersonalInfoModal = ({ onClose }: BaseModalProps) => {
  // Initialize form with empty values
  const [formData, setFormData] = useState<PersonalInfoForm>({
    name: '',
    email: '',
    contact: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Fetch data from API
  const {
    data: personalInformation,
    isLoading: personalInformationLoading,
    isError: personalInformationError,
    refetch
  } = useGetPersonalInformationQuery({});

  // Update mutation
  const [updatePersonalInformation, {
    isLoading: updatePersonalInformationLoading,
  }] = useUpdatePersonalInformationMutation();

  // Helper function to get image URL
  const getImageUrl = () => {
    // If we have a data URL preview (from file upload), use it directly
    if (imagePreview && imagePreview.startsWith('data:image')) {
      return imagePreview;
    }

    // If we have a preview path that's not a data URL, combine with baseURL
    if (imagePreview && !imagePreview.startsWith('http')) {
      return baseURL + imagePreview;
    }

    // If we have a preview that's already a full URL, use it
    if (imagePreview) {
      return imagePreview;
    }

    // If we have stored image from API, combine with baseURL
    if (personalInformation?.data?.image && !personalInformation.data.image.startsWith('http')) {
      return baseURL + personalInformation.data.image;
    }

    // If stored image is already a full URL, use it
    if (personalInformation?.data?.image) {
      return personalInformation.data.image;
    }

    // Fallback to default image
    return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop';
  };

  // Populate form with API data when it loads
  useEffect(() => {
    if (personalInformation?.data) {
      const { data } = personalInformation;

      // Get name directly from API
      const name = data?.name || '';

      // Set form data
      setFormData({
        name: name,
        email: data.email || '',
        contact: data.personalInfo?.phone || ''
      });

      // Set image preview if exists
      if (data.image) {
        // Check if it's already a full URL or needs baseURL
        if (data.image.startsWith('http')) {
          setImagePreview(data.image);
        } else {
          setImagePreview(data.image); // Store just the path, we'll combine in getImageUrl()
        }
      }
    }
  }, [personalInformation]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
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
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(imageFile.type)) {
        newErrors.image = 'Please select a valid image (JPEG, PNG, GIF, WebP)';
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
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, image: 'Please select a valid image (JPEG, PNG, GIF, WebP)' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
        return;
      }

      setImageFile(file);
      setErrors(prev => ({ ...prev, image: undefined }));

      // Create preview as data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    // Reset to original image if exists
    if (personalInformation?.data?.image) {
      if (personalInformation.data.image.startsWith('http')) {
        setImagePreview(personalInformation.data.image);
      } else {
        setImagePreview(personalInformation.data.image); // Store just the path
      }
    } else {
      setImagePreview(''); // Clear to use default
    }
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

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();

      const personalInfo = {
        name: formData.name.trim(),
        personalInfo: {
          phone: formData.contact,
        }
      };
      formDataToSend.append('data', JSON.stringify(personalInfo));

      // Add image if selected
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      // Call the update mutation
      const response = await updatePersonalInformation(formDataToSend).unwrap();

      if (response.success) {
        toast.success(response.message || 'Profile updated successfully!');
        await refetch();
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error: unknown) {
      console.log('Login error:', error);

      // Type-safe error handling
      if (error instanceof Error) {
        // Now you can safely access error.message
        console.log('Error message:', error.message);
      }
    }
  };

  const getInitials = (name: string) => {
    if (!name.trim()) return 'JD'; // Default initials
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Loading state
  if (personalInformationLoading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Personal Information</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center h-40">
            <p>Loading profile information...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Error state
  if (personalInformationError) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Personal Information</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center h-40 space-y-4">
            <p className="text-destructive">Failed to load profile information</p>
            <Button onClick={() => refetch()} variant="outline">
              Retry
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const imageUrl = getImageUrl();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Personal Information</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <Avatar className="w-24 h-24">
              <Image
                src={imageUrl}
                width={1000}
                height={1000}
                className='w-32 h-32'
                alt="Profile"
                onError={(e) => {
                  // If image fails to load, fallback to default
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop';
                }}
              />
              <AvatarFallback className="text-lg">
                {getInitials(formData.name || personalInformation?.data?.name || '')}
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

            {/* Remove Image Button (only show if user uploaded a new image) */}
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

          <h2 className="text-xl font-semibold">
            {formData.name || personalInformation?.data?.name || 'User'}
          </h2>
          <p className="text-muted-foreground capitalize">
            {personalInformation?.data?.role?.toLowerCase() || 'User'}
          </p>

          {errors.image && (
            <p className="text-sm text-destructive mt-2">{errors.image}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={errors.name ? 'border-destructive' : ''}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              disabled
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={errors.email ? 'border-destructive' : ''}
              placeholder="Enter your email"
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
              placeholder="Enter your contact number"
            />
            {errors.contact && (
              <p className="text-sm text-destructive">{errors.contact}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={updatePersonalInformationLoading}
          >
            {updatePersonalInformationLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};