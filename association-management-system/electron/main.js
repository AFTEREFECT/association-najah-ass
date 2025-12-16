const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { initDatabase, saveDatabase, executeQuery, db } = require('./database/init');

let mainWindow;

// ===========================
// قوالب الجمعيات حسب النوع
// ===========================
const TEMPLATES = {
  NAJAH: {
    income: [
      'منحة الوزارة (دعم مدرسة النجاح)',
      'منحة الأكاديمية الجهوية (AREF)',
      'انخراطات المتعلمين',
      'دعم الشركاء (جمعيات، جماعات...)',
      'مداخيل الأنشطة الاستثنائية',
    ],
    expense: [
      { name: 'الصيانة الوقائية (صباغة، نجارة، ترصيص، كهرباء)', eligible: 1 },
      { name: 'إصلاح التجهيزات والمعدات', eligible: 1 },
      { name: 'العناية بالمجالات الخضراء والبستنة', eligible: 1 },
      { name: 'دعم الأندية التربوية', eligible: 1 },
      { name: 'تنظيم التظاهرات الثقافية والفنية والرياضية', eligible: 1 },
      { name: 'الرحلات والخرجات الدراسية', eligible: 1 },
      { name: 'جوائز وتحفيزات المتفوقين', eligible: 1 },
      { name: 'اقتناء العتاد الديداكتيكي والوسائل التعليمية', eligible: 1 },
      { name: 'اقتناء الكتب والمراجع للمكتبة المدرسية', eligible: 1 },
      { name: 'اقتناء مواد النظافة والتعقيم', eligible: 1 },
      { name: 'لوازم المكتب والنسخ والطباعة', eligible: 1 },
      { name: 'مصاريف التنقل والبريد', eligible: 1 },
      { name: 'مصاريف التوثيق والإعلام', eligible: 1 },
      { name: 'نفقات الاستقبال والضيافة (محدودة)', eligible: 0 },
    ],
  },
  SPORT: {
    income: [
      'واجبات الانخراط الرياضي (التلاميذ)',
      'منحة الجامعة الملكية للرياضة المدرسية',
      'منحة الأكاديمية الجهوية للتربية والتكوين',
      'منح المجالس المنتخبة (الجماعات الترابية)',
      'مداخيل الأنشطة والتظاهرات الرياضية',
      'الهبات والوصايا (مرخص بها)',
    ],
    expense: [
      { name: 'مصاريف تسيير الجمعية (لوازم مكتبية، طوابع، توثيق)', eligible: 0 },
      { name: 'مصاريف تنقل الفرق (كراء وسائل النقل للمنافسات)', eligible: 1 },
      { name: 'مصاريف تغذية الفرق ومرافقيهم', eligible: 1 },
      { name: 'تنظيم التظاهرات الرياضية بالمؤسسة (بطولات محلية)', eligible: 1 },
      { name: 'تنظيم حفلات فنية وثقافية ورياضية (التميز، استقبال الأبطال)', eligible: 1 },
      { name: 'المشاركة في المعارض والمنتديات (للتعريف بالجمعية)', eligible: 1 },
      { name: 'شراء الألبسة والأمتعة الرياضية (أقمصة الفرق)', eligible: 1 },
      { name: 'شراء وصيانة العتاد الرياضي (كرات، شباك...)', eligible: 1 },
      { name: 'دعم البرامج والأنشطة الوزارية (مساهمة لوجستيكية)', eligible: 1 },
      { name: 'شراء الكتب والمجلات المتخصصة في الرياضة', eligible: 1 },
      { name: 'المصاريف الطبية (إسعافات أولية، علاجات)', eligible: 1 },
      { name: 'أنشطة أخرى يعتمدها المكتب التنفيذي', eligible: 1 },
    ],
  },
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://127.0.0.1:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(async () => {
  const userDataPath = app.getPath('userData');
  await initDatabase(userDataPath);
  createWindow();
  setupIpcHandlers();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  saveDatabase();
  if (process.platform !== 'darwin') app.quit();
});

