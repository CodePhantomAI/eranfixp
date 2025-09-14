import React from 'react'
import { ChevronDown, ChevronUp, Phone, Mail, MessageCircle } from 'lucide-react'
import { useState } from 'react'

const faqData = [
  {
    question: "איזה שירותים מציעה חברת EranFixer?",
    answer: "EranFixer מציעה מגוון רחב של שירותים דיגיטליים מתקדמים: פיתוח אתרים עם טכנולוגיות חדישות (React, TypeScript, Supabase), קידום אתרים אורגני מקצועי, מערכות CRM מותאמות אישית, בוטים חכמים ואוטומציה עסקית, ניהול מוניטין דיגיטלי (ORM), יחסי ציבור דיגיטליים, כתיבה שיווקית מקצועית, ואינטגרציות מערכות מתקדמות. כל שירות מותאם אישית לצרכים הספציפיים של הלקוח."
  },
  {
    question: "מה היתרון בקידום אתרים עם EranFixer?",
    answer: "השיטה שלנו מבוססת על 7+ שנות ניסיון מוכח, מחקר מעמיק של מילות מפתח עם כלים מתקדמים, ניתוח תחרות מקצועי, בניית תוכן איכותי וממוקד, ואופטימיזציה טכנית מתקדמת. אנחנו משתמשים בגישה מדעית מבוססת נתונים ולא בטריקים. היתרון הוא תוצאות אורגניות יציבות לטווח ארוך, עלייה משמעותית בתנועה איכותית, שיפור בהמרות, וחיסכון משמעותי בעלויות פרסום ממומן."
  },
  {
    question: "האם החברה מספקת פתרונות מותאמים לעסקים קטנים ובינוניים?",
    answer: "בהחלט! אנחנו מתמחים בעבודה עם עסקים מכל הגדלים - מעסקים קטנים ועד חברות גדולות. המיקוד שלנו הוא במתן פתרונות מותאמים אישית שמתאימים לתקציב ולצרכים של כל עסק. אנחנו מציעים חבילות גמישות החל מ-29.90₪ לחודש לאתר בסיסי ועד פתרונות מתקדמים למערכות עסקיות מורכבות. כל פתרון כולל ליווי אישי, הדרכה מקצועית ותמיכה מתמשכת."
  },
  {
    question: "מה כולל שירות ניהול מוניטין דיגיטלי (ORM)?",
    answer: "שירות ניהול המוניטין הדיגיטלי שלנו כולל: ניטור מוניטין 24/7 עם התראות בזמן אמת, דחיקת תוצאות שליליות במנועי חיפוש באמצעות טכניקות SEO מתקדמות, יצירת תוכן חיובי ואותנטי, ניהול ביקורות מקצועי בגוגל ובפלטפורמות אחרות, בניית נוכחות חיובית ברשתות חברתיות, ואסטרטגיה מתמשכת לחיזוק התדמית העסקית והאישית באינטרנט. אנחנו גם מספקים דוחות מפורטים ומעקב אחר שיפור המוניטין לאורך זמן."
  },
  {
    question: "האם EranFixer מספקת פתרונות בינלאומיים?",
    answer: "כן, אנחנו פועלים בקנה מידה בינלאומי ועובדים עם לקוחות מארצות הברית, אירופה, אוסטרליה וקנדה. אנחנו מציעים שירותי SEO בינלאומיים, בניית אתרים רב-לשוניים, ואסטרטגיה שיווקית מותאמת לשווקים שונים בחו\"ל. הצוות שלנו מנוסה בעבודה עם תרבויות שונות ומבין את הדקויות של קידום בשווקים בינלאומיים. אנחנו מספקים שירותים באנגלית, עברית וספרדית."
  },
  {
    question: "איך ניתן ליצור קשר עם EranFixer?",
    answer: "יש מספר דרכים ליצור קשר: וואטסאפ 052-212-6366 (המהיר ביותר), מייל eranfixer@gmail.com, טופס יצירת קשר באתר, או שיחת טלפון ישירה. אנחנו מעניקים ייעוץ ראשוני חינם לכל פנייה, כולל ניתוח מצב קיים והמלצות ראשוניות. זמן המענה הממוצע הוא פחות מ-2 שעות בימי עבודה ו-24 שעות בסופי שבוע."
  },
  {
    question: "כמה זמן לוקח לראות תוצאות בקידום SEO?",
    answer: "תוצאות ראשוניות נראות בדרך כלל תוך 6-12 שבועות (שיפור בדירוג למילות מפתח ארוכות), אבל תוצאות משמעותיות ויציבות מגיעות תוך 4-8 חודשים. זה תלוי במספר גורמים: רמת התחרות בתחום, המצב הטכני הנוכחי של האתר, איכות התוכן הקיים, היסטוריית הדומיין, והיקף העבודה שמתבצעת. אנחנו מספקים דיווחים חודשיים מפורטים שמראים את ההתקדמות בכל שלב."
  },
  {
    question: "האם אתם מציעים תחזוקה שוטפת לאתרים?",
    answer: "כן, אנחנו מציעים חבילות תחזוקה מקיפות ומקצועיות הכוללות: עדכוני אבטחה שוטפים, גיבויים אוטומטיים יומיים, מעקב ביצועים מתמשך, עדכוני תוכן לפי בקשה, תמיכה טכנית מהירה, ניטור זמינות 24/7, אופטימיזציה מתמשכת למהירות, ועדכוני SEO שוטפים. החבילות מתחילות מ-99₪ לחודש ומותאמות לגודל ומורכבות האתר."
  },
  {
    question: "מה ההבדל בין פרסום ממומן לקידום אורגני?",
    answer: "פרסום ממומן (Google Ads, Facebook Ads) מביא תוצאות מיידיות אבל דורש השקעה כספית מתמשכת - ברגע שמפסיקים לשלם, התנועה נעצרת. קידום אורגני לוקח יותר זמן (4-8 חודשים) אבל מביא תנועה איכותית 'חינמית' לטווח ארוך, בונה אמינות גבוהה יותר אצל הלקוחות, ומספק ROI טוב יותר לטווח ארוך. הגישה הטובה ביותר היא שילוב חכם של השניים - פרסום ממומן לתוצאות מיידיות וקידום אורגני לבניית בסיס יציב."
  },
  {
    question: "האם אתם עובדים עם עסקים מכל הגדלים?",
    answer: "בהחלט! אנחנו עובדים עם עסקים מכל הגדלים - מפרילנסרים ועסקים קטנים עד חברות גדולות וארגונים בינלאומיים. יש לנו ניסיון עם סטארטאפים, עסקים משפחתיים, חברות ציבוריות, ארגונים ללא כוונת רבח ומותגים בינלאומיים. כל פתרון מותאם אישית לצרכים הספציפיים, לתקציב ולמטרות העסקיות של הלקוח. אנחנו מאמינים שלכל עסק מגיע פתרון דיגיטלי איכותי."
  },
  {
    question: "איך אתם מודדים הצלחה ותוצאות?",
    answer: "אנחנו מודדים הצלחה לפי מדדים עסקיים ברורים: עלייה בתנועה אורגנית, שיפור בדירוג למילות מפתח יעד, גידול במספר הלידים והפניות, שיפור בשיעור ההמרות, עלייה בהכנסות, וחיסכון בעלויות שיווק. אנחנו מספקים דוחות מפורטים וחודשיים עם נתונים מדויקים מ-Google Analytics, Search Console ומערכות מעקב מתקדמות. השקיפות והמדידה הם חלק בלתי נפרד מהשירות שלנו."
  },
  {
    question: "מה כולל הייעוץ הראשוני החינם?",
    answer: "הייעוץ הראשוני כולל: ניתוח מקצועי של האתר הקיים (אם יש), בדיקת מיצוב נוכחי במנועי חיפוש, זיהוי הזדמנויות לשיפור, המלצות ראשוניות לאסטרטגיה דיגיטלית, הערכת תקציב מותאמת, ותוכנית עבודה ראשונית. הייעוץ נמשך 30-45 דקות ומתבצע בוידאו קול או פגישה פרונטלית. אין שום התחייבות והייעוץ באמת חינם לחלוטין."
  },
  {
    question: "איך אתם שומרים על איכות השירות?",
    answer: "איכות השירות היא בראש סדר העדיפויות שלנו. אנחנו עובדים עם מתודולוגיות מוכחות, כלים מתקדמים, ומערכות בקרת איכות קפדניות. כל פרויקט עובר בדיקות איכות מרובות, אנחנו מספקים ליווי אישי לכל לקוח, ומקיימים פגישות סטטוס קבועות. בנוסף, אנחנו מציעים אחריות מלאה על העבודה ומחויבים לתוצאות. שביעות הרצון של הלקוחות שלנו עומדת על 98%."
  }
]

