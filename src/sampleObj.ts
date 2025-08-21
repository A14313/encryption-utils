const sampleObj = {
	users: [
		{
			id: 1,
			name: 'Alice Johnson',
			email: 'alice.johnson@example.com',
			age: 28,
			address: {
				street: '123 Maple St',
				city: 'Springfield',
				state: 'IL',
				zip: '62701',
			},
			preferences: {
				newsletter: true,
				notifications: ['email', 'sms'],
				theme: 'dark',
			},
			orders: [
				{
					orderId: 'ORD-001',
					date: '2024-01-12',
					total: 199.99,
					items: [
						{ sku: 'SKU-001', name: 'Laptop', price: 999.99, qty: 1 },
						{ sku: 'SKU-002', name: 'Mouse', price: 29.99, qty: 2 },
					],
				},
				{
					orderId: 'ORD-002',
					date: '2024-03-03',
					total: 49.99,
					items: [{ sku: 'SKU-003', name: 'Keyboard', price: 49.99, qty: 1 }],
				},
			],
		},
		{
			id: 2,
			name: 'Bob Smith',
			email: 'bob.smith@example.com',
			age: 35,
			address: {
				street: '456 Oak Ave',
				city: 'Columbus',
				state: 'OH',
				zip: '43004',
			},
			preferences: {
				newsletter: false,
				notifications: ['push'],
				theme: 'light',
			},
			orders: [
				{
					orderId: 'ORD-003',
					date: '2024-02-22',
					total: 149.49,
					items: [
						{ sku: 'SKU-004', name: 'Headphones', price: 99.99, qty: 1 },
						{ sku: 'SKU-005', name: 'USB Cable', price: 9.99, qty: 5 },
					],
				},
			],
		},
		{
			id: 3,
			name: 'Charlie Davis',
			email: 'charlie.davis@example.com',
			age: 41,
			address: {
				street: '789 Pine Rd',
				city: 'Austin',
				state: 'TX',
				zip: '73301',
			},
			preferences: {
				newsletter: true,
				notifications: ['email'],
				theme: 'dark',
			},
			orders: [
				{
					orderId: 'ORD-004',
					date: '2024-04-15',
					total: 89.95,
					items: [
						{ sku: 'SKU-006', name: 'Notebook', price: 4.99, qty: 5 },
						{ sku: 'SKU-007', name: 'Pen Set', price: 19.99, qty: 2 },
					],
				},
			],
		},
	],
	products: [
		{ sku: 'SKU-001', name: 'Laptop', category: 'Electronics', price: 999.99, stock: 12 },
		{ sku: 'SKU-002', name: 'Mouse', category: 'Electronics', price: 29.99, stock: 150 },
		{ sku: 'SKU-003', name: 'Keyboard', category: 'Electronics', price: 49.99, stock: 90 },
		{ sku: 'SKU-004', name: 'Headphones', category: 'Electronics', price: 99.99, stock: 60 },
		{ sku: 'SKU-005', name: 'USB Cable', category: 'Accessories', price: 9.99, stock: 500 },
		{ sku: 'SKU-006', name: 'Notebook', category: 'Stationery', price: 4.99, stock: 200 },
		{ sku: 'SKU-007', name: 'Pen Set', category: 'Stationery', price: 19.99, stock: 75 },
		{ sku: 'SKU-008', name: 'Desk Lamp', category: 'Furniture', price: 39.99, stock: 30 },
		{ sku: 'SKU-009', name: 'Chair', category: 'Furniture', price: 149.99, stock: 20 },
		{ sku: 'SKU-010', name: 'Monitor', category: 'Electronics', price: 199.99, stock: 25 },
	],
	settings: {
		siteName: 'ShopEase',
		version: '1.0.0',
		maintenance: false,
		supportedLanguages: ['en', 'es', 'fr', 'de', 'jp'],
		features: {
			recommendations: true,
			giftCards: true,
			liveChat: false,
			beta: {
				experimentalCheckout: true,
				aiAssistant: false,
			},
		},
	},
	logs: [
		{ timestamp: '2024-06-01T10:00:00Z', level: 'INFO', message: 'Server started' },
		{ timestamp: '2024-06-01T10:05:23Z', level: 'WARN', message: 'Low stock on SKU-002' },
		{ timestamp: '2024-06-01T10:10:45Z', level: 'ERROR', message: 'Payment gateway timeout' },
		{ timestamp: '2024-06-01T10:15:00Z', level: 'INFO', message: 'New user registered: Alice' },
		{ timestamp: '2024-06-01T10:20:30Z', level: 'INFO', message: 'Order ORD-004 processed' },
	],
};

export default sampleObj;
