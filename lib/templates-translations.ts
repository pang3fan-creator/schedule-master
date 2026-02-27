/**
 * Template translations for Arabic (ar)
 *
 * This file contains translations for template data that cannot be stored in messages/*.json
 * because templates are defined in lib/templates.ts as TypeScript objects.
 */

export interface EventTranslation {
  title: string;
  description?: string;
}

export interface TemplateTranslation {
  title: string;
  description: string;
  longDescription: string;
  events?: EventTranslation[];
}

export const TEMPLATE_TRANSLATIONS_AR: Record<string, TemplateTranslation> = {
  "employee-schedule-builder": {
    title: "منظم جداول الموظفين",
    description:
      "منظم مجاني لجداول الموظفين للمدراء. أنشئ وشارك جداول العمل مع فريقك في دقائق.",
    longDescription: `إدارة جداول الموظفين لا يجب أن تكون معقدة. مساعدتنا في منظم جداول الموظفين المجانية تساعد المدراء وأصحاب الأعمال على إنشاء وتنظيم ومشاركة جداول العمل في دقائق.

سواء كنت تدير متجرًا صغيرًا أو مطعمًا أو مركز صحي أو أي عمل يضم عمال يعملون في نوبات، فإن هذه الأداة تجعل الجدولة بسيطة. قم بإعداد نوبات الصباح والمساء والليل، وعين الموظفين لجداول محددة، وتأكد من التغطية المناسبة طوال الأسبوع.

تشمل الفوائد الرئيسية الجدولة بالسحب والإفلات، والنوبات الملونة بالألوان لسهولة العرض، والقدرة على تصدير جدولك كصورة لمشاركتها مع فريقك. لا مزيد من الصداع مع جداول البيانات أو تعارضات الجدولة.`,
    events: [
      // Monday
      { title: "جون - صباحًا", description: "الاستقبال" },
      { title: "سارة - مساءً", description: "الاستقبال" },
      // Tuesday
      { title: "مايك - صباحًا", description: "المستودع" },
      { title: "ليسا - مساءً", description: "المستودع" },
      // Wednesday
      { title: "جون - صباحًا", description: "الاستقبال" },
      { title: "مايك - مساءً", description: "الاستقبال" },
      // Thursday
      { title: "سارة - صباحًا", description: "خدمة العملاء" },
      { title: "ليسا - مساءً", description: "خدمة العملاء" },
      // Friday
      { title: "اجتماع الموظفين", description: "قاعة المؤتمرات" },
      { title: "جون - وردية نهارية", description: "الاستقبال" },
    ],
  },

  "college-class-schedule-builder": {
    title: "منظم جداول الكلية",
    description:
      "منظم مجاني لجداول الكلية للطلاب. خطط لفصلك الدراسي مع منظمنا المرئي سهل الاستخدام.",
    longDescription: `التخطيط لفصلك الدراسي أصبح أسهل الآن. مساعدتنا في منظم جداول الكلية المجانية تساعد الطلاب على تنظيم فصولهم وجلسات الدراسة والأنشطة الجامعية في جدول مرئي واحد.

تم تصميم هذه الأداة خصيصًا للطلاب الجامعيين، وتعرض من الاثنين إلى الجمعة مع فترات زمنية مدتها 15 دقيقة، مثالية لتناسب تلك الفصول والمختبرات المتتالية.

استخدم التشفير بالألوان للتمييز بين المواد، وأضف أرقام القاعات وأسماء الأساتذة في الوصف، وحدد الفترات الفارغة في جدولك لوقت الدراسة أو الأنشطة الجامعية. صادر جدولك لمشاركته مع زملاء الغرفة أو طباعته لغرفتك.`,
    events: [
      // Monday
      { title: "التفاضل والتكامل 101", description: "قاعة 201 - د. سميث" },
      {
        title: "مختبر الفيزياء",
        description: "مبنى العلوم 305",
      },
      { title: "الغداء", description: "مركز الطلاب" },
      { title: "الإنجليزية التأليفية", description: "العلوم الإنسانية 102" },
      // Tuesday
      { title: "الكيمياء", description: "مبنى العلوم 201" },
      { title: "مجموعة الدراسة", description: "المكتبة" },
      { title: "الغداء", description: "مركز الطلاب" },
      { title: "التاريخ", description: "العلوم الإنسانية 305" },
      // Wednesday
      { title: "التفاضل والتكامل 101", description: "قاعة 201 - د. سميث" },
      { title: "علوم الحاسب", description: "مبنى التقنية 101" },
      { title: "الغداء", description: "مركز الطلاب" },
      { title: "ساعات المكتب", description: "مكتب د. سميث" },
      // Thursday
      {
        title: "مختبر الكيمياء",
        description: "مبنى العلوم 310",
      },
      { title: "الغداء", description: "مركز الطلاب" },
      { title: "الإنجليزية التأليفية", description: "العلوم الإنسانية 102" },
      // Friday
      { title: "التفاضل والتكامل 101", description: "قاعة 201 - د. سميث" },
      { title: "الفيزياء", description: "مبنى العلوم 101" },
    ],
  },

  "workout-schedule-builder": {
    title: "منظم تمارين اللياقة البدنية",
    description:
      "منظم مجاني لتمارين اللياقة البدنية. خطط لروتينك الأسبوعي في الصالة الرياضية مع منظمنا المرئي.",
    longDescription: `ارفع مستوى رحلة اللياقة البدنية مع منظم التمارين المجاني الخاص بنا. سواء كنت تتبع روتين الدفع-السحب-الساقين، أو تتدرب لماراثون، أو تحاول فقط البقاء نشيطًا، يساعدك هذا المنظم المرئي على تنظيم تمارينك للأسبوع.

تم تصميم هذه الأداة مع وضع محبي اللياقة البدنية في الاعتبار، حيث يسمح بجدولة مجموعات عضلية محددة، وجلسات cardio، وأيام الراحة، وأوقات تحضير الوجبات. قم بتشفير تمارينك بالألوان للتمييز بين يوم الصدر، يوم الظهر، يوم الساقين وجلسات cardio.

مثالي للمبتدئين الذين ينشئون أول خطة تمارين لهم أو الرياضيين المحترفين الذين يحافظون على جداول تدريب معقدة. صادر خطتك واحفظها على هاتفك للمرجع السريع في الصالة الرياضية.`,
    events: [
      // Sunday
      {
        title: "يوم الراحة",
        description: "استعادة نشطة، تمارين الإطالة",
      },
      {
        title: "مشي خفيف",
        description: "مشية 30 دقيقة في الهواء الطلق",
      },
      // Monday
      {
        title: "صدر وترايسبس",
        description: "ضغط bench، dips، تمارين الضغط",
      },
      { title: "وجبة بروتينية", description: "تغذية ما بعد التدريب" },
      { title: "cardio مسائي", description: "ركض خفيف 20 دقيقة" },
      // Tuesday
      { title: "ظهر وبيبس", description: "pull-ups، rows، curls" },
      { title: "وجبة بروتينية", description: "تغذية ما بعد التدريب" },
      { title: "يوجا", description: "جلسة مرونة 45 دقيقة" },
      // Wednesday
      { title: "cardio", description: "جري 30 دقيقة + HIIT" },
      { title: "تمارين الإطالة", description: "مرونة 15 دقيقة" },
      { title: "تدريب Core", description: "عضلات البطن والوحات" },
      // Thursday
      {
        title: "ساق و Core",
        description: "squats، lunges، planks",
      },
      { title: "وجبة بروتينية", description: "تغذية ما بعد التدريب" },
      {
        title: "مشية استشفاء",
        description: "مشية خفيفة 30 دقيقة",
      },
      // Friday
      {
        title: "كتف وذراع",
        description: "press military، elevate جانبية",
      },
      { title: "وجبة بروتينية", description: "تغذية ما بعد التدريب" },
      {
        title: "إطالة وأسطوانة",
        description: "جلسة استشفاء",
      },
      // Saturday
      { title: "cardio كامل الجسم", description: "سباحة أو ركوب دراجة" },
      {
        title: "تحضير الوجبات",
        description: "تحضير وجبات الأسبوع",
      },
      {
        title: "نشاط في الهواء الطلق",
        description: "مشي لمسافات طويلة أو رياضة",
      },
    ],
  },

  "visual-schedule-builder": {
    title: "منظم الجداول المرئي",
    description:
      "منظم جداول مرئي مجاني للمخططين المبدعين. أنشئ جداول جميلة وملونة بلمحة واحدة.",
    longDescription: `حوّل جدولك من قائمة مملة إلى تحفة فنية مرئية جميلة. يستخدم منظم الجداول المجاني الخاص بنا الألوان والكتل والتصميم البديهي لمساعدتك في رؤية أسبوعك بلمحة واحدة.

مثالي للمتعلمين المرئيين والمهنيين المبدعين وأي شخص يفضل رؤية جدوله بدلاً من قراءته. واجهة السحب والإفلات تجعل من السهل تنظيم وإعادة ترتيب خططك، بينما نظام الترميز اللوني يساعدك في تحديد أنواع الأنشطة المختلفة فوراً.

سواء كنت تخطط لمشروع إبداعي، أو تدير عملاء متعددين، أو تنظم حياتك الشخصية، يساعدك هذا النهج المرئي في الجدولة على اكتشاف التعارضات، وإيجاد وقت فارغ، والحفاظ على التوازن في جميع مجالات حياتك.`,
    events: [
      // Monday
      { title: "عمل إبداعي", description: "مشاريع التصميم" },
      { title: "الغداء", description: "استراحة" },
      { title: "مكالمات العملاء", description: "اجتماعات" },
      // Tuesday
      {
        title: "مهام إدارية",
        description: "البريد والتخطيط",
      },
      { title: "تصوير", description: "جلسة خارجية" },
      // Wednesday
      { title: "عمل إبداعي", description: "الرسم" },
      { title: "غداء عمل", description: "مناقشة مع عميل" },
      { title: "وسائل التواصل الاجتماعي", description: "إنشاء محتوى" },
      // Thursday
      { title: "ورشة عمل", description: "جلسة تدريس" },
      { title: "وقت شخصي", description: "العناية الذاتية" },
      // Friday
      {
        title: "مراجعة المشروع",
        description: "مزامنة الفريق",
      },
      { title: "عمل إبداعي", description: "إنهاء المشاريع" },
    ],
  },

  "ai-schedule-builder": {
    title: "منظم الجداول بالذكاء الاصطناعي",
    description:
      "أنشئ جدولاً أسبوعياً مخصصاً في ثوانٍ باستخدام الذكاء الاصطناعي. جدولة ذكية ومؤتمتة مصممة وفقاً ل إنتاجيتك ومستويات طاقتك وأهدافك.",
    longDescription: `عش مستقبل إدارة الوقت مع منظم الجداول بالذكاء الاصطناعي الخاص بنا. بدلاً من البدء بقالب جامد، تستخدم هذه الأداة خوارزميات متقدمة لمساعدتك في إنشاء خطة أسبوعية محسنة من الصفر.

ما عليك سوى تطبيق هذا القالب، وسيوجهك مساعد الإكمال التلقائي بالذكاء الاصطناعي لإنشاء جدول يوازن بين العمل العميق والراحة والأولويات الشخصية. يأخذ نظامنا الذكي في الاعتبار أفضل ممارسات الإنتاجية، مثل معالجة المهام المعقدة أثناء ساعات ذروة الطاقة لديك، لخلق روتين يعمل حقاً.

سواء كنت مؤسس مشغولاً يزيد من النتائج، أو طالباً يوازن بين عبء الدورات الثقيل، أو أي شخص يسعى لاستعادة وقته، فإن مولد الجداول بالذكاء الاصطناعي الخاص بنا يُلغي العبء الأكبر من تخطيط أسبوعك.`,
    events: [],
  },

  "work-shift-schedule-builder": {
    title: "منظم جداول ورديات العمل",
    description:
      "منظم مجاني لجداول ورديات العمل للمديرين. أنشئ ورديات متناوبة للفرق الصباحية والمسائية والليلية.",
    longDescription: `بسّط جدول وردياتك مع منظم جداول ورديات العمل المجاني الخاص بنا. مصمم للمديرين والمشرفين وأصحاب الأعمال الذين يحتاجون إلى تنسيق ورديات العمل المتناوبة بين الفرق.

سواء كنت تدير عملية على مدار 24 ساعة، أو مطعم مع ورديات مقسمة، أو منشأة صحية مع ممرضات متناوبات، أو مصنع بفرق نهارية وليلية، فإن منظم الورديات المرئي هذا يسهل تنظيم التغطية وإيصال الجداول بوضوح.

يعرض منظم الجداول البديهي الخاص بنا ورديات ملونة للتمييز بين الورديات الصباحية (النهار) والمسائية (الوسطى) والليلية (الليلة) بلمحة واحدة. تتيح لك واجهة السحب والإفلات تعيين الموظفين بسرعة، وتبديل الورديات وضمان التغطية المناسبة. أبرز الورديات الليلية بالأرجواني للرؤية الفورية، وقم بتصدير قائمتك الكاملة لمشاركتها مع فريقك عبر البريد الإلكتروني أو طباعتها لغرفة الاستراحة.

توقف عن النضال مع جداول البيانات وابدأ في إنشاء جداول ورديات احترافية في دقائق.`,
    events: [
      // Sunday
      { title: "الوردية الليلية - الفريق ج", description: "تغطية ليلية" },
      { title: "الوردية النهارية - الفريق أ", description: "فريق الصباح" },
      { title: "الوردية المسائية - الفريق ب", description: "مساء/ليل" },
      // Monday
      { title: "الوردية الليلية - الفريق ج", description: "جدول ليلي" },
      {
        title: "الوردية النهارية - الفريق أ",
        description: "عمليات صباحية",
      },
      { title: "الوردية المسائية - الفريق ب", description: "مساء/ليل" },
      // Tuesday
      { title: "الوردية الليلية - الفريق أ", description: "تبديل إلى ليالي" },
      { title: "الوردية النهارية - الفريق ب", description: "تبديل إلى أيام" },
      { title: "الوردية المسائية - الفريق ج", description: "تبديل إلى مسائية" },
      // Wednesday
      { title: "الوردية الليلية - الفريق أ", description: "فريق ليلي" },
      { title: "الوردية النهارية - الفريق ب", description: "فريق نهاري" },
      { title: "الوردية المسائية - الفريق ج", description: "فريق مسائي" },
      // Thursday
      { title: "الوردية الليلية - الفريق أ", description: "فريق ليلي" },
      { title: "الوردية النهارية - الفريق ب", description: "فريق نهاري" },
      { title: "اجتماع عام", description: "مزامنة شهرية" },
      { title: "الوردية المسائية - الفريق ج", description: "فريق مسائي" },
      // Friday
      { title: "الوردية الليلية - الفريق ب", description: "تبديل إلى ليالي" },
      { title: "الوردية النهارية - الفريق ج", description: "تبديل إلى أيام" },
      { title: "الوردية المسائية - الفريق أ", description: "تبديل إلى مسائية" },
      // Saturday
      {
        title: "الوردية الليلية - الفريق ب",
        description: "ليالي نهاية الأسبوع",
      },
      { title: "الوردية النهارية - الفريق ج", description: "أيام نهاية الأسبوع" },
      { title: "الوردية المسائية - الفريق أ", description: "مساءات نهاية الأسبوع" },
    ],
  },

  "homeschool-schedule-builder": {
    title: "منظم جداول التعليم المنزلي",
    description:
      "منظم مجاني لجداول التعليم المنزلي للعائلات. صمم روتينات تعليمية مرنة تناسب رحلة التعليم المنزلي لأسرتك.",
    longDescription: `أنشئ جدولاً مثالياً للتعليم المنزلي مع منظم الجداول المجاني للتعليم المنزلي، المصمم خصيصاً للعائلات التي تتبع التعليم المنزلي. سواء كنت تُعلّم طفلاً واحداً أو تدير مستويات دراسية متعددة، يساعدك هذا المنظم البصري في تنظيم المواد الدراسية والاستراحات والأنشطة في روتين أسبوعي متوازن.

واجهة سهلة الاستخدام تساعدك في التخطيط بسهولة للمواد الأساسية مثل الرياضيات والقراءة والعلوم والتاريخ مع أنشطة غنية مثل الفنون والموسيقى والتربية البدنية. استعمل الترميز اللوني للمواد المختلفة للإشارة البصرية السريعة، وخصص استراحات منتظمة لإبقاء أطفالك متحمسين ومتجددين.

التصميم المرن يتناسب مع أساليب مختلفة للتعليم المنزلي، من التعليم الكلاسيكي المنظم إلى التعلم الحر غير المقيد. اسحب وأفلت لتعديل أوقات الدروس، وإضافة رحلات وأنشطة خارج المنهج، أو إنشاء جداول مختلفة لكل طفل. قم بتصدير جدولك الكامل للطباعة في مساحة التعلم أو مشاركته رقمياً مع مجموعات التعاون والمعلمين.

مثالي لعائلات التعليم المنزلي الجديدة التي تبدأ رحلتها أو المربين المخضرمين الذين يُحسّنون روتينهم. أنشئ جدولاً يعمل لأسرتك أنت!`,
    events: [
      // Monday
      { title: "دائرة الصباح", description: "التقويم، الطقس، القراءة" },
      { title: "الرياضيات", description: "درس + تدريب" },
      { title: "وجبة خفيفة", description: "وجبة خفيفة صحية" },
      { title: "القراءة", description: "الأدب / الصوتيات" },
      { title: "العلوم", description: "تجارب عملية" },
      { title: "الغداء واللعب الحر", description: "غداء عائلي" },
      { title: "الكتابة", description: "اليوميات / الخط" },
      { title: "الفنون", description: "مشروعات إبداعية" },
      // Tuesday
      { title: "دائرة الصباح", description: "روتين يومي" },
      { title: "الرياضيات", description: "مفاهيم جديدة + مراجعة" },
      { title: "وجبة خفيفة", description: "استراحة حركة" },
      { title: "القراءة", description: "وقت القراءة الصامتة" },
      { title: "التاريخ", description: "تاريخ العالم" },
      { title: "الغداء واللعب الحر", description: "وقت في الهواء الطلق" },
      { title: "الموسيقى", description: "تمرين على الآلات" },
      { title: "التربية البدنية", description: "نشاط بدني" },
      // Wednesday
      { title: "دائرة الصباح", description: "حفظ الأشعار" },
      { title: "الرياضيات", description: "أوراق عمل + ألعاب" },
      { title: "وجبة خفيفة", description: "زاوية القراءة" },
      { title: "القراءة", description: "مناقشة الكتب" },
      { title: "دراسة الطبيعة", description: "استكشاف خارجي" },
      { title: "الغداء واللعب الحر", description: "نشاط خارجي إن سمح الطقس" },
      { title: "زيارة المكتبة", description: "رحلة أسبوعية" },
      // Thursday
      { title: "دائرة الصباح", description: "أنشطة التقويم" },
      { title: "الرياضيات", description: "حل المشكلات" },
      { title: "وجبة خفيفة", description: "استراحة تمدد" },
      { title: "القراءة", description: "قراءة جماعية بصوت عالٍ" },
      { title: "الجغرافيا", description: "خرائط + ثقافة" },
      { title: "الغداء واللعب الحر", description: "ألعاب داخلية" },
      { title: "الكتابة", description: "كتابة إبداعية" },
      { title: "مشروع يدوي", description: "إنشاء عملي" },
      // Friday
      { title: "دائرة الصباح", description: "مراجعة الأسبوع" },
      { title: "الرياضيات", description: "ألعاب + مراجعة" },
      { title: "وجبة خفيفة", description: "وجبة خفيفة للاحتفال" },
      { title: "القراءة", description: "قراءة حرة" },
      { title: "عرض وشرح", description: "مشاركة ما تعلمته" },
      { title: "رحلة / تعاونية", description: "أنشطة جماعية" },
    ],
  },

  "construction-schedule-builder": {
    title: "منظم جداول البناء",
    description:
      "منظم احترافي لجداول البناء للمقاولين ومديري المشاريع. خطط للجداول الزمنية وتتبع المعالم وإدارة الفرق بكفاءة.",
    longDescription: `أتقن مشاريع البناء الخاصة بك مع منظم جداول البناء الاحترافي. مصمم خصيصاً للمقاولين ومديري المواقع وفرق البناء الذين يحتاجون إلى إدارة قوية للجداول دون تعقيد البرامج التقليدية.

خطط لكل مرحلة من مراحل البناء من إعداد الموقع إلى التفتيش النهائي. يساعدك نهجنا البصري على غرار مخطط غانت في تحديد المسارات الحرجة وإدارة انتقالات الفرق وضمان وصول المواد في الوقت المحدد.

تشمل الميزات الرئيسية التتبع القائم على المراحل (الهدم، الأساس، الهيكل، التجديد)، وتخصيص الموارد ومراقبة المعالم. طريقة العرض البديهية للجدول تكتشف التأخيرات المحتملة مبكراً، وتنسيق المقاولين من الباطن بكفاءة، وإبقاء العملاء على اطلاع بتقارير تقدم احترافية.

مثالي للبناء السكني ومشاريع التجديد والتكيفات التجارية. تحكم في موقع عملك بجدول يعمل بجد كفريقك.`,
    events: [
      // Week 1
      { title: "تحضير الموقع", description: "الحفر والتسوية" },
      { title: "تحضير الموقع", description: "الحفر والتسوية" },
      { title: "قوالب الأساس", description: "وضع القوالب" },
      { title: "صب الأساس", description: "وصول شاحنة الخرسانة" },
      { title: "فترة المعالجة", description: "لا حركة ثقيلة" },
      // Overlapping
      { title: "تسليم المواد", description: "تسليم الخشب" },
      { title: "اجتماع في الموقع", description: "جولة مع المالك" },
      // Weekend
      { title: "فحص السلامة", description: "مراجعة أسبوعية محيطية" },
    ],
  },

  "cleaning-schedule-builder": {
    title: "منظم جداول التنظيف",
    description:
      "منظم مجاني لجداول التنظيف القابلة للطباعة للمنازل. أنشئ جداول مهام وروتينات تنظيف لعائلتك أو roommates.",
    longDescription: `حافظ على منزلك نظيفاً مع منظم جداول التنظيف المجاني. سواء كنت والداً مشغولاً يدير مهام المنزل، أو زملاء يقسمون مهام التنظيف، أو أي شخص يريد مواكبة الأعمال المنزلية، يجعل هذا المنظم البصري التنظيف قابلاً للإدارة ومنظماً.

منظم الجدول على شكل قائمة مهام يساعدك في تقسيم مهام التنظيف إلى روتينات يومية وأسبوعية وشهرية. عيّن مهام محددة لأيام مختلفة، ورجّع المسؤوليات بين أفراد المنزل، ولا تنسَ مهام التنظيف العميق السهلة التي يمكن التغاضي عنها.

رمّز المهام حسب الغرفة (مطبخ، حمام، غرفة نوم، غرفة معيشة) أو حسب الشخص للحالات المعيشية المشتركة. التنسيق البصري يسهل معرفة من المسؤول عن ماذا ومتى. قم بتصدير جدول التنظيف كقائمة قابلة للطباعة لتعلقها على الثلاجة أو شاركها رقمياً مع الآخرين.

مثالي لإنشاء روتينات التنظيف، تعليم الأطفال المسؤولية، التنسيق مع خدمة التنظيف، أو الحفاظ على مساحة معيشة سلمية وخالية من الفوضى. يبدأ المنزل النظيف بخطة جيدة!`,
    events: [
      // Sunday
      { title: "الغسيل الأسبوعي", description: "غسل وتجفيف وكي ملابس" },
      { title: "تغيير الشراشف", description: "جميع غرف النوم" },
      { title: "تحضير الوجبات وتنظيف المطبخ", description: "تنظيف الأجهزة والثلاجة" },
      // Monday
      { title: "ترتيب الصباح", description: "ترتيب الأسرّة، جمع سريع" },
      { title: "تنظيف المطبخ", description: "غسل الصحون، مسح الأسطح، كنس" },
      { title: "إخراج القمامة", description: "جميع الغرف" },
      // Tuesday
      { title: "ترتيب الصباح", description: "ترتيب الأسرّة، جمع سريع" },
      { title: "تنظيف الحمام", description: "غسل المرحاض، المغسلة، المرآة" },
      { title: "كنس غرفة المعيشة", description: "الأرضيات والسماعات" },
      // Wednesday
      { title: "ترتيب الصباح", description: "ترتيب الأسرّة، جمع سريع" },
      { title: "تنظيف المطبخ", description: "غسل الصحون، مسح الأسطح" },
      { title: "مسح الغبار", description: "غرفة المعيشة وغرف النوم" },
      // Thursday
      { title: "ترتيب الصباح", description: "ترتيب الأسرّة، جمع سريع" },
      { title: "مسح الأرضيات", description: "المطبخ والحمام" },
      { title: "تنظيف الأجهزة", description: "الميكروويف، الموقد" },
      // Friday
      { title: "ترتيب الصباح", description: "ترتيب الأسرّة، جمع سريع" },
      { title: "مراجعة الحمام", description: "المغسلة والمرآة" },
      { title: "كنس غرف النوم", description: "أرضيات غرف النوم" },
      { title: "إخراج القمامة", description: "الاستعداد للجمع" },
      // Saturday
      { title: "مهمة تنظيف عميق", description: "تدوير: النوافذ، قواعد الأبواب، إلخ" },
      { title: "ترتيب وتنظيف", description: "التركيز على غرفة واحدة" },
      { title: "التسوق وإعادة التخزين", description: "فحص مستلزمات التنظيف" },
    ],
  },
};