// ==========================================================
// HANDLERS
// ==========================================================
function setupIpcHandlers() {
  // --- 1. الجمعيات ---
  ipcMain.handle('get-associations', () =>
    executeQuery('SELECT * FROM associations ORDER BY id')
  );

  ipcMain.handle('add-association', async (event, data) => {
    try {
      const database = db();

      // 1) إنشاء الجمعية
      database.run('INSERT INTO associations (name) VALUES (?)', [data.name]);
      const newAssocId = executeQuery(
        'SELECT last_insert_rowid() as id'
      )[0].id;

      // 2) سنة مالية وحسابات
      const currentYear = new Date().getFullYear();
      database.run(
        'INSERT INTO fiscal_years (association_id, year, is_active) VALUES (?, ?, 1)',
        [newAssocId, currentYear]
      );
      database.run(
        "INSERT INTO accounts (association_id, name_ar, type) VALUES (?, 'الصندوق الرئيسي', 'cash')",
        [newAssocId]
      );
      database.run(
        "INSERT INTO accounts (association_id, name_ar, type) VALUES (?, 'الحساب البنكي', 'bank')",
        [newAssocId]
      );

      // 3) طرق الدفع
      const methods = [
        { name: 'Cash', name_ar: 'نقداً', type: 'cash' },
        { name: 'Check', name_ar: 'شيك', type: 'bank' },
        { name: 'Transfer', name_ar: 'تحويل بنكي', type: 'bank' },
      ];
      methods.forEach((m) =>
        database.run(
          'INSERT INTO payment_methods (association_id, name, name_ar, account_type) VALUES (?, ?, ?, ?)',
          [newAssocId, m.name, m.name_ar, m.type]
        )
      );

      // 4) اختيار القالب حسب النوع
      let incomeFields = [];
      let expenseFields = [];

      if (data.type === 'NAJAH') {
        incomeFields = TEMPLATES.NAJAH.income;
        expenseFields = TEMPLATES.NAJAH.expense;
      } else if (data.type === 'SPORT') {
        incomeFields = TEMPLATES.SPORT.income;
        expenseFields = TEMPLATES.SPORT.expense;
      }

      // 5) إدخال مجالات المداخيل
      incomeFields.forEach((f) => {
        database.run(
          'INSERT INTO income_fields (association_id, name, name_ar) VALUES (?, ?, ?)',
          [newAssocId, f, f]
        );
      });

      // 6) إدخال مجالات المصاريف (مع eligible)
      expenseFields.forEach((f) => {
        const name = typeof f === 'object' ? f.name : f;
        const eligible = typeof f === 'object' ? f.eligible : 1;
        try {
          database.run(
            'INSERT INTO expense_fields (association_id, name, name_ar, is_grant_eligible) VALUES (?, ?, ?, ?)',
            [newAssocId, name, name, eligible]
          );
        } catch {
          database.run(
            'INSERT INTO expense_fields (association_id, name, name_ar) VALUES (?, ?, ?)',
            [newAssocId, name, name]
          );
        }
      });

      saveDatabase();
      return { success: true, id: newAssocId };
    } catch (err) {
      console.error('Error adding association:', err);
      throw err;
    }
  });

  // --- 2. المجالات ---
  ipcMain.handle('get-income-fields', (e, id) =>
    executeQuery(
      `SELECT * FROM income_fields WHERE association_id = ${id}`
    )
  );
  ipcMain.handle('get-expense-fields', (e, id) =>
    executeQuery(
      `SELECT * FROM expense_fields WHERE association_id = ${id}`
    )
  );

  // --- 3. الترقيم ---
  ipcMain.handle(
    'get-next-document-number',
    (event, { type, year, association_id }) => {
      let table = '',
        prefix = '';
      switch (type) {
        case 'expense':
          table = 'expense_transactions';
          prefix = 'OP';
          break;
        case 'cash_payment':
          table = 'cash_transactions';
          prefix = 'BC';
          break;
        case 'income':
          table = 'income_transactions';
          prefix = 'REC';
          break;
        default:
          return '';
      }
      try {
        const result = executeQuery(
          `SELECT COUNT(*) as count FROM ${table} WHERE association_id = ${association_id} AND strftime('%Y', ${
            table === 'cash_transactions' ? 'transaction_date' : 'date'
          }) = '${year}'`
        );
        const nextCount = (result[0].count || 0) + 1;
        return `${prefix}-${String(nextCount).padStart(3, '0')}/${year
          .toString()
          .slice(-2)}`;
      } catch (e) {
        return `${prefix}-001/${year.toString().slice(-2)}`;
      }
    }
  );

  // --- 4. المصاريف ---
  ipcMain.handle('add-expense-transaction', async (event, data) => {
    const database = db();
    try {
      database.run(
        `INSERT INTO expense_transactions (
          association_id, date, description, expense_field_id, amount, payment_method, 
          service_status, payment_status, op_number, bc_number, bl_number, check_number,
          beneficiary_name, beneficiary_cin, beneficiary_vehicle, notes, 
          invoice_type, invoice_number, reference_number
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.association_id,
          data.date,
          data.description,
          data.expense_field_id,
          data.amount,
          data.payment_method,
          data.service_status,
          data.payment_status,
          data.op_number,
          data.bc_number,
          data.bl_number,
          data.check_number,
          data.beneficiary_name,
          data.beneficiary_cin,
          data.beneficiary_vehicle,
          data.notes,
          data.invoice_type,
          data.invoice_number,
          data.reference_number,
        ]
      );
      const expenseId = executeQuery(
        'SELECT last_insert_rowid() as id'
      )[0].id;

      if (data.payment_method === 'cash' && data.payment_status === 'paye') {
        database.run(
          `INSERT INTO cash_transactions (
            association_id, transaction_date, operation_label, movement_type, 
            amount, document_type, document_number, linked_expense_id, balance_after
          ) VALUES (?, ?, ?, 'payment', ?, 'cash_voucher', ?, ?, 0)`,
          [
            data.association_id,
            data.date,
            data.description,
            data.amount,
            data.bc_number,
            expenseId,
          ]
        );
      }
      saveDatabase();
      return { success: true };
    } catch (err) {
      console.error('Error adding expense:', err);
      throw err;
    }
  });

  ipcMain.handle('get-expense-transactions', (event, filters) => {
    const query = `
      SELECT t.*, f.name_ar as expense_field_name 
      FROM expense_transactions t
      LEFT JOIN expense_fields f ON t.expense_field_id = f.id
      WHERE t.association_id = ${filters.association_id}
      ORDER BY t.date DESC
    `;
    return executeQuery(query);
  });

  ipcMain.handle('delete-expense-transaction', (event, id) => {
    const database = db();
    database.run(
      'DELETE FROM cash_transactions WHERE linked_expense_id = ?',
      [id]
    );
    database.run('DELETE FROM expense_transactions WHERE id = ?', [id]);
    saveDatabase();
    return { success: true };
  });

  // --- 5. المداخيل ---
 // --- 5. المداخيل ---
 // --- 5. المداخيل ---
ipcMain.handle('add-income-transaction', async (event, data) => {
  const database = db();
  try {
    // 1) إدراج المدخول في سجل المداخيل (نفس الأعمدة القديمة)
    database.run(
      `INSERT INTO income_transactions (
        association_id,
        date,
        description,
        income_field_id,
        amount,
        payment_method,
        reference_number,
        notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.association_id,
        data.date,
        data.description,
        data.income_field_id,
        data.amount,
        data.payment_method,       // 'cash' أو 'bank'
        data.reference_number,
        data.notes
      ]
    );

    const incomeId = executeQuery(
      'SELECT last_insert_rowid() as id'
    )[0].id;

    // 2) حركة في الصندوق إذا كان الدفع نقداً
    if (data.payment_method === 'cash') {
      database.run(
        `INSERT INTO cash_transactions (
          association_id,
          transaction_date,
          operation_label,
          amount,
          movement_type,
          reference_number,
          income_transaction_id
        ) VALUES (?, ?, ?, ?, 'receipt', ?, ?)`,
        [
          data.association_id,
          data.date,
          data.description,
          data.amount,
          data.reference_number,
          incomeId
        ]
      );
    }

    // 3) حركة في البنك إذا كان الدفع شيك/تحويل
if (data.payment_method === 'bank') {
  database.run(
    `INSERT INTO bank_transactions (
       association_id,
       transaction_date,
       operation_label,
       amount,
       movement_type
     ) VALUES (?, ?, ?, ?, 'deposit')`,
    [
      data.association_id,
      data.date,
      data.description,
      data.amount
    ]
  );
}


    saveDatabase();
    return { success: true };
  } catch (err) {
    console.error('Error adding income:', err);
    throw err;
  }
});



  ipcMain.handle('get-income-transactions', (event, filters) => {
    const query = `
      SELECT t.*, f.name_ar as income_field_name 
      FROM income_transactions t
      LEFT JOIN income_fields f ON t.income_field_id = f.id
      WHERE t.association_id = ${filters.association_id}
      ORDER BY t.date DESC
    `;
    return executeQuery(query);
  });

  ipcMain.handle('delete-income-transaction', (event, id) => {
    const database = db();
    database.run(
      'DELETE FROM cash_transactions WHERE linked_income_id = ?',
      [id]
    );
    database.run('DELETE FROM income_transactions WHERE id = ?', [id]);
    saveDatabase();
    return { success: true };
  });

  // --- 6. سجل الصندوق ---
  ipcMain.handle('get-current-balance', (event, association_id) => {
    try {
      const result = executeQuery(
        `SELECT SUM(CASE WHEN movement_type = 'receipt' THEN amount ELSE -amount END) as balance 
         FROM cash_transactions WHERE association_id = ${association_id}`
      );
      return result[0]?.balance || 0;
    } catch {
      return 0;
    }
  });

  ipcMain.handle('get-cash-transactions', (event, filters) => {
    const query = `
      SELECT * FROM cash_transactions 
      WHERE association_id = ${filters.association_id}
      ORDER BY transaction_date DESC
    `;
    return executeQuery(query);
  });
}

module.exports = {};
