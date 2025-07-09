export const fakeDataService = {
  getFakeProfile: () => ({
    username: 'John Doe',
    currency: 'USD'
  }),

  getFakeCreditCards: () => [
    {
      id: 'fake-1',
      card_name: 'Chase Sapphire',
      card_number: '4532',
      card_type: 'Visa',
      credit_limit: 5000,
      current_balance: 1250,
      color_theme: '#4f46e5',
      due_date: '2024-03-15'
    },
    {
      id: 'fake-2',
      card_name: 'Amex Platinum',
      card_number: '3421',
      card_type: 'American Express',
      credit_limit: 10000,
      current_balance: 2800,
      color_theme: '#6b7280',
      due_date: '2024-03-20'
    }
  ],

  getFakeTransactions: () => [
    {
      id: 'fake-1',
      title: 'Grocery Shopping',
      amount: 156.80,
      type: 'expense',
      category: 'Food',
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: 'fake-2',
      title: 'Salary Credit',
      amount: 4200.00,
      type: 'income',
      category: 'Salary',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0]
    },
    {
      id: 'fake-3',
      title: 'Gas Station',
      amount: 68.50,
      type: 'expense',
      category: 'Transport',
      date: new Date(Date.now() - 172800000).toISOString().split('T')[0]
    },
    {
      id: 'fake-4',
      title: 'Online Shopping',
      amount: 249.99,
      type: 'expense',
      category: 'Shopping',
      date: new Date(Date.now() - 259200000).toISOString().split('T')[0]
    },
    {
      id: 'fake-5',
      title: 'Electricity Bill',
      amount: 127.30,
      type: 'expense',
      category: 'Bills',
      date: new Date(Date.now() - 345600000).toISOString().split('T')[0]
    },
    {
      id: 'fake-emi',
      title: 'Personal Loan',
      amount: 500,
      type: 'emi',
      category: 'personal',
      date: new Date().toISOString().split('T')[0],
      description: JSON.stringify({ loanAmount: 6000, tenureMonths: 12 })
    },
    {
      id: 'fake-investment',
      title: 'Stocks',
      amount: 2000,
      type: 'investment',
      category: 'stocks',
      date: new Date().toISOString().split('T')[0],
      description: JSON.stringify({ purchaseDate: new Date().toISOString().split('T')[0] })
    }
  ],

  getFakeWishes: () => [
    {
      id: 'fake-1',
      title: 'iPhone 15 Pro',
      description: 'Latest smartphone with advanced camera',
      target_amount: 1199,
      current_amount: 450,
      target_date: '2024-06-01',
      category: 'gadget',
    },
    {
      id: 'fake-2',
      title: 'MacBook Air',
      description: 'For work and creative projects',
      target_amount: 1299,
      current_amount: 800,
      target_date: '2024-08-15',
      category: 'gadget',
    },
    {
      id: 'fake-3',
      title: 'Vacation to Japan',
      description: 'Dream trip to Tokyo and Kyoto',
      target_amount: 3500,
      current_amount: 1200,
      target_date: '2024-12-01',
      category: 'travel',
    }
  ]
};
