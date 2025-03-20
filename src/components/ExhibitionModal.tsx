import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';

interface Exhibition {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  imageUrl: string;
  status: 'active' | 'inactive';
}

interface ExhibitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  exhibition?: Exhibition;
  onSuccess: () => void;
  token: string;
}

const ExhibitionModal: React.FC<ExhibitionModalProps> = ({
  isOpen,
  onClose,
  exhibition,
  onSuccess,
  token,
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    price: string;
    imageUrl: string;
    status: 'active' | 'inactive';
  }>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    price: '',
    imageUrl: '',
    status: 'active',
  });

  useEffect(() => {
    if (exhibition) {
      setFormData({
        name: exhibition.name,
        description: exhibition.description,
        startDate: new Date(exhibition.startDate).toISOString().split('T')[0],
        endDate: new Date(exhibition.endDate).toISOString().split('T')[0],
        price: exhibition.price.toString(),
        imageUrl: exhibition.imageUrl,
        status: exhibition.status,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        price: '',
        imageUrl: '',
        status: 'active',
      });
    }
  }, [exhibition]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (exhibition) {
        await axios.put(
          `/api/admin/exhibitions/${exhibition._id}`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        toast({
          title: 'Success',
          description: 'Exhibition updated successfully.',
        });
      } else {
        await axios.post(
          '/api/admin/exhibitions',
          data,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        toast({
          title: 'Success',
          description: 'Exhibition created successfully.',
        });
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save exhibition. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{exhibition ? 'Edit Exhibition' : 'Add New Exhibition'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {exhibition ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExhibitionModal; 