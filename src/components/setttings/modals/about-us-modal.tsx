"use client";

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import TipTapEditor from '../../../TipTapEditor/TipTapEditor';
import { BaseModalProps } from '../settingsType';

export const AboutUsModal = ({ onClose }: BaseModalProps) => {
  const [content, setContent] = useState<string>(`
    <h2>About Our Company</h2>
    
  `);

  const [isLoading, setIsLoading] = useState(false);

  const isContentEmpty = (htmlContent: string): boolean => {
    // Remove HTML tags and check if there's any text content
    const textContent = htmlContent.replace(/<[^>]*>/g, '').trim();
    return textContent.length === 0;
  };

  const handleUpdate = async () => {
    if (isContentEmpty(content)) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to update about us content
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Here you would typically send the content to your backend
      console.log('Updated about us content:', content);

      // Show success message
      alert('About us content updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating about us content:', error);
      alert('Failed to update about us content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">About Us</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <TipTapEditor
            content={content}
            onChange={handleContentChange}
            placeholder="Write your about us content here..."
          />
        </div>

        <DialogFooter className="flex gap-3 sm:justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpdate}
            disabled={isContentEmpty(content) || isLoading}
            className="flex-1"
          >
            {isLoading ? 'Updating...' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};