/**
 * قوالب الجمعيات الرسمية - بناءً على الدليل المسطري
 * وزارة التربية الوطنية - دليل مسطري في شأن التدبير المالي لجمعيات دعم مدرسة النجاح
 * السنة الدراسية 2009/2010 (محدث 2013/2014)
 */

export const associationTemplates = {
  "جمعية دعم مدرسة النجاح": {
    id: "najah-school-support",
    name: "جمعية دعم مدرسة النجاح",
    description: "جمعية دعم مدرسة النجاح - طبقاً للدليل المسطري الرسمي",
    officialGuide: "دليل مسطري في شأن التدبير المالي لجمعيات دعم مدرسة النجاح",
    
    // المداخيل الرسمية - صفحة 7-10
    incomeCategories: [
      {
        id: "fixed-income",
        name: "مداخيل قارة",
        description: "المداخيل التي لا تتغير كل سنة",
        subcategories: [
          {
            id: "membership-fees",
            name: "واجب الانخراط السنوي",
            description: "المبلغ الذي يحدد بقوانين الجمعية"
          },
          {
            id: "member-contributions",
            name: "اشتراكات الأعضاء",
            description: "اشتراكات شهرية أو دورية أو سنوية"
          }
        ]
      },
      {
        id: "activity-income",
        name: "مداخيل الأنشطة",
        description: "المداخيل من الأنشطة التي تقوم بها الجمعية",
        subcategories: [
          {
            id: "beneficiary-subscriptions",
            name: "اشتراكات المستفيدين",
            description: "المساهمات مقابل المشاركة أو الاستفادة من نشاط"
          },
          {
            id: "product-sales",
            name: "مقابل المنتوجات",
            description: "المداخيل من بيع منشورات، دلائل، لوحات فنية، صور"
          },
          {
            id: "service-fees",
            name: "مقابل الخدمات",
            description: "المساهمات لقاء أداء خدمات كالتكوين أو تنظيم تظاهرات"
          }
        ]
      },
      {
        id: "grants-donations",
        name: "المنح والهبات",
        description: "المداخيل من الإعانات والمنح",
        subcategories: [
          {
            id: "municipal-grant",
            name: "منحة المجلس الجماعي",
            description: "منح من الجماعات المحلية"
          },
          {
            id: "project-funding",
            name: "تمويل في إطار مشروع",
            description: "مداخيل من منظمات أو شركات أو أفراد لتمويل مشاريع"
          },
          {
            id: "donations",
            name: "الهبات",
            description: "مبالغ من أفراد أو منظمات في إطار الإحسان"
          },
          {
            id: "central-admin-grant",
            name: "منح من الإدارة المركزية",
            description: "منح من وزارة التربية الوطنية"
          },
          {
            id: "academy-grant",
            name: "منح من الأكاديمية الجهوية",
            description: "منح من الأكاديمية الجهوية للتربية والتكوين"
          }
        ]
      },
      {
        id: "exceptional-income",
        name: "مداخيل استثنائية",
        description: "المداخيل التي تتأتى عرضاً",
        subcategories: [
          {
            id: "other-exceptional",
            name: "مداخيل استثنائية أخرى",
            description: "مداخيل غير متوقعة لا تدخل في خانات أخرى"
          }
        ]
      }
    ],
    
    // المصاريف الرسمية - صفحة 10-12
    expenseCategories: [
      {
        id: "minor-management",
        name: "نفقات تدبيرية صغرى",
        description: "النفقات الضرورية لسد الخصاص في وسائل العمل الأساسية",
        maxCashAmount: 1500, // الحد الأقصى للدفع النقدي
        subcategories: [
          {
            id: "educational-supplies-small",
            name: "لوازم تعليمية صغيرة",
            description: "لوازم تعليمية أساسية للاستخدام اليومي"
          },
          {
            id: "it-supplies-small",
            name: "لوازم معلوماتية صغيرة",
            description: "أقراص مدمجة، حبر الطابعة، وغيرها"
          },
          {
            id: "educational-references",
            name: "مراجع تربوية",
            description: "كتب ومراجع تربوية للمؤسسة"
          },
          {
            id: "printing-reproduction",
            name: "طباعة واستنساخ الوثائق",
            description: "نفقات طباعة ونسخ الوثائق"
          },
          {
            id: "postal-expenses",
            name: "مصاريف البريد",
            description: "نفقات إرسال الرسائل والطرود"
          },
          {
            id: "goods-transport",
            name: "نقل البضائع",
            description: "نفقات نقل المواد والتجهيزات"
          },
          {
            id: "medical-supplies",
            name: "لوازم طبية",
            description: "طواقم طبية مطابقة للمواصفات التقنية"
          }
        ]
      },
      {
        id: "preventive-maintenance",
        name: "نفقات الصيانة الوقائية",
        description: "النفقات الضرورية للحفاظ على الحالة العامة للمؤسسة",
        subcategories: [
          {
            id: "materials-paint",
            name: "عقاقير وصباغة",
            description: "مواد البناء والصباغة"
          },
          {
            id: "small-equipment",
            name: "عتاد صغير وتجهيز صغير",
            description: "معدات وتجهيزات صغيرة للصيانة"
          },
          {
            id: "cleaning-supplies",
            name: "لوازم التنظيف والتطهير",
            description: "مواد التنظيف والتعقيم (إن لم توفرها الأكاديمية)"
          },
          {
            id: "sanitary-supplies",
            name: "لوازم صحية",
            description: "لوازم صحية للمؤسسة (إن لم توفرها الأكاديمية)"
          }
        ]
      },
      {
        id: "school-events",
        name: "نفقات التظاهرات المدرسية",
        description: "النفقات الجزئية المصاحبة للمناسبات المدرسية",
        note: "يجب أن تكون الجمعية مساهماً فقط وليس المتحمل الوحيد",
        subcategories: [
          {
            id: "reception-contribution",
            name: "المساهمة في نفقات الاستقباالت",
            description: "المساهمة في نفقات التغذية المرتبطة بالاستقباالت"
          },
          {
            id: "event-equipment",
            name: "اقتناء معدات المناسبات والملصقات",
            description: "معدات وملصقات للمناسبات المدرسية"
          },
          {
            id: "participant-transport",
            name: "تنقل المشاركين في التظاهرات",
            description: "نفقات تنقل التلميذات والتلاميذ المشاركين"
          }
        ]
      },
      {
        id: "academic-achievement",
        name: "نفقات تشجيع التحصيل الدراسي",
        description: "جوائز تشجيعية للمتفوقين والمبدعين",
        maxContributionPercent: 25, // الحد الأقصى 25% من مجموع النفقات
        subcategories: [
          {
            id: "excellence-awards",
            name: "جوائز التفوق الدراسي",
            description: "جوائز للمتفوقين والمتفوقات (حد أقصى 25%)"
          },
          {
            id: "innovation-awards",
            name: "جوائز الإبداع والابتكار",
            description: "جوائز للمبدعين والمبدعات (حد أقصى 25%)"
          }
        ]
      },
      {
        id: "educational-clubs",
        name: "نفقات النوادي التربوية",
        description: "تمويل أنشطة الأندية التربوية داخل المؤسسة",
        subcategories: [
          {
            id: "small-work-materials",
            name: "مقتنيات وسائل العمل الصغيرة",
            description: "معدات صغيرة لأندية المسرح والسينما والموسيقى والبيئة"
          },
          {
            id: "small-rentals",
            name: "مكتريات صغيرة لخدمات التنشيط",
            description: "مكتريات مرتبطة بخدمات تنشيط الأندية"
          },
          {
            id: "communication-publishing",
            name: "نفقات التواصل والنشر",
            description: "نفقات النشر والتواصل الخاصة بالأندية"
          }
        ]
      },
      {
        id: "capacity-building",
        name: "نفقات تقوية القدرات",
        description: "تقوية وتأهيل قدرات أطر المؤسسة",
        maxAmount: 5000, // الحد الأقصى 5000 درهم سنوياً
        requiresApproval: true, // يتطلب موافقة كتابية من النائب الإقليمي
        note: "يجب موافقة المجلس التربوي والمجلس التعليمي ومجلس التدبير",
        subcategories: [
          {
            id: "internal-training",
            name: "تكوين داخلي",
            description: "تكوين محلي لتأهيل قدرات الأطر (يتطلب موافقة النائب)"
          }
        ]
      },
      {
        id: "exceptional-expenses",
        name: "نفقات استثنائية",
        description: "نفقات ناتجة عن تدبير ظروف استثنائية",
        requiresNotification: true, // يتطلب إخبار النائب الإقليمي قبل الصرف
        subcategories: [
          {
            id: "supply-disruption",
            name: "تحمل استثنائي ومؤقت النقطاع التموين",
            description: "نفقات انقطاع مفاجئ للتموين عن المطاعم والداخليات"
          },
          {
            id: "infrastructure-emergency",
            name: "أضرار طارئة للبنية التحتية",
            description: "نفقات انهيار سور أو عطب مفاجئ غير متوقع"
          },
          {
            id: "crisis-management",
            name: "نفقات غير متوقعة ناجمة عن تدبير الأزمات",
            description: "نفقات المخطط المدرسي للوقاية من المخاطر"
          }
        ]
      }
    ],

    // القواعد المالية الإلزامية
    financialRules: {
      cashLimit: 1500, // الحد الأقصى للدفع النقدي بالدرهم
      minCashBox: 500, // الحد الأدنى لصندوق النقدية
      maxCashBox: 2500, // الحد الأقصى لصندوق النقدية
      checkNonEndorsable: true, // الشيكات غير قابلة للتظهير
      requiresCompetition: true, // وجوب المنافسة في الشراء
      minCompetitors: 3, // الحد الأدنى للمتنافسين
      bankAccountRequired: true, // وجوب الحساب البنكي
      foreignAidDeclaration
