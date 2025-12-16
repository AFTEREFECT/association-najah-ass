import React, { createContext, useState, useContext, useEffect } from 'react';

const AssociationContext = createContext();

export const useAssociation = () => useContext(AssociationContext);

export const AssociationProvider = ({ children }) => {
  const [currentAssociation, setCurrentAssociation] = useState(null);
  const [selectedAssociation, setSelectedAssociation] = useState(null);
  const [associations, setAssociations] = useState([]);
  const [loading, setLoading] = useState(true);

  // تحميل الجمعيات عند البدء
  useEffect(() => {
    loadAssociations();
  }, []);

  const loadAssociations = async () => {
    try {
      const data = await window.electronAPI.getAssociations();
      setAssociations(data);
      
      // استرجاع آخر جمعية تم اختيارها من الذاكرة المحلية
      const savedAssocId = localStorage.getItem('selectedAssociationId');
      if (savedAssocId && data.length > 0) {
        const found = data.find(a => a.id === parseInt(savedAssocId));
        if (found) {
          setCurrentAssociation(found);
          setSelectedAssociation(found.id);
        }
      }
    } catch (error) {
      console.error('Error loading associations:', error);
    } finally {
      setLoading(false);
    }
  };

  // دالة اختيار الجمعية
  const selectAssociation = async (associationId) => {
    try {
      const association = associations.find(a => a.id === associationId);
      
      if (association) {
        setCurrentAssociation(association);
        setSelectedAssociation(associationId);
        // حفظ الاختيار
        localStorage.setItem('selectedAssociationId', associationId);
      }
    } catch (error) {
      console.error('Error selecting association:', error);
    }
  };

  // دالة تبديل الجمعية / الخروج
  const logoutAssociation = () => {
    setCurrentAssociation(null);
    setSelectedAssociation(null);
    // مسح الاختيار
    localStorage.removeItem('selectedAssociationId');
  };

  // دوال المساعدة لجلب المجالات
  const getIncomeFields = async () => {
    if (!selectedAssociation) return [];
    try {
      return await window.electronAPI.getIncomeFields(selectedAssociation);
    } catch (error) {
      console.error('Error loading income fields:', error);
      return [];
    }
  };

  const getExpenseFields = async () => {
    if (!selectedAssociation) return [];
    try {
      return await window.electronAPI.getExpenseFields(selectedAssociation);
    } catch (error) {
      console.error('Error loading expense fields:', error);
      return [];
    }
  };

  const getCategoriesByType = async (type) => {
    if (type === 'income') return await getIncomeFields();
    if (type === 'expense') return await getExpenseFields();
    return [];
  };

  return (
    <AssociationContext.Provider value={{ 
      currentAssociation,
      selectedAssociation,
      associations,
      loading,
      selectAssociation, 
      logoutAssociation,
      loadAssociations, // ✅ تم إضافتها هنا (هذا هو سبب الخطأ سابقاً)
      getCategoriesByType,
      getIncomeFields,
      getExpenseFields
    }}>
      {children}
    </AssociationContext.Provider>
  );
};
