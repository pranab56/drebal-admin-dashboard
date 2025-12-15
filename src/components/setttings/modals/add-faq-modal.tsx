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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import TipTapEditor from '../../../TipTapEditor/TipTapEditor';
import { BaseModalProps, FAQ } from '../settingsType';

interface AddFAQModalProps extends BaseModalProps {
  onAdd: (faq: Omit<FAQ, '_id' | 'createdAt' | 'updatedAt' | 'type'>, faqType: 'user' | 'vanue') => void;
  currentTab: 'user' | 'vanue';
}

export const AddFAQModal = ({ onClose, onAdd, currentTab }: AddFAQModalProps) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [faqType, setFaqType] = useState<'user' | 'vanue'>(currentTab);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    question: '',
    answer: '',
    faqType: ''
  });

  const validateForm = (): boolean => {
    const newErrors = {
      question: '',
      answer: '',
      faqType: ''
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

    // FAQ Type validation
    if (!faqType) {
      newErrors.faqType = 'Please select FAQ type';
    }

    setErrors(newErrors);
    return !newErrors.question && !newErrors.answer && !newErrors.faqType;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      onAdd({
        question: question.trim(),
        answer,
        faqType
      }, faqType);
      // Note: The modal will be closed by the parent component after successful creation
    } catch (error) {
      console.error('Error adding FAQ:', error);
      alert('Failed to add FAQ. Please try again.');
      setIsLoading(false);
    }
  };

  const handleQuestionChange = (value: string) => {
    setQuestion(value);
    if (errors.question) {
      setErrors(prev => ({ ...prev, question: '' }));
    }
  };

  const handleAnswerChange = (newAnswer: string) => {
    setAnswer(newAnswer);
    if (errors.answer) {
      setErrors(prev => ({ ...prev, answer: '' }));
    }
  };

  const handleTypeChange = (value: 'user' | 'vanue') => {
    setFaqType(value);
    if (errors.faqType) {
      setErrors(prev => ({ ...prev, faqType: '' }));
    }
  };

  const isAnswerEmpty = (htmlContent: string): boolean => {
    const textContent = htmlContent.replace(/<[^>]*>/g, '').trim();
    return textContent.length === 0;
  };

  const isFormValid = question.trim().length >= 5 &&
    !isAnswerEmpty(answer) &&
    answer.replace(/<[^>]*>/g, '').trim().length >= 10 &&
    faqType;

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
          {/* FAQ Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="faqType" className="text-sm font-semibold">
              FAQ Type *
            </Label>
            <Select value={faqType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select FAQ type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User FAQ</SelectItem>
                <SelectItem value="vanue">Venue FAQ</SelectItem>
              </SelectContent>
            </Select>
            {errors.faqType && (
              <p className="text-sm text-destructive">{errors.faqType}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Select whether this FAQ is for users or venues
            </p>
          </div>

          {/* Question Input */}
          <div className="space-y-2">
            <Label htmlFor="question" className="text-sm font-semibold">
              FAQ Question *
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

          {/* Answer Editor */}
          <div className="space-y-2">
            <Label htmlFor="answer" className="text-sm font-semibold">
              Answer *
            </Label>
            <TipTapEditor
              content={answer}
              onChange={handleAnswerChange}
              placeholder="Provide a detailed answer..."
            />
            {errors.answer && (
              <p className="text-sm text-destructive">{errors.answer}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Provide a detailed answer with formatting if needed
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-3 sm:justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isLoading}
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