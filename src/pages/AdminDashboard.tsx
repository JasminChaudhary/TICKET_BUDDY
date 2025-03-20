import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Users, Ticket, BarChart3, Settings, Plus, Trash2, Edit2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import ExhibitionModal from '@/components/ExhibitionModal';

// Interfaces
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

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

interface Transaction {
  _id: string;
  userId: string;
  userName: string;
  visitDate: string;
  tickets: Array<{
    name: string;
    quantity: number;
    price: number;
    isExhibition: boolean;
  }>;
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface Analytics {
  totalUsers: number;
  totalTransactions: number;
  totalRevenue: number;
  activeExhibitions: number;
  recentTransactions: Transaction[];
  popularExhibitions: Array<{
    name: string;
    ticketCount: number;
    revenue: number;
  }>;
}

const AdminDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isAddingExhibition, setIsAddingExhibition] = useState(false);
  const [editingExhibition, setEditingExhibition] = useState<Exhibition | null>(null);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user || !token || user.role !== 'admin') {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access the admin dashboard.',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }
      await fetchDashboardData();
    };

    checkAdminAccess();
  }, [user, token, navigate]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch all data in parallel
      const [usersRes, exhibitionsRes, transactionsRes, analyticsRes] = await Promise.all([
        axios.get('/api/admin/users', { headers }),
        axios.get('/api/admin/exhibitions', { headers }),
        axios.get('/api/admin/transactions', { headers }),
        axios.get('/api/admin/analytics', { headers }),
      ]);

      setUsers(usersRes.data.users);
      setExhibitions(exhibitionsRes.data.exhibitions);
      setTransactions(transactionsRes.data.transactions);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setLoaded(true), 100);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(user => user._id !== userId));
      toast({ title: 'Success', description: 'User deleted successfully.' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteExhibition = async (exhibitionId: string) => {
    if (!confirm('Are you sure you want to delete this exhibition?')) return;

    try {
      await axios.delete(`/api/admin/exhibitions/${exhibitionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExhibitions(exhibitions.filter(exh => exh._id !== exhibitionId));
      toast({ title: 'Success', description: 'Exhibition deleted successfully.' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete exhibition. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleAddExhibition = async () => {
    setIsAddingExhibition(true);
  };

  const handleEditExhibition = (exhibition: Exhibition) => {
    setEditingExhibition(exhibition);
  };

  const handleExhibitionSuccess = async () => {
    await fetchDashboardData();
  };

  return (
    <div className="container max-w-7xl py-20">
      <div className="space-y-8">
        {/* Page Title */}
        <div className="text-center animate-fade-in">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-museum-900 dark:text-white mb-4">
            Admin Dashboard
          </h1>
          <p className="text-museum-600 dark:text-museum-300 max-w-2xl mx-auto">
            Manage users, exhibitions, and view analytics
          </p>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className={cn("border-museum-200 dark:border-museum-700", loaded && "animate-scale-in")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-museum-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalUsers || 0}</div>
            </CardContent>
          </Card>
          <Card className={cn("border-museum-200 dark:border-museum-700", loaded && "animate-scale-in")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Ticket className="h-4 w-4 text-museum-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalTransactions || 0}</div>
            </CardContent>
          </Card>
          <Card className={cn("border-museum-200 dark:border-museum-700", loaded && "animate-scale-in")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-museum-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${analytics?.totalRevenue?.toFixed(2) || '0.00'}</div>
            </CardContent>
          </Card>
          <Card className={cn("border-museum-200 dark:border-museum-700", loaded && "animate-scale-in")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Exhibitions</CardTitle>
              <Settings className="h-4 w-4 text-museum-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.activeExhibitions || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Card className={cn("border-museum-200 dark:border-museum-700", loaded && "animate-scale-in")}>
          <CardHeader>
            <CardTitle>Management Panel</CardTitle>
            <CardDescription>Manage users, exhibitions, and view transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="mb-6 bg-museum-100 dark:bg-museum-800">
                <TabsTrigger value="users" className="data-[state=active]:bg-accent-700 data-[state=active]:text-white">
                  Users
                </TabsTrigger>
                <TabsTrigger value="exhibitions" className="data-[state=active]:bg-accent-700 data-[state=active]:text-white">
                  Exhibitions
                </TabsTrigger>
                <TabsTrigger value="transactions" className="data-[state=active]:bg-accent-700 data-[state=active]:text-white">
                  Transactions
                </TabsTrigger>
              </TabsList>

              {/* Users Tab */}
              <TabsContent value="users">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div
                        key={user._id}
                        className="p-6 rounded-lg bg-museum-50 dark:bg-museum-800 border border-museum-100 dark:border-museum-700"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium text-museum-900 dark:text-white">{user.name}</h3>
                            <p className="text-sm text-museum-500 dark:text-museum-400">{user.email}</p>
                            <p className="text-xs text-museum-500 dark:text-museum-400">
                              Joined: {format(new Date(user.createdAt), 'PP')}
                            </p>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Exhibitions Tab */}
              <TabsContent value="exhibitions">
                <div className="mb-4">
                  <Button
                    onClick={() => setIsAddingExhibition(true)}
                    className="bg-accent-700 hover:bg-accent-800 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Exhibition
                  </Button>
                </div>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {exhibitions.map((exhibition) => (
                      <div
                        key={exhibition._id}
                        className="p-6 rounded-lg bg-museum-50 dark:bg-museum-800 border border-museum-100 dark:border-museum-700"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-museum-900 dark:text-white">{exhibition.name}</h3>
                            <p className="text-sm text-museum-500 dark:text-museum-400">{exhibition.description}</p>
                            <div className="mt-2 space-y-1">
                              <p className="text-xs text-museum-500 dark:text-museum-400">
                                {format(new Date(exhibition.startDate), 'PP')} - {format(new Date(exhibition.endDate), 'PP')}
                              </p>
                              <p className="text-xs text-museum-500 dark:text-museum-400">
                                Price: ${exhibition.price.toFixed(2)}
                              </p>
                              <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                exhibition.status === 'active'
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                              }`}>
                                {exhibition.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingExhibition(exhibition)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteExhibition(exhibition._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Transactions Tab */}
              <TabsContent value="transactions">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction._id}
                        className="p-6 rounded-lg bg-museum-50 dark:bg-museum-800 border border-museum-100 dark:border-museum-700"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-museum-900 dark:text-white">{transaction.userName}</h3>
                            <p className="text-sm text-museum-500 dark:text-museum-400">
                              Visit Date: {format(new Date(transaction.visitDate), 'PP')}
                            </p>
                            <div className="mt-2 space-y-1">
                              {transaction.tickets.map((ticket, index) => (
                                <p key={index} className="text-xs text-museum-500 dark:text-museum-400">
                                  {ticket.name} x {ticket.quantity} - ${(ticket.price * ticket.quantity).toFixed(2)}
                                </p>
                              ))}
                              <p className="text-sm font-medium text-museum-900 dark:text-white">
                                Total: ${transaction.totalPrice.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            transaction.status === 'confirmed'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          }`}>
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Add ExhibitionModal */}
      <ExhibitionModal
        isOpen={isAddingExhibition}
        onClose={() => setIsAddingExhibition(false)}
        onSuccess={handleExhibitionSuccess}
        token={token || ''}
      />
      
      <ExhibitionModal
        isOpen={!!editingExhibition}
        onClose={() => setEditingExhibition(null)}
        exhibition={editingExhibition || undefined}
        onSuccess={handleExhibitionSuccess}
        token={token || ''}
      />
    </div>
  );
};

export default AdminDashboard; 