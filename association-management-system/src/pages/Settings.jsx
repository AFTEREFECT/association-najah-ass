import React, { useState, useEffect } from 'react';
import { useAssociation } from '../context/AssociationContext';

const Settings = () => {
  const { selectedAssociation, currentAssociation, loadAssociations, logoutAssociation } = useAssociation();
  
  const [incomeFields, setIncomeFields] = useState([]);
  const [expenseFields, setExpenseFields] = useState([]);
  
  const [newField, setNewField] = useState('');
  const [activeTab, setActiveTab] = useState('income'); // 'income' or 'expense'

  useEffect(() => {
    if (selectedAssociation) {
      loadFields();
    }
  }, [selectedAssociation, activeTab]);

  const loadFields = async () => {
    try {
      if (activeTab === 'income') {
        const data = await window.electronAPI.getIncomeFields(selectedAssociation);
        setIncomeFields(data);
      } else {
        const data = await window.electronAPI.getExpenseFields(selectedAssociation);
        setExpenseFields(data);
      }
    } catch (error) { console.error(error); }
  };

  const handleAddField = async (e) => {
    e.preventDefault();
    if (!newField.trim()) return;
    try {
      if (activeTab === 'income') {
        await window.electronAPI.addIncomeField({ assocId: selectedAssociation, name: newField });
      } else {
        await window.electronAPI.addExpenseField({ assocId: selectedAssociation, name: newField });
      }
      setNewField('');
      loadFields();
      alert('✅ تم إضافة المجال بنجاح');
    } catch (error) { alert('خطأ في الإضافة'); }
  };

  const handleDeleteField = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المجال؟')) return;
    try {
      if (activeTab === 'income') {
        await window.electronAPI.deleteIncomeField(id);
      } else {
        await window.electronAPI.deleteExpenseField(id);
      }
      loadFields();
    } catch (error) { alert('لا يمكن حذف مجال مرتبط بعمليات مسجلة'); }
  };

  const handleDeleteAssociation = async () => {
    const confirmName = prompt(`⚠️ تحذير خطير!\nسيتم حذف الجمعية وجميع بياناتها نهائياً.\nلتأكيد الحذف، اكتب اسم الجمعية: "${currentAssociation.name}"`);
    if (confirmName === currentAssociation.name) {
      try {
        await window.electronAPI.deleteAssociation(selectedAssociation);
        alert('تم حذف الجمعية بنجاح.');
        logoutAssociation(); // الخروج
        window.location.reload(); // إعادة تحميل للعودة للشاشة الرئيسية
      } catch (error) { console.error(error); alert('فشل الحذف'); }
    } else if (confirmName !== null) {
      alert('الاسم غير مطابق، تم إلغاء العملية.');
    }
  };

  return (
    <div className="settings-page" style={{padding:'30px', color:'white'}}>
      <h1 style={{marginBottom:'30px', borderBottom:'1px solid #333', paddingBottom:'15px'}}>⚙️ إعدادات الجمعية</h1>

      {/* قسم المجالات */}
      <div style={{background:'#2d2d2d', padding:'25px', borderRadius:'15px', marginBottom:'30px'}}>
        <h2 style={{fontSize:'18px', marginBottom:'20px'}}>📁 إدارة المجالات (الأبواب)</h2>
        
        <div style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
          <button 
            onClick={() => setActiveTab('income')} 
            style={{padding:'10px 20px', borderRadius:'8px', border:'none', background: activeTab === 'income' ? '#10b981' : '#1a1a1a', color:'white', cursor:'pointer'}}
          >
            مجالات المداخيل
          </button>
          <button 
            onClick={() => setActiveTab('expense')} 
            style={{padding:'10px 20px', borderRadius:'8px', border:'none', background: activeTab === 'expense' ? '#ef4444' : '#1a1a1a', color:'white', cursor:'pointer'}}
          >
            مجالات المصاريف
          </button>
        </div>

        <form onSubmit={handleAddField} style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
          <input 
            type="text" 
            value={newField} 
            onChange={e => setNewField(e.target.value)} 
            placeholder={activeTab === 'income' ? 'مثال: انخراطات...' : 'مثال: صيانة وتجهيز...'}
            style={{flex:1, padding:'12px', borderRadius:'8px', border:'1px solid #444', background:'#1a1a1a', color:'white'}}
          />
          <button type="submit" style={{padding:'12px 20px', background:'#3b82f6', border:'none', borderRadius:'8px', color:'white', cursor:'pointer'}}>+ إضافة</button>
        </form>

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'10px'}}>
          {(activeTab === 'income' ? incomeFields : expenseFields).map(field => (
            <div key={field.id} style={{background:'#1a1a1a', padding:'15px', borderRadius:'8px', display:'flex', justifyContent:'space-between', alignItems:'center', borderLeft:`4px solid ${activeTab==='income'?'#10b981':'#ef4444'}`}}>
              <span>{field.name_ar}</span>
              <button onClick={() => handleDeleteField(field.id)} style={{background:'transparent', border:'none', cursor:'pointer', fontSize:'16px'}}>🗑️</button>
            </div>
          ))}
        </div>
      </div>

      {/* قسم المنطقة الخطرة */}
      <div style={{background:'rgba(239, 68, 68, 0.1)', padding:'25px', borderRadius:'15px', border:'1px solid #ef4444'}}>
        <h2 style={{fontSize:'18px', color:'#ef4444', marginBottom:'15px'}}>⛔ المنطقة الخطرة</h2>
        <p style={{color:'#fca5a5', marginBottom:'20px'}}>حذف الجمعية سيؤدي إلى مسح جميع السجلات المالية والبنكية والمصاريف المرتبطة بها نهائياً.</p>
        <button onClick={handleDeleteAssociation} style={{padding:'12px 25px', background:'#ef4444', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>
          🗑️ حذف الجمعية نهائياً
        </button>
      </div>
    </div>
  );
};

export default Settings;
