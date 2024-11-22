export default defineI18nConfig(() => ({
  legacy: false,
  locale: "en",
  messages: {
    en: {
      navigation: {
        home: "หน้าหลัก",
        newshouse: "หอประกายข่าว",
        media: {
          title: "สื่อสนุก",
          songs: "เพลง",
          animations: "อนิเมชั่น",
          gallery: "ห้องชมภาพ",
          ebooks: "หนังสืออิเล็กทรอนิกส์ (E-Books)",
        },
        "glittering-yard": "ลานเรืองแสง",
        club: "คลับหิ่งห้อยน้อย",
        support: "สนับสนุนเรา",
        "user-manual": "วิธีใช้งาน",
      }
    }
  }
}));