export const FAQPage: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div>
      {/* FAQ Schema */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqData.map(item => ({
              "@type": "Question",
              "name": item.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
              }
            }))
          })
        }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              שאלות נפוצות
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              תשובות לשאלות הנפוצות ביותר על השירותים שלנו
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqData.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-6 text-right flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 flex-1">
                    {item.question}
                  </h3>
                  {openItems.includes(index) ? (
                    <ChevronUp className="w-5 h-5 text-blue-600 mr-4" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 mr-4" />
                  )}
                </button>
                
                {openItems.includes(index) && (
                  <div className="px-6 pb-6">
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-gray-600 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            לא מצאתם את התשובה שחיפשתם?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            צרו קשר ונשמח לענות על כל שאלה נוספת
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/972522126366?text=היי, יש לי שאלה על השירותים שלכם"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-700 transition-colors inline-flex items-center"
            >
              <MessageCircle className="w-5 h-5 ml-2" />
              שאלה בווטסאפ
            </a>
            
            <a
              href="tel:052-212-6366"
              className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <Phone className="w-5 h-5 ml-2" />
              התקשרו עכשיו
            </a>
            
            <a
              href="mailto:eranfixer@gmail.com"
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-colors inline-flex items-center"
            >
              <Mail className="w-5 h-5 ml-2" />
              שלחו מייל
            </a>
          </div>
          
          {/* Additional Resources */}
          <div className="mt-12 pt-8 border-t border-blue-500">
            <h3 className="text-xl font-bold text-white mb-4">משאבים נוספים</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="https://seo.eranfixer.co.il" target="_blank" rel="noopener noreferrer" className="text-blue-100 hover:text-white transition-colors text-sm">
                מחקרי SEO
              </a>
              <a href="https://ai.eranfixer.co.il" target="_blank" rel="noopener noreferrer" className="text-blue-100 hover:text-white transition-colors text-sm">
                פתרונות AI
              </a>
              <a href="https://seop.eranfixer.co.il" target="_blank" rel="noopener noreferrer" className="text-blue-100 hover:text-white transition-colors text-sm">
                קוד פתוח
              </a>
              <a href="https://codephantomai.com" target="_blank" rel="noopener noreferrer" className="text-blue-100 hover:text-white transition-colors text-sm">
                שיתופי פעולה
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}