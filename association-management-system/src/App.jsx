import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// استيراد المكونات والصفحات
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import BankRegister from './pages/bank/BankRegister';
import CashRegister from './pages/cash/CashRegister';
import IncomeRegister from './pages/income/IncomeRegister';
import ExpenseRegister from './pages/expense/ExpenseRegister';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import ChecksList from './pages/checks/ChecksList'; 
import DailyOperationsJournal from './pages/DailyOperationsJournal'; // تأكد من المسار

import { AssociationProvider, useAssociation } from './context/AssociationContext';
import './styles/main.css';

// === مكون المعالج الذكي (Wizard) لإنشاء الجمعية ===
const AssociationWizard = ({ children }) => {
  const { currentAssociation, selectAssociation, associations, loadAssociations } = useAssociation();
  const [view, setView] = useState('list'); // 'list' or 'create'
  const [step, setStep] = useState(1);
  
  // بيانات الجمعية الجديدة
  const [newAssocData, setNewAssocData] = useState({ name: '', type: '' });

  const handleCreate = async () => {
    if (!newAssocData.name || !newAssocData.type) return;
    
    try {
      await window.electronAPI.addAssociation(newAssocData);
      await loadAssociations(); // تحديث القائمة
      setView('list'); // العودة للقائمة
      setStep(1);
      setNewAssocData({ name: '', type: '' });
    } catch (error) {
      console.error("Error creating association:", error);
      alert("حدث خطأ أثناء الإنشاء");
    }
  };

  // إذا تم اختيار جمعية، اعرض التطبيق
  if (currentAssociation) {
    return <div className="app-container">{children}</div>;
  }

  // --- 1. شاشة القائمة الرئيسية ---
  if (view === 'list') {
    return (
      <div className="wizard-container" style={{height:'100vh', background:'#1a1a1a', display:'flex', alignItems:'center', justifyContent:'center', color:'white'}}>
        <div className="wizard-card" style={{width:'600px', background:'#2d2d2d', padding:'40px', borderRadius:'20px', border:'1px solid #404040', textAlign:'center'}}>
          <div style={{fontSize:'50px', marginBottom:'20px'}}>🏢</div>
          <h1 style={{marginBottom:'10px'}}>مرحباً بك في نظام التدبير</h1>
          <p style={{color:'#9ca3af', marginBottom:'40px'}}>اختر جمعية للمتابعة أو أنشئ واحدة جديدة</p>

          {/* قائمة الجمعيات */}
          <div className="assoc-list" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginBottom:'30px'}}>
            {associations.map(assoc => (
              <button 
                key={assoc.id} 
                onClick={() => selectAssociation(assoc.id)}
                className="assoc-btn"
                style={{padding:'20px', background:'#1a1a1a', border:'2px solid #3b82f6', borderRadius:'12px', color:'white', cursor:'pointer', transition:'all 0.2s'}}
              >
                <div style={{fontWeight:'bold'}}>{assoc.name}</div>
              </button>
            ))}
          </div>

          <button 
            onClick={() => setView('create')}
            style={{width:'100%', padding:'15px', background:'#10b981', color:'white', border:'none', borderRadius:'10px', fontSize:'16px', fontWeight:'bold', cursor:'pointer'}}
          >
            ➕ إنشاء جمعية جديدة
          </button>
        </div>
      </div>
    );
  }

  // --- 2. معالج الإنشاء (خطوات) ---
  return (
    <div className="wizard-container" style={{height:'100vh', background:'#1a1a1a', display:'flex', alignItems:'center', justifyContent:'center', color:'white'}}>
      <div className="wizard-card" style={{width:'600px', background:'#2d2d2d', padding:'40px', borderRadius:'20px', border:'1px solid #404040'}}>
        
        {/* رأس المعالج */}
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'30px'}}>
          <h2 style={{margin:0}}>🛠️ إعداد جمعية جديدة</h2>
          <button onClick={() => setView('list')} style={{background:'transparent', border:'none', color:'#ef4444', cursor:'pointer'}}>✕ إلغاء</button>
        </div>

        {/* الخطوة 1: الاسم */}
        {step === 1 && (
          <div className="step-content">
            <label style={{display:'block', marginBottom:'10px', color:'#9ca3af'}}>ما هو اسم الجمعية؟</label>
            <input 
              type="text" 
              value={newAssocData.name} 
              onChange={e => setNewAssocData({...newAssocData, name: e.target.value})}
              placeholder="مثال: جمعية الأمل للتنمية..."
              style={{width:'100%', padding:'15px', background:'#1a1a1a', border:'2px solid #3b82f6', borderRadius:'10px', color:'white', fontSize:'16px', marginBottom:'30px'}}
              autoFocus
            />
            <div style={{textAlign:'left'}}>
              <button 
                onClick={() => newAssocData.name && setStep(2)}
                disabled={!newAssocData.name}
                style={{padding:'12px 30px', background:'#3b82f6', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', opacity: newAssocData.name ? 1 : 0.5}}
              >
                التالي ⬅
              </button>
            </div>
          </div>
        )}

        {/* الخطوة 2: النوع */}
        {step === 2 && (
          <div className="step-content">
            <p style={{marginBottom:'20px', color:'#9ca3af'}}>اختر نوع الجمعية لتهيئة المجالات تلقائياً:</p>
            
            <div style={{display:'flex', flexDirection:'column', gap:'15px', marginBottom:'30px'}}>
              
              {/* خيار 1: النجاح */}
              <div 
                onClick={() => setNewAssocData({...newAssocData, type: 'NAJAH'})}
                style={{
                  padding:'20px', 
                  borderRadius:'12px', 
                  border: newAssocData.type === 'NAJAH' ? '2px solid #10b981' : '2px solid #404040',
                  background: newAssocData.type === 'NAJAH' ? 'rgba(16, 185, 129, 0.1)' : '#1a1a1a',
                  cursor:'pointer',
                  display:'flex', alignItems:'center', gap:'15px'
                }}
              >
                <div style={{fontSize:'24px'}}>🎓</div>
                <div>
                  <div style={{fontWeight:'bold', color: newAssocData.type === 'NAJAH' ? '#10b981' : 'white'}}>جمعية دعم مدرسة النجاح</div>
                  <div style={{fontSize:'12px', color:'#9ca3af'}}>يتم تحميل مجالات الدليل المسطري تلقائياً</div>
                </div>
              </div>

              {/* خيار 2: الرياضية */}
              <div 
                onClick={() => setNewAssocData({...newAssocData, type: 'SPORT'})}
                style={{
                  padding:'20px', 
                  borderRadius:'12px', 
                  border: newAssocData.type === 'SPORT' ? '2px solid #f59e0b' : '2px solid #404040',
                  background: newAssocData.type === 'SPORT' ? 'rgba(245, 158, 11, 0.1)' : '#1a1a1a',
                  cursor:'pointer',
                  display:'flex', alignItems:'center', gap:'15px'
                }}
              >
                <div style={{fontSize:'24px'}}>⚽</div>
                <div>
                  <div style={{fontWeight:'bold', color: newAssocData.type === 'SPORT' ? '#f59e0b' : 'white'}}>الجمعية الرياضية المدرسية</div>
                  <div style={{fontSize:'12px', color:'#9ca3af'}}>يتم تحميل مجالات الرياضة المدرسية تلقائياً</div>
                </div>
              </div>

              {/* خيار 3: أخرى */}
              <div 
                onClick={() => setNewAssocData({...newAssocData, type: 'OTHER'})}
                style={{
                  padding:'20px', 
                  borderRadius:'12px', 
                  border: newAssocData.type === 'OTHER' ? '2px solid #6366f1' : '2px solid #404040',
                  background: newAssocData.type === 'OTHER' ? 'rgba(99, 102, 241, 0.1)' : '#1a1a1a',
                  cursor:'pointer',
                  display:'flex', alignItems:'center', gap:'15px'
                }}
              >
                <div style={{fontSize:'24px'}}>⚙️</div>
                <div>
                  <div style={{fontWeight:'bold', color: newAssocData.type === 'OTHER' ? '#6366f1' : 'white'}}>جمعية أخرى (مخصص)</div>
                  <div style={{fontSize:'12px', color:'#9ca3af'}}>بدون مجالات مسبقة، ستقوم بإضافتها يدوياً</div>
                </div>
              </div>

            </div>

            <div style={{display:'flex', justifyContent:'space-between'}}>
              <button onClick={() => setStep(1)} style={{background:'transparent', color:'#9ca3af', border:'none', cursor:'pointer'}}>➡ رجوع</button>
              <button 
                onClick={handleCreate}
                disabled={!newAssocData.type}
                style={{padding:'12px 30px', background:'#10b981', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', opacity: newAssocData.type ? 1 : 0.5}}
              >
                ✅ إنشاء وبدء العمل
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// === التطبيق الرئيسي ===
function App() {
  return (
    <AssociationProvider>
      <Router>
        <AssociationWizard>
          <div className="app">
            <Sidebar />
            <div className="main-content">
              <Header />
              <div className="content-area">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/bank" element={<BankRegister />} />
                  <Route path="/cash" element={<CashRegister />} />
                  <Route path="/income" element={<IncomeRegister />} />
                  <Route path="/expenses" element={<ExpenseRegister />} />
                  <Route path="/daily-journal" element={<DailyOperationsJournal />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/checks" element={ChecksList ? <ChecksList /> : <div>قيد الإنجاز</div>} />
                </Routes>
              </div>
            </div>
          </div>
        </AssociationWizard>
      </Router>
    </AssociationProvider>
  );
}

export default App;
