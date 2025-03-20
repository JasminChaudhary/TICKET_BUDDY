import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import { format } from 'date-fns';

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

const AdminDashboard = () => {
  const [showAddExhibition, setShowAddExhibition] = useState(false);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    activeExhibitions: 0
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    price: '',
    status: 'active',
    imageUrl: ''
  });

  useEffect(() => {
    fetchStats();
    fetchExhibitions();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, transactionsRes, exhibitionsRes] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/transactions'),
        axios.get('/api/admin/exhibitions')
      ]);

      setStats({
        totalUsers: usersRes.data.users.length,
        totalTransactions: transactionsRes.data.transactions.length,
        activeExhibitions: exhibitionsRes.data.exhibitions.filter((ex: Exhibition) => ex.status === 'active').length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard statistics',
        variant: 'destructive',
      });
    }
  };

  const fetchExhibitions = async () => {
    try {
      const response = await axios.get('/api/admin/exhibitions');
      setExhibitions(response.data.exhibitions);
    } catch (error) {
      console.error('Error fetching exhibitions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load exhibitions',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.imageUrl) {
        toast({
          title: 'Error',
          description: 'Please enter an image URL',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      console.log('Submitting exhibition with data:', formData);

      // Send the exhibition data
      const response = await axios.post('/api/admin/exhibitions', {
        name: formData.name,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        price: Number(formData.price),
        status: formData.status,
        imageUrl: formData.imageUrl
      });

      console.log('Response from server:', response.data);

      toast({
        title: 'Success',
        description: 'Exhibition created successfully',
      });

      // Reset form and close dialog
      setFormData({
        name: '',
        description: '',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
        price: '',
        status: 'active',
        imageUrl: ''
      });
      setImagePreview(null);
      setShowAddExhibition(false);
      fetchExhibitions();
    } catch (error: any) {
      console.error('Error creating exhibition:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create exhibition';
      console.error('Error message:', errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this exhibition?')) {
      try {
        await axios.delete(`/api/admin/exhibitions/${id}`);
        toast({
          title: 'Success',
          description: 'Exhibition deleted successfully',
        });
        fetchExhibitions();
      } catch (error) {
        console.error('Error deleting exhibition:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete exhibition',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="container max-w-7xl py-10">
      <h1 className="font-display text-4xl font-bold text-museum-900 dark:text-white mb-8">
        Admin Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-museum-500 dark:text-museum-400">Total Users</h3>
          <p className="text-3xl font-bold text-museum-900 dark:text-white mt-2">{stats.totalUsers}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-museum-500 dark:text-museum-400">Total Transactions</h3>
          <p className="text-3xl font-bold text-museum-900 dark:text-white mt-2">{stats.totalTransactions}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-museum-500 dark:text-museum-400">Active Exhibitions</h3>
          <p className="text-3xl font-bold text-museum-900 dark:text-white mt-2">{stats.activeExhibitions}</p>
        </Card>
      </div>

      {/* Management Panel */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-museum-900 dark:text-white">Management Panel</h2>
          <Button onClick={() => setShowAddExhibition(true)}>Add Exhibition</Button>
        </div>

        <div className="space-y-6">
          {/* Exhibition List */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-museum-200 dark:border-museum-700">
                  <th className="text-left py-3 px-4">Image</th>
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Dates</th>
                  <th className="text-left py-3 px-4">Price</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exhibitions.map((exhibition) => (
                  <tr key={exhibition._id} className="border-b border-museum-200 dark:border-museum-700">
                    <td className="py-3 px-4">
                      <img 
                        src={exhibition.imageUrl} 
                        alt={exhibition.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </td>
                    <td className="py-3 px-4">{exhibition.name}</td>
                    <td className="py-3 px-4">
                      {new Date(exhibition.startDate).toLocaleDateString()} - {new Date(exhibition.endDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">${exhibition.price}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs ${
                        exhibition.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-museum-100 text-museum-800 dark:bg-museum-900 dark:text-museum-200'
                      }`}>
                        {exhibition.status.charAt(0).toUpperCase() + exhibition.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(exhibition._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Add Exhibition Dialog */}
      <Dialog open={showAddExhibition} onOpenChange={setShowAddExhibition}>
        <DialogContent className="sm:max-w-[500px] z-50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add New Exhibition</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <Input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => {
                  const url = e.target.value.trim();
                  setFormData({ ...formData, imageUrl: url });
                  if (url) {
                    setImagePreview(url);
                  } else {
                    setImagePreview(null);
                  }
                }}
                placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                required
              />
              {imagePreview && (
                <div className="mt-4">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full max-h-40 object-cover rounded-md"
                    onError={(e) => {
                      console.error('Image failed to load:', imagePreview);
                      e.currentTarget.style.display = 'none';
                      setImagePreview(null);
                      toast({
                        title: 'Warning',
                        description: 'Image URL may be invalid or inaccessible. You can still submit, but please verify the URL.',
                        variant: 'destructive',
                      });
                    }}
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select 
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowAddExhibition(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard; 