const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '15mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend Kas Basket SACIL MySQL Aktif', timestamp: new Date() });
});

// ==========================================
// 1. PENGATURAN KLUB & RINGKASAN KEUANGAN
// ==========================================
app.get('/api/settings', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM club_settings LIMIT 1');
    if (rows.length === 0) return res.status(404).json({ error: 'Pengaturan belum dibuat' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const s = req.body;
    await db.query(
      `UPDATE club_settings SET 
        school_name = ?, club_name = ?, academic_year = ?, weekly_dues_amount = ?,
        headmaster_name = ?, headmaster_nip = ?, supervisor_name = ?, supervisor_nip = ?,
        coach_name = ?, president_name = ?, treasurer_name = ?, google_sheet_url = ?,
        active_week_id = ?, treasurer_cash_on_hand = ?, president_cash_on_hand = ?
       WHERE id = 1`,
      [
        s.schoolName, s.clubName, s.academicYear, s.weeklyDuesAmount,
        s.headmasterName, s.headmasterNip || null, s.supervisorName, s.supervisorNip || null,
        s.coachName, s.presidentName, s.treasurerName, s.googleSheetUrl,
        s.activeWeekId || 'september_3', s.treasurerCashOnHand || 0, s.presidentCashOnHand || 0
      ]
    );
    res.json({ message: 'Pengaturan berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM v_ringkasan_keuangan LIMIT 1');
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. DEFINISI MINGGU IURAN
// ==========================================
app.get('/api/weeks', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM week_definitions ORDER BY col_order ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 3. ANGGOTA & MATRIKS PEMBAYARAN KAS
// ==========================================
app.get('/api/members', async (req, res) => {
  try {
    // Ambil data anggota beserta seluruh histori pembayarannya
    const [members] = await db.query('SELECT * FROM members ORDER BY no_urut ASC');
    const [payments] = await db.query('SELECT * FROM member_payments');

    // Petakan payment ke masing-masing anggota (sesuai format frontend React)
    const paymentsByMember = {};
    for (const p of payments) {
      if (!paymentsByMember[p.member_id]) paymentsByMember[p.member_id] = {};
      paymentsByMember[p.member_id][p.week_id] = {
        status: p.status,
        date: p.paid_date ? p.paid_date.toISOString().slice(0, 10) : undefined,
        nominal: Number(p.nominal),
        note: p.note || undefined
      };
    }

    const result = members.map(m => ({
      id: m.id,
      studentId: m.student_id,
      no: m.no_urut,
      batch: m.batch,
      name: m.name,
      grade: m.grade,
      subClass: m.sub_class,
      jerseyNumber: m.jersey_number,
      position: m.position,
      gender: m.gender,
      birthDate: m.birth_date ? m.birth_date.toISOString().slice(0, 10) : undefined,
      minWeeks: m.min_weeks,
      plusWeeks: m.plus_weeks,
      phone: m.phone || undefined,
      avatarUrl: m.avatar_url || undefined,
      totalPaidAmount: Number(m.total_paid_amount || 0),
      payments: paymentsByMember[m.id] || {}
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update status iuran mingguan anggota
app.put('/api/members/:memberId/payments/:weekId', async (req, res) => {
  const { memberId, weekId } = req.params;
  const { status, nominal = 5000, date, note } = req.body;

  try {
    const paidDate = (status === 'paid' && !date) ? new Date().toISOString().slice(0, 10) : (date || null);
    
    await db.query(
      `INSERT INTO member_payments (member_id, week_id, status, nominal, paid_date, note)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
        status = VALUES(status), 
        nominal = VALUES(nominal), 
        paid_date = VALUES(paid_date), 
        note = VALUES(note)`,
      [memberId, weekId, status, nominal, paidDate, note || null]
    );

    // Hitung ulang total_paid_amount anggota
    const [calc] = await db.query(
      `SELECT COALESCE(SUM(nominal), 0) as total FROM member_payments WHERE member_id = ? AND status = 'paid'`,
      [memberId]
    );
    const totalPaid = calc[0]?.total || 0;
    await db.query('UPDATE members SET total_paid_amount = ? WHERE id = ?', [totalPaid, memberId]);

    res.json({ message: 'Pembayaran berhasil diperbarui', totalPaid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. BUKU KAS UMUM & TRANSAKSI
// ==========================================
app.get('/api/transactions', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM transactions ORDER BY trans_date DESC, created_at DESC');
    const result = rows.map(r => ({
      id: r.id,
      date: r.trans_date ? r.trans_date.toISOString().slice(0, 10) : '',
      receiptNumber: r.receipt_number,
      accountCode: r.account_code,
      type: r.type,
      category: r.category,
      description: r.description,
      amount: Number(r.amount),
      destinationAccount: r.destination_account,
      payerOrPayee: r.payer_or_payee,
      paymentMethod: r.payment_method,
      proofUrl: r.proof_url,
      notes: r.notes,
      createdAt: Number(r.created_at)
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/transactions', async (req, res) => {
  try {
    const t = req.body;
    const transId = t.id || `trx-${Date.now()}`;
    await db.query(
      `INSERT INTO transactions (
        id, trans_date, receipt_number, account_code, type, category,
        description, amount, destination_account, payer_or_payee, payment_method,
        proof_url, notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        transId, t.date, t.receiptNumber, t.accountCode || null, t.type, t.category,
        t.description, t.amount, t.destinationAccount || 'Kas Kecil (Bendahara)',
        t.payerOrPayee || null, t.paymentMethod || 'Tunai',
        t.proofUrl || null, t.notes || null, t.createdAt || Date.now()
      ]
    );
    res.status(201).json({ message: 'Transaksi berhasil disimpan', id: transId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM transactions WHERE id = ?', [req.params.id]);
    res.json({ message: 'Transaksi berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 5. INVENTARIS LOGISTIK
// ==========================================
app.get('/api/inventory', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM inventory_items ORDER BY purchase_date DESC');
    const result = rows.map(r => ({
      id: r.id,
      type: r.type,
      accountCode: r.account_code,
      name: r.name,
      category: r.category,
      quantity: Number(r.quantity),
      unit: r.unit,
      condition: r.condition_state,
      purchaseDate: r.purchase_date ? r.purchase_date.toISOString().slice(0, 10) : '',
      unitPrice: Number(r.unit_price),
      totalPrice: Number(r.total_price),
      location: r.location,
      sourceTransactionId: r.source_transaction_id,
      notes: r.notes
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/inventory', async (req, res) => {
  try {
    const item = req.body;
    const id = item.id || `inv-${Date.now()}`;
    await db.query(
      `INSERT INTO inventory_items (
        id, type, account_code, name, category, quantity, unit,
        condition_state, purchase_date, unit_price, total_price, location, source_transaction_id, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, item.type, item.accountCode || 'UK4', item.name, item.category,
        item.quantity, item.unit, item.condition || 'Baik', item.purchaseDate,
        item.unitPrice, item.totalPrice, item.location || 'Gudang Olahraga',
        item.sourceTransactionId || null, item.notes || null
      ]
    );
    res.status(201).json({ message: 'Barang berhasil dicatat', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/inventory/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM inventory_items WHERE id = ?', [req.params.id]);
    res.json({ message: 'Barang berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 6. NEXT AGENDA (JADWAL KEGIATAN)
// ==========================================
app.get('/api/agendas', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM club_agendas ORDER BY event_date ASC');
    const result = rows.map(r => ({
      id: r.id,
      title: r.title,
      category: r.category,
      date: r.event_date ? r.event_date.toISOString().slice(0, 10) : '',
      time: r.event_time,
      location: r.location,
      description: r.description,
      isActive: Boolean(r.is_active),
      targetAudience: r.target_audience,
      pic: r.pic,
      createdAt: Number(r.created_at)
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/agendas', async (req, res) => {
  try {
    const a = req.body;
    const id = a.id || `agenda-${Date.now()}`;
    await db.query(
      `INSERT INTO club_agendas (
        id, title, category, event_date, event_time, location,
        description, is_active, target_audience, pic, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, a.title, a.category, a.date, a.time, a.location,
        a.description || null, a.isActive !== undefined ? a.isActive : true,
        a.targetAudience || 'Semua Anggota', a.pic || 'Coach Hendra / Teisya',
        a.createdAt || Date.now()
      ]
    );
    res.status(201).json({ message: 'Agenda berhasil dibuat', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/agendas/:id', async (req, res) => {
  try {
    const a = req.body;
    await db.query(
      `UPDATE club_agendas SET 
        title = ?, category = ?, event_date = ?, event_time = ?, location = ?,
        description = ?, is_active = ?, target_audience = ?, pic = ?
       WHERE id = ?`,
      [
        a.title, a.category, a.date, a.time, a.location,
        a.description || null, a.isActive, a.targetAudience, a.pic,
        req.params.id
      ]
    );
    res.json({ message: 'Agenda berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/agendas/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM club_agendas WHERE id = ?', [req.params.id]);
    res.json({ message: 'Agenda berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server Kas Basket SACIL MySQL berjalan di port ${PORT}`);
});
