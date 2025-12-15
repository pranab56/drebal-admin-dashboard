"use client";

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAboutMutation, useGetAboutQuery } from '../../../features/settings/settingsApi';
import TipTapEditor from '../../../TipTapEditor/TipTapEditor';
import { BaseModalProps } from '../settingsType';

export const AboutUsModal = ({ onClose }: BaseModalProps) => {
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('About Us');
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch about us data
  const {
    data: aboutData,
    isLoading: isFetching,
    isError: isFetchError,
    refetch: refetchAboutData,
  } = useGetAboutQuery({});

  // Update mutation
  const [updateAbout, {
    isLoading: isUpdating,
  }] = useAboutMutation();

  useEffect(() => {
    setIsInitialized(false);
  }, []);

  // Set initial data from API
  useEffect(() => {
    if (aboutData?.success && aboutData?.data && !isInitialized) {
      console.log('Setting about data:', aboutData.data);
      setContent(aboutData.data.content || '');
      setTitle(aboutData.data.title || 'About Us');
      setIsInitialized(true);
    }
  }, [aboutData, isInitialized]);

  // Force refetch when modal opens
  useEffect(() => {
    const fetchData = async () => {
      try {
        await refetchAboutData().unwrap();
      } catch (error) {
        console.error('Error fetching about us:', error);
      }
    };
    fetchData();
  }, [refetchAboutData]);

  const isContentEmpty = (htmlContent: string): boolean => {
    if (!htmlContent) return true;
    const textContent = htmlContent.replace(/<[^>]*>/g, '').trim();
    return textContent.length === 0;
  };

  const isFormValid = (): boolean => {
    if (!title.trim()) {
      alert('Title cannot be empty');
      return false;
    }

    if (isContentEmpty(content)) {
      alert('About us content cannot be empty');
      return false;
    }

    return true;
  };

  const handleUpdate = async () => {
    if (!isFormValid()) {
      return;
    }

    try {
      // Prepare data for API - check your API documentation for the correct structure
      // For about us, it might be "type": "about" or "type": "about_us"
      const requestData = {
        type: "about_us", // or "about_us" - check your API
        title: title.trim(),
        content: content
      };
      const response = await updateAbout(requestData).unwrap();
      if (response.success) {
        toast.success(response.message || 'About us content updated successfully!');
        await refetchAboutData();
      } else {
        toast.error(response.message || 'Failed to update about us content');
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

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };


  // Show loading while fetching data
  if (isFetching && !isInitialized) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">About Us</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading about us content...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Show error if fetch fails
  if (isFetchError) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">About Us</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-center">
              <p className="text-destructive mb-4">Failed to load about us content</p>
              <Button
                onClick={() => refetchAboutData()}
                variant="outline"
              >
                Retry
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">About Us</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Content Editor */}
          <div className="flex-1 overflow-hidden">
            <TipTapEditor
              content={aboutData?.data.content || content}
              onChange={handleContentChange}
              placeholder="Write your about us content here..."
            />
          </div>
        </div>

        <DialogFooter className="flex gap-3 sm:justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpdate}
            disabled={isContentEmpty(content) || !title.trim() || isUpdating}
            className="flex-1"
          >
            {isUpdating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Updating...
              </span>
            ) : (
              'Update'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};