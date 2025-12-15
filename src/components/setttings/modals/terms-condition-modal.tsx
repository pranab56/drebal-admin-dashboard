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
import { useGetTermsAndConditionsQuery, useTermsAndConditionsMutation } from '../../../features/settings/settingsApi';
import TipTapEditor from '../../../TipTapEditor/TipTapEditor';
import { BaseModalProps } from '../settingsType';

export const TermsConditionModal = ({ onClose }: BaseModalProps) => {
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('Terms and Conditions');

  // Fetch terms and conditions data
  const {
    data: termsData,
    isLoading: isFetching,
    isError: isFetchError,
    refetch
  } = useGetTermsAndConditionsQuery({});

  // Update mutation
  const [updateTerms, {
    isLoading: isUpdating,
  }] = useTermsAndConditionsMutation();

  useEffect(() => {
    if (termsData?.success && termsData?.data) {
      // Set content and title from API response
      setContent(termsData.data.content || '');
      setTitle(termsData.data.title || 'Terms and Conditions');
    }
  }, [termsData]);

  const isContentEmpty = (htmlContent: string): boolean => {
    const textContent = htmlContent.replace(/<[^>]*>/g, '').trim();
    return textContent.length === 0;
  };

  const isFormValid = (): boolean => {
    if (!title.trim()) {
      alert('Title cannot be empty');
      return false;
    }

    if (isContentEmpty(content)) {
      alert('Terms and conditions content cannot be empty');
      return false;
    }

    return true;
  };

  const handleUpdate = async () => {
    if (!isFormValid()) {
      return;
    }

    try {
      // Prepare data for API
      const requestData = {
        type: "terms_and_conditions",
        title: title.trim(),
        content: content
      };

      // Call the mutation
      const response = await updateTerms(requestData).unwrap();

      if (response.success) {
        toast.success(response.message || 'Terms and conditions updated successfully!');
        await refetch();
      } else {
        toast.error(response.message || 'Failed to update terms and conditions');
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
  if (isFetching) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Terms and Conditions</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading terms and conditions...</p>
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
            <DialogTitle className="text-2xl">Terms and Conditions</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-center">
              <p className="text-destructive mb-4">Failed to load terms and conditions</p>
              <Button
                onClick={() => refetch()}
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
          <DialogTitle className="text-2xl">Terms and Conditions</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex-1 overflow-hidden">
            <TipTapEditor
              content={termsData?.data.content || content}
              onChange={handleContentChange}
              placeholder="Write your terms and conditions content here..."
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