const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const crypto = require('crypto');

const app = express();

// Cấu hình CORS
app.use(cors());

app.options('*', cors());

app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Body: ${JSON.stringify(req.body)}`);
    next();
});

async function loadData(file) {
    try {
        const data = await fs.readFile(file, 'utf8');
        return data ? JSON.parse(data) : (file === 'services.json' ? {} : []);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error loading ${file}:`, error.message);
        return file === 'services.json' ? {} : [];
    }
}

async function saveData(file, data) {
    try {
        await fs.writeFile(file, JSON.stringify(data, null, 2), { flag: 'w' });
        console.log(`[${new Date().toISOString()}] Saved ${file} successfully`);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error saving ${file}:`, error.message);
        throw new Error(`Failed to save ${file}: ${error.message}`);
    }
}

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

app.get('/api/technicians', async (req, res) => {
    try {
        const technicians = await loadData('technicians.json');
        res.status(200).json(technicians);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching technicians', error: error.message });
    }
});

app.get('/api/services', async (req, res) => {
    try {
        const services = {
  "electrical": [
    {
      "id": 1,
      "name": "Sửa ổ cắm, công tắc bị hỏng",
      "price": 80000,
      "notes": "Phụ phí nếu thay mới linh kiện."
    },
    {
      "id": 2,
      "name": "Thay bóng đèn, đèn LED",
      "price": 50000,
      "notes": "Chưa bao gồm giá bóng đèn."
    },
    {
      "id": 3,
      "name": "Sửa chập điện, mất điện cục bộ",
      "price": 150000,
      "notes": "Giá có thể thay đổi tùy mức độ phức tạp."
    },
    {
      "id": 4,
      "name": "Đi dây điện mới (trong nhà)",
      "price": 300000,
      "notes": "Giá khởi điểm, tùy thuộc diện tích."
    },
    {
      "id": 5,
      "name": "Kiểm tra & sửa CB, aptomat",
      "price": 100000,
      "notes": "Bao gồm kiểm tra an toàn điện."
    },
    {
      "id": 6,
      "name": "Thi công điện âm tường",
      "price": 500000,
      "notes": "Giá khởi điểm, báo giá chi tiết sau khảo sát."
    },
    {
      "id": 7,
      "name": "Sửa quạt điện, máy nước nóng",
      "price": 120000,
      "notes": "Phụ phí nếu thay linh kiện."
    },
    {
      "id": 8,
      "name": "Kiểm tra rò điện, đo tải",
      "price": 90000,
      "notes": "Báo cáo chi tiết sau kiểm tra."
    }
  ],
  "plumbing": [
    {
      "id": 9,
      "name": "Sửa vòi nước rò rỉ",
      "price": 100000,
      "notes": "Phụ phí nếu thay vòi mới."
    },
    {
      "id": 10,
      "name": "Thông nghẹt bồn rửa, lavabo",
      "price": 150000,
      "notes": "Giá có thể tăng nếu nghẹt nặng."
    },
    {
      "id": 11,
      "name": "Lắp đặt máy nước nóng",
      "price": 200000,
      "notes": "Chưa bao gồm thiết bị."
    },
    {
      "id": 12,
      "name": "Thay ống nước bị bể",
      "price": 180000,
      "notes": "Giá tùy thuộc chiều dài ống."
    },
    {
      "id": 13,
      "name": "Sửa bồn cầu rò rỉ",
      "price": 130000,
      "notes": "Phụ phí nếu thay phụ kiện."
    }
  ],
  "hvac": [
    {
      "id": 14,
      "name": "Sửa máy lạnh không lạnh, chảy nước",
      "price": 250000,
      "notes": "Bao gồm kiểm tra gas."
    },
    {
      "id": 15,
      "name": "Bơm gas, vệ sinh máy lạnh",
      "price": 300000,
      "notes": "Giá gas tùy loại."
    },
    {
      "id": 16,
      "name": "Sửa tủ lạnh không làm lạnh",
      "price": 350000,
      "notes": "Phụ phí nếu thay linh kiện."
    },
    {
      "id": 17,
      "name": "Thay block, quạt tủ lạnh",
      "price": 500000,
      "notes": "Chưa bao gồm giá linh kiện."
    },
    {
      "id": 18,
      "name": "Sửa máy giặt không hoạt động",
      "price": 280000,
      "notes": "Phụ phí nếu thay board mạch."
    },
    {
      "id": 19,
      "name": "Kiểm tra và thay tụ điện, board mạch",
      "price": 200000,
      "notes": "Giá linh kiện tính riêng."
    },
    {
      "id": 20,
      "name": "Lắp đặt máy lạnh, máy giặt",
      "price": 250000,
      "notes": "Chưa bao gồm phụ kiện lắp đặt."
    },
    {
      "id": 21,
      "name": "Sửa máy nước nóng lạnh",
      "price": 180000,
      "notes": "Phụ phí nếu thay thanh nhiệt."
    }
  ]
};
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching services', error: error.message });
    }
});

app.post('/api/signup', async (req, res) => {
    try {
        const { email, password, name, phone } = req.body;
        if (!email || !password || !name || !phone) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const users = await loadData('users.json');
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const user = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            email,
            password: hashPassword(password),
            name,
            phone,
            createdAt: new Date().toISOString()
        };
        users.push(user);

        await saveData('users.json', users);
        res.status(201).json({ message: 'Sign-up successful', userId: user.id });
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error in /api/signup:`, error.message);
        res.status(500).json({ message: 'Error during sign-up', error: error.message });
    }
});

app.post('/api/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Missing email or password' });
        }

        const users = await loadData('users.json');
        const user = users.find(u => u.email === email && u.password === hashPassword(password));
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Sign-in successful', userId: user.id, name: user.name });
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error in /api/signin:`, error.message);
        res.status(500).json({ message: 'Error during sign-in', error: error.message });
    }
});

app.post('/api/book', async (req, res) => {
    try {
        const { technicianId, customerName, phone, address, serviceType, serviceId, price, date, time, notes, userId } = req.body;
        if (!technicianId || !customerName || !phone || !address || !serviceType || !serviceId || !date) {
            return res.status(400).json({ message: 'Missing required fields for booking' });
        }

        const bookings = await loadData('bookings.json');
        const booking = {
            id: bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1,
            technicianId,
            customerName,
            phone,
            address,
            serviceType,
            serviceId,
            price: price || 0,
            date,
            time: time || '',
            notes: notes || '',
            userId: userId || null,
            createdAt: new Date().toISOString()
        };
        bookings.push(booking);

        await saveData('bookings.json', bookings);
        res.status(201).json({ message: 'Booking confirmed!', booking });
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error in /api/book:`, error.message);
        res.status(500).json({ message: 'Error during booking', error: error.message });
    }
});

app.get('/api/user/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const users = await loadData('users.json');
        const user = users.find(u => u.id === userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ id: user.id, email: user.email, name: user.name, phone: user.phone });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
});

app.get('/api/user/:id/bookings', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const bookings = await loadData('bookings.json');
        const userBookings = bookings.filter(b => b.userId === userId);
        res.status(200).json(userBookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user bookings', error: error.message });
    }
});

app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Server Error:`, err.message);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`[${new Date().toISOString()}] Server running on http://localhost:${PORT}`);
});