/**
 * Template translations for Spanish (es)
 *
 * This file contains translations for template data that cannot be stored in messages/*.json
 * because templates are defined in lib/templates.ts as TypeScript objects.
 */

export interface EventTranslation {
  title: string;
  description?: string;
}

export interface TemplateTranslation {
  title: string;
  description: string;
  longDescription: string;
  events?: EventTranslation[];
}

export const TEMPLATE_TRANSLATIONS_ES: Record<string, TemplateTranslation> = {
  "employee-schedule-builder": {
    title: "Constructor de Horarios para Empleados",
    description:
      "Constructor gratuito de horarios de empleados para gerentes. Crea y comparte horarios de trabajo con tu equipo en minutos.",
    longDescription: `Administrar los horarios de empleados no tiene que ser complicado. Nuestro Constructor Gratuito de Horarios para Empleados ayuda a gerentes y dueños de negocios a crear, organizar y compartir horarios de trabajo en minutos.

Ya sea que manejes una tienda minorista, restaurante, centro de salud o cualquier negocio con trabajadores por turnos, esta herramienta hace que la programación sea simple. Configura turnos de mañana, tarde y noche, asigna empleados a horarios específicos y asegura la cobertura adecuada durante toda la semana.

Los beneficios clave incluyen programación de arrastrar y soltar, turnos codificados por colores para fácil visualización, y la capacidad de exportar tu horario como imagen para compartir con tu equipo. No más dolores de cabeza con hojas de cálculo ni conflictos de programación.`,
    events: [
      // Monday
      { title: "John - Mañana", description: "Recepción" },
      { title: "Sarah - Tarde", description: "Recepción" },
      // Tuesday
      { title: "Mike - Mañana", description: "Almacén" },
      { title: "Lisa - Tarde", description: "Almacén" },
      // Wednesday
      { title: "John - Mañana", description: "Recepción" },
      { title: "Mike - Tarde", description: "Recepción" },
      // Thursday
      { title: "Sarah - Mañana", description: "Servicio al Cliente" },
      { title: "Lisa - Tarde", description: "Servicio al Cliente" },
      // Friday
      { title: "Reunión de Personal", description: "Sala de Conferencias" },
      { title: "John - Turno Día", description: "Recepción" },
    ],
  },

  "college-class-schedule-builder": {
    title: "Constructor de Horarios Universitarios",
    description:
      "Constructor gratuito de horarios de clases universitarias para estudiantes. Planifica tu semestre con nuestro planificador visual fácil de usar.",
    longDescription: `Planificar tu semestre universitario ahora es más fácil. Nuestro Constructor Gratuito de Horarios de Clases Universitarias ayuda a los estudiantes a organizar sus clases, sesiones de estudio y actividades del campus en un solo horario visual.

Diseñado específicamente para estudiantes universitarios, esta herramienta presenta una vista de lunes a viernes con incrementos de tiempo de 15 minutos, perfecta para encajar esas clases y laboratorios consecutivos.

Usa la codificación por colores para diferenciar entre materias, agrega números de aula y nombres de profesores en la descripción, e identifica espacios vacíos en tu horario para tiempo de estudio o trabajos en el campus. Exporta tu horario para compartir con compañeros de cuarto o imprimir para tu habitación.`,
    events: [
      // Monday
      { title: "Cálculo 101", description: "Aula 201 - Prof. Smith" },
      {
        title: "Laboratorio de Física",
        description: "Edificio de Ciencias 305",
      },
      { title: "Almuerzo", description: "Centro Estudiantil" },
      { title: "Composición en Inglés", description: "Humanidades 102" },
      // Tuesday
      { title: "Química", description: "Edificio de Ciencias 201" },
      { title: "Grupo de Estudio", description: "Biblioteca" },
      { title: "Almuerzo", description: "Centro Estudiantil" },
      { title: "Historia", description: "Humanidades 305" },
      // Wednesday
      { title: "Cálculo 101", description: "Aula 201 - Prof. Smith" },
      { title: "Ciencias de la Computación", description: "Edificio Tech 101" },
      { title: "Almuerzo", description: "Centro Estudiantil" },
      { title: "Horas de Oficina", description: "Oficina del Prof. Smith" },
      // Thursday
      {
        title: "Laboratorio de Química",
        description: "Edificio de Ciencias 310",
      },
      { title: "Almuerzo", description: "Centro Estudiantil" },
      { title: "Composición en Inglés", description: "Humanidades 102" },
      // Friday
      { title: "Cálculo 101", description: "Aula 201 - Prof. Smith" },
      { title: "Física", description: "Edificio de Ciencias 101" },
    ],
  },

  "workout-schedule-builder": {
    title: "Constructor de Horarios de Ejercicio",
    description:
      "Constructor gratuito de horarios de entrenamiento para entusiastas del fitness. Planifica tu rutina semanal de gimnasio con nuestro planificador visual.",
    longDescription: `Lleva tu viaje de fitness al siguiente nivel con nuestro Constructor Gratuito de Horarios de Ejercicio. Ya sea que sigas una rutina de empujar-tirar-piernas, entrenes para un maratón, o simplemente intentes mantenerte activo, este planificador visual te ayuda a organizar tus entrenamientos para la semana.

Diseñado pensando en los entusiastas del fitness, esta herramienta te permite programar grupos musculares específicos, sesiones de cardio, días de descanso y tiempos de preparación de comidas. Codifica por colores tus entrenamientos para distinguir entre día de pecho, día de espalda, día de piernas y sesiones de cardio.

Perfecto para principiantes creando su primer plan de entrenamiento o atletas experimentados manteniendo horarios de entrenamiento complejos. Exporta tu plan y guárdalo en tu teléfono para referencia rápida en el gimnasio.`,
    events: [
      // Sunday
      {
        title: "Día de Descanso",
        description: "Recuperación activa, estiramiento",
      },
      {
        title: "Caminata Ligera",
        description: "Caminata de 30 min al aire libre",
      },
      // Monday
      {
        title: "Pecho y Tríceps",
        description: "Press de banca, fondos, flexiones",
      },
      { title: "Comida Proteica", description: "Nutrición post-entrenamiento" },
      { title: "Cardio Vespertino", description: "Trote ligero de 20 min" },
      // Tuesday
      { title: "Espalda y Bíceps", description: "Dominadas, remos, curls" },
      { title: "Comida Proteica", description: "Nutrición post-entrenamiento" },
      { title: "Yoga", description: "Sesión de flexibilidad de 45 min" },
      // Wednesday
      { title: "Cardio", description: "Carrera de 30 min + HIIT" },
      { title: "Estiramiento", description: "Flexibilidad de 15 min" },
      { title: "Entrenamiento de Core", description: "Abdominales y planchas" },
      // Thursday
      {
        title: "Piernas y Core",
        description: "Sentadillas, estocadas, planchas",
      },
      { title: "Comida Proteica", description: "Nutrición post-entrenamiento" },
      {
        title: "Caminata de Recuperación",
        description: "Caminata ligera de 30 min",
      },
      // Friday
      {
        title: "Hombros y Brazos",
        description: "Press militar, elevaciones laterales",
      },
      { title: "Comida Proteica", description: "Nutrición post-entrenamiento" },
      {
        title: "Estiramiento y Rodillo",
        description: "Sesión de recuperación",
      },
      // Saturday
      { title: "Cardio Cuerpo Completo", description: "Natación o ciclismo" },
      {
        title: "Preparación de Comidas",
        description: "Preparar comidas de la semana",
      },
      {
        title: "Actividad al Aire Libre",
        description: "Senderismo o deportes",
      },
    ],
  },

  "visual-schedule-builder": {
    title: "Constructor Visual de Horarios",
    description:
      "Constructor visual gratuito de horarios para planificadores creativos. Crea horarios hermosos y codificados por colores de un vistazo.",
    longDescription: `Transforma tu horario de una lista aburrida en una hermosa obra maestra visual. Nuestro Constructor Visual Gratuito de Horarios utiliza colores, bloques y diseño intuitivo para ayudarte a ver tu semana de un vistazo.

Perfecto para aprendices visuales, profesionales creativos y cualquier persona que prefiera ver su horario en lugar de leerlo. La interfaz de arrastrar y soltar facilita organizar y reorganizar tus planes, mientras que el sistema de codificación por colores te ayuda a identificar instantáneamente diferentes tipos de actividades.

Ya sea que estés planificando un proyecto creativo, gestionando múltiples clientes o organizando tu vida personal, este enfoque visual de la programación te ayuda a detectar conflictos, encontrar tiempo libre y mantener el equilibrio en todas las áreas de tu vida.`,
    events: [
      // Monday
      { title: "Trabajo Creativo", description: "Proyectos de diseño" },
      { title: "Almuerzo", description: "Descanso" },
      { title: "Llamadas de Clientes", description: "Reuniones" },
      // Tuesday
      {
        title: "Tareas Administrativas",
        description: "Correos, planificación",
      },
      { title: "Fotografía", description: "Sesión al aire libre" },
      // Wednesday
      { title: "Trabajo Creativo", description: "Ilustración" },
      { title: "Reunión de Almuerzo", description: "Discusión con cliente" },
      { title: "Redes Sociales", description: "Creación de contenido" },
      // Thursday
      { title: "Taller", description: "Sesión de enseñanza" },
      { title: "Tiempo Personal", description: "Autocuidado" },
      // Friday
      {
        title: "Revisión de Proyecto",
        description: "Sincronización de equipo",
      },
      { title: "Trabajo Creativo", description: "Terminar proyectos" },
    ],
  },

  "ai-schedule-builder": {
    title: "Constructor de Horarios con IA",
    description:
      "Genera un horario semanal personalizado en segundos con IA. Programación inteligente y automatizada adaptada a tu productividad, niveles de energía y objetivos.",
    longDescription: `Experimenta el futuro de la gestión del tiempo con nuestro Constructor de Horarios con IA. En lugar de comenzar con una plantilla rígida, esta herramienta utiliza algoritmos avanzados para ayudarte a generar un plan semanal optimizado desde cero.

Simplemente aplica esta plantilla, y nuestro asistente de Autocompletado con IA te guiará para crear un horario que equilibre el trabajo profundo, el descanso y las prioridades personales. Nuestro sistema inteligente considera las mejores prácticas de productividad, como abordar tareas complejas durante tus horas de máxima energía, para crear una rutina que realmente funcione.

Ya seas un fundador ocupado maximizando resultados, un estudiante equilibrando cargas pesadas de cursos, o cualquier persona que busque recuperar su tiempo, nuestro Generador de Horarios con IA elimina el trabajo pesado de planificar tu semana.`,
    events: [],
  },

  "work-shift-schedule-builder": {
    title: "Constructor de Horarios de Turnos de Trabajo",
    description:
      "Constructor gratuito de horarios de turnos de trabajo para gerentes. Crea turnos rotativos para equipos de mañana, tarde y noche.",
    longDescription: `Simplifica tu programación de turnos con nuestro Constructor Gratuito de Horarios de Turnos de Trabajo. Diseñado para gerentes, supervisores y dueños de negocios que necesitan coordinar turnos de trabajo rotativos entre equipos.

Ya sea que administres una operación 24/7, un restaurante con turnos divididos, una instalación de salud con enfermeras rotativas, o una planta de manufactura con equipos de día y noche, este planificador visual de turnos facilita organizar la cobertura y comunicar horarios claramente.

Nuestro intuitivo constructor de horarios presenta turnos codificados por colores para distinguir entre turnos de mañana (día), tarde (intermedio) y noche (nocturno) de un vistazo. La interfaz de arrastrar y soltar te permite asignar empleados rápidamente, intercambiar turnos y asegurar la cobertura adecuada. Resalta los turnos nocturnos en púrpura para visibilidad instantánea, y exporta tu lista completa para compartir con tu equipo por correo electrónico o imprimir para la sala de descanso.

Deja de luchar con hojas de cálculo y comienza a crear horarios de turnos profesionales en minutos.`,
    events: [
      // Sunday
      { title: "Turno Nocturno - Equipo C", description: "Cobertura nocturna" },
      { title: "Turno Diurno - Equipo A", description: "Equipo de mañana" },
      { title: "Turno Tarde - Equipo B", description: "Tarde/noche" },
      // Monday
      { title: "Turno Nocturno - Equipo C", description: "Horario nocturno" },
      {
        title: "Turno Diurno - Equipo A",
        description: "Operaciones matutinas",
      },
      { title: "Turno Tarde - Equipo B", description: "Tarde/noche" },
      // Tuesday
      { title: "Turno Nocturno - Equipo A", description: "Rotación a noches" },
      { title: "Turno Diurno - Equipo B", description: "Rotación a días" },
      { title: "Turno Tarde - Equipo C", description: "Rotación a tarde" },
      // Wednesday
      { title: "Turno Nocturno - Equipo A", description: "Equipo nocturno" },
      { title: "Turno Diurno - Equipo B", description: "Equipo diurno" },
      { title: "Turno Tarde - Equipo C", description: "Equipo vespertino" },
      // Thursday
      { title: "Turno Nocturno - Equipo A", description: "Equipo nocturno" },
      { title: "Turno Diurno - Equipo B", description: "Equipo diurno" },
      { title: "Reunión General", description: "Sincronización mensual" },
      { title: "Turno Tarde - Equipo C", description: "Equipo vespertino" },
      // Friday
      { title: "Turno Nocturno - Equipo B", description: "Rotación a noches" },
      { title: "Turno Diurno - Equipo C", description: "Rotación a días" },
      { title: "Turno Tarde - Equipo A", description: "Rotación a tarde" },
      // Saturday
      {
        title: "Turno Nocturno - Equipo B",
        description: "Noches fin de semana",
      },
      { title: "Turno Diurno - Equipo C", description: "Días fin de semana" },
      { title: "Turno Tarde - Equipo A", description: "Tardes fin de semana" },
    ],
  },

  "homeschool-schedule-builder": {
    title: "Constructor de Horarios para Educación en Casa",
    description:
      "Constructor gratuito de horarios de educación en casa para familias. Diseña rutinas de aprendizaje flexibles que funcionen para tu viaje de educación en el hogar.",
    longDescription: `Crea el horario perfecto de educación en casa con nuestro Constructor Gratuito de Horarios para Educación en Casa, diseñado específicamente para familias que educan en el hogar. Ya sea que enseñes a un niño o administres múltiples niveles de grado, este planificador visual te ayuda a organizar materias, descansos y actividades en una rutina semanal equilibrada.

Nuestra interfaz cálida y familiar facilita planificar materias básicas como Matemáticas, Lectura, Ciencias e Historia junto con actividades de enriquecimiento como Arte, Música y Educación Física. Codifica por colores diferentes materias para referencia visual rápida, y programa descansos regulares para mantener a tus hijos comprometidos y renovados.

El diseño flexible se adapta a varios enfoques de educación en casa, desde la educación clásica estructurada hasta el unschooling relajado. Arrastra y suelta para ajustar tiempos de lección, agregar excursiones y actividades extracurriculares, o crear horarios diferentes para cada niño. Exporta tu horario completo para imprimir en el espacio de aprendizaje o compartir digitalmente con grupos cooperativos y tutores.

Perfecto para nuevas familias de educación en casa comenzando su viaje o educadores experimentados refinando su rutina. ¡Construye un horario que funcione para TU familia, no un enfoque único de aula!`,
    events: [
      // Monday
      { title: "Círculo Matutino", description: "Calendario, clima, lectura" },
      { title: "Matemáticas", description: "Lección + práctica" },
      { title: "Refrigerio", description: "Merienda saludable" },
      { title: "Lectura", description: "Fonética / literatura" },
      { title: "Ciencias", description: "Experimentos prácticos" },
      { title: "Almuerzo y Juego Libre", description: "Almuerzo familiar" },
      { title: "Escritura", description: "Diario / caligrafía" },
      { title: "Arte", description: "Proyectos creativos" },
      // Tuesday
      { title: "Círculo Matutino", description: "Rutina diaria" },
      { title: "Matemáticas", description: "Conceptos nuevos + repaso" },
      { title: "Refrigerio", description: "Descanso de movimiento" },
      { title: "Lectura", description: "Tiempo de lectura silenciosa" },
      { title: "Historia", description: "Historia del Mundo" },
      { title: "Almuerzo y Juego Libre", description: "Tiempo al aire libre" },
      { title: "Música", description: "Práctica de instrumentos" },
      { title: "Ed. Física / Deportes", description: "Actividad física" },
      // Wednesday
      { title: "Círculo Matutino", description: "Memorización de poesía" },
      { title: "Matemáticas", description: "Juegos + hojas de trabajo" },
      { title: "Refrigerio", description: "Rincón de lectura" },
      { title: "Lectura", description: "Discusión de libros" },
      {
        title: "Estudio de Naturaleza",
        description: "Exploración al aire libre",
      },
      {
        title: "Almuerzo y Juego Libre",
        description: "Picnic si el clima permite",
      },
      { title: "Visita a Biblioteca", description: "Viaje semanal" },
      // Thursday
      { title: "Círculo Matutino", description: "Actividades de calendario" },
      { title: "Matemáticas", description: "Resolución de problemas" },
      { title: "Refrigerio", description: "Descanso de estiramiento" },
      { title: "Lectura", description: "Lectura en voz alta juntos" },
      { title: "Geografía", description: "Mapas + cultura" },
      { title: "Almuerzo y Juego Libre", description: "Juegos interiores" },
      { title: "Escritura", description: "Escritura creativa" },
      { title: "Proyecto Manual", description: "Creación práctica" },
      // Friday
      { title: "Círculo Matutino", description: "Repaso de la semana" },
      { title: "Matemáticas", description: "Juegos de azar / repaso" },
      { title: "Refrigerio", description: "Merienda de celebración" },
      { title: "Lectura", description: "Lectura de libre elección" },
      { title: "Mostrar y Contar", description: "Compartir lo aprendido" },
      { title: "Excursión / Cooperativa", description: "Actividades grupales" },
    ],
  },

  "construction-schedule-builder": {
    title: "Constructor de Cronogramas de Construcción",
    description:
      "Constructor profesional de cronogramas de construcción para contratistas y gerentes de proyecto. Planifica cronogramas, rastrea hitos y gestiona equipos eficientemente.",
    longDescription: `Domina tus proyectos de construcción con nuestro Constructor Profesional de Cronogramas de Construcción. Diseñado específicamente para contratistas generales, gerentes de sitio y equipos de construcción que necesitan una gestión robusta de cronogramas sin la complejidad del software heredado.

Planifica cada fase de tu construcción desde la preparación del sitio hasta la inspección final. Nuestro enfoque visual estilo Gantt te ayuda a identificar rutas críticas, gestionar relevos de equipos y asegurar que los materiales lleguen exactamente cuando se necesitan.

Las características clave incluyen seguimiento basado en fases (Demolición, Cimentación, Estructura, Servicios), asignación de recursos y monitoreo de hitos. La vista intuitiva del cronograma te permite detectar posibles retrasos temprano, coordinar subcontratistas efectivamente y mantener a los clientes actualizados con informes profesionales de progreso.

Perfecto para construcciones residenciales, proyectos de renovación y adaptaciones comerciales. Toma el control de tu sitio de trabajo con un cronograma que trabaja tan duro como tu equipo.`,
    events: [
      // Week 1
      {
        title: "Preparación del Sitio",
        description: "Excavación y nivelación",
      },
      {
        title: "Preparación del Sitio",
        description: "Excavación y nivelación",
      },
      { title: "Encofrado de Cimientos", description: "Colocación de moldes" },
      {
        title: "Vertido de Cimientos",
        description: "Llegada de camión de hormigón",
      },
      { title: "Período de Curado", description: "Sin tráfico pesado" },

      // Overlapping
      { title: "Entrega de Materiales", description: "Entrega de madera" },
      { title: "Reunión en Sitio", description: "Recorrido con propietario" },

      // Weekend
      {
        title: "Control de Seguridad",
        description: "Revisión perimetral semanal",
      },
    ],
  },

  "cleaning-schedule-builder": {
    title: "Constructor de Horarios de Limpieza",
    description:
      "Constructor gratuito de horarios de limpieza imprimibles para hogares. Crea tablas de tareas y rutinas de limpieza para tu familia o compañeros de cuarto.",
    longDescription: `Mantén tu hogar impecable con nuestro Constructor Gratuito de Horarios de Limpieza. Ya seas un padre ocupado administrando tareas del hogar, compañeros de cuarto dividiendo labores de limpieza, o cualquier persona que quiera mantenerse al día con las tareas domésticas, este planificador visual hace que la limpieza sea manejable y organizada.

Nuestro constructor de horarios estilo lista de verificación te ayuda a dividir las tareas de limpieza en rutinas diarias, semanales y mensuales. Asigna tareas específicas a diferentes días, rota responsabilidades entre los miembros del hogar, y nunca olvides esos trabajos de limpieza profunda fáciles de pasar por alto.

Codifica las tareas por colores según la habitación (cocina, baño, dormitorio, sala de estar) o por persona para situaciones de vida compartida. El formato visual facilita ver quién es responsable de qué y cuándo. Exporta tu horario de limpieza como una lista imprimible para colgar en el refrigerador o comparte digitalmente con compañeros de cuarto.

Perfecto para establecer rutinas de limpieza, enseñar responsabilidad a los niños, coordinar con un servicio de limpieza, o mantener un espacio de vida pacífico y libre de desorden. ¡Un hogar limpio comienza con un buen plan!`,
    events: [
      // Sunday
      { title: "Lavandería Semanal", description: "Lavar, secar, doblar ropa" },
      { title: "Cambiar Sábanas", description: "Todos los dormitorios" },
      {
        title: "Prep. Comidas y Limpieza Cocina",
        description: "Limpiar electrodomésticos, organizar nevera",
      },
      // Monday
      { title: "Orden Matutino", description: "Hacer camas, recogida rápida" },
      {
        title: "Limpieza Cocina",
        description: "Platos, limpiar encimeras, barrer",
      },
      { title: "Sacar Basura", description: "Todas las habitaciones" },
      // Tuesday
      { title: "Orden Matutino", description: "Hacer camas, recogida rápida" },
      { title: "Limpieza Baño", description: "Fregar inodoro, lavabo, espejo" },
      { title: "Aspirar Sala", description: "Suelos y alfombras" },
      // Wednesday
      { title: "Orden Matutino", description: "Hacer camas, recogida rápida" },
      { title: "Limpieza Cocina", description: "Platos, limpiar encimeras" },
      { title: "Limpiar Polvo", description: "Sala y dormitorios" },
      // Thursday
      { title: "Orden Matutino", description: "Hacer camas, recogida rápida" },
      { title: "Fregar Suelos", description: "Cocina y baño" },
      { title: "Limpiar Electrodomésticos", description: "Microondas, estufa" },
      // Friday
      { title: "Orden Matutino", description: "Hacer camas, recogida rápida" },
      { title: "Repaso Baño", description: "Lavabo y espejo" },
      { title: "Aspirar Dormitorios", description: "Suelos de dormitorios" },
      { title: "Sacar Basura", description: "Preparar para recolección" },
      // Saturday
      {
        title: "Tarea Limpieza Profunda",
        description: "Rotar: ventanas, rodapiés, etc.",
      },
      {
        title: "Organizar y Despejar",
        description: "Enfoque en una habitación",
      },
      {
        title: "Compras y Reposición",
        description: "Revisar suministros de limpieza",
      },
    ],
  },
};

/**
 * Get translated template data for a specific locale
 * @param slug - Template slug
 * @param locale - Language code (e.g., 'es')
 * @returns TemplateTranslation or undefined if not available
 */
export function getTemplateTranslation(
  slug: string,
  locale: string,
): TemplateTranslation | undefined {
  if (locale === "es") {
    return TEMPLATE_TRANSLATIONS_ES[slug];
  }
  if (locale === "ar") {
    return TEMPLATE_TRANSLATIONS_AR[slug];
  }
  return undefined;
}
