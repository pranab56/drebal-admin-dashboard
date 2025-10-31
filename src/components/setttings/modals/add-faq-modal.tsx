"use client";

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import TipTapEditor from '../../../TipTapEditor/TipTapEditor';
import { BaseModalProps, FAQ } from '../settingsType';

interface AddFAQModalProps extends BaseModalProps {
  onAdd: (faq: Omit<FAQ, 'id'>) => void;
}

export const AddFAQModal = ({ onClose, onAdd }: AddFAQModalProps) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('<p>Provide a detailed answer...</p>');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    question: '',
    answer: ''
  });

  const validateForm = (): boolean => {
    const newErrors = {
      question: '',
      answer: ''
    };

    // Question validation
    if (!question.trim()) {
      newErrors.question = 'Question is required';
    } else if (question.trim().length < 5) {
      newErrors.question = 'Question must be at least 5 characters long';
    }

    // Answer validation
    const answerText = answer.replace(/<[^>]*>/g, '').trim();
    if (!answerText) {
      newErrors.answer = 'Answer is required';
    } else if (answerText.length < 10) {
      newErrors.answer = 'Answer must be at least 10 characters long';
    }

    setErrors(newErrors);
    return !newErrors.question && !newErrors.answer;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      onAdd({
        question: question.trim(),
        answer
      });
    } catch (error) {
      console.error('Error adding FAQ:', error);
      alert('Failed to add FAQ. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionChange = (value: string) => {
    setQuestion(value);
    // Clear error when user starts typing
    if (errors.question) {
      setErrors(prev => ({ ...prev, question: '' }));
    }
  };

  const handleAnswerChange = (newAnswer: string) => {
    setAnswer(newAnswer);
    // Clear error when user starts typing
    if (errors.answer) {
      setErrors(prev => ({ ...prev, answer: '' }));
    }
  };

  const isAnswerEmpty = (htmlContent: string): boolean => {
    const textContent = htmlContent.replace(/<[^>]*>/g, '').trim();
    return textContent.length === 0;
  };

  const isFormValid = question.trim().length >= 5 &&
    !isAnswerEmpty(answer) &&
    answer.replace(/<[^>]*>/g, '').trim().length >= 10;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New FAQ</DialogTitle>
          <DialogDescription>
            Create a frequently asked question to help users understand your service better.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question" className="text-sm font-semibold">
              FAQ Question
            </Label>
            <Input
              id="question"
              type="text"
              placeholder="Enter the question here"
              value={question}
              onChange={(e) => handleQuestionChange(e.target.value)}
              className={errors.question ? 'border-destructive' : ''}
            />
            {errors.question && (
              <p className="text-sm text-destructive">{errors.question}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {question.length}/5 characters (minimum 5 required)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="answer" className="text-sm font-semibold">
              Answer
            </Label>
            <TipTapEditor
              content={answer}
              onChange={handleAnswerChange}
              placeholder="Provide a detailed answer..."
            />
            {errors.answer && (
              <p className="text-sm text-destructive">{errors.answer}</p>
            )}
          </div>
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
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
            className="flex-1"
          >
            {isLoading ? 'Adding...' : 'Add FAQ'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};