# STRATA 0.2.0 — 28 Ekim 2026

Ana çalışma klasörü: /Users/caner/Desktop/STRATA
Marka adı geçici olarak STRATA. İsim değişikliği yapılmadı.

## Eklenenler
- Çoklu dil sözlük yapısı; ilk yayında Türkçe ve İngilizce.
- Profil ve ilk kurulumda cihaz dili / Türkçe / English seçimi.
- Cihaz dili algılama, İngilizce yedek dil ve ayrı kalıcı dil tercihi.
- Ekran metinleri, öneri gerekçeleri, uyarılar, katalog ve erişilebilirlik etiketleri için çeviri.
- Tarih/fiyat gösterimi ve sayıya göre parça/gün metinleri.
- Özel kıyafet adlarının ve önceki gardırop kayıtlarının korunması.
- Küçük ekranlarda kıyafet çizimlerinin genişliğe uyarlanması.
- Terminal penceresi açık tutulduğunda yerel önizlemeyi başlatan STRATA-Baslat.command.

## Geçen kontroller
- Tür denetimi ve lint: geçti, hata/uyarı yok.
- Testler: 17/17 geçti.
- Web export: geçti.
- iOS JavaScript/Hermes export: geçti; imzalı native uygulama derlemesi değildir.
- Başlatma dosyası shell sözdizimi ve önizleme sunucusu JavaScript sözdizimi: geçti.
- Bağımsız kod incelemesi: engelleyici bulgu yok.

## Henüz doğrulanmayanlar
- Bu turda tarayıcı üzerinden etkileşimli dil değiştirme ve yenileme testi yapılmadı; önceki tarayıcı erişim kısıtı nedeniyle otomatik UI doğrulaması kullanılmadı.
- Fiziksel iPhone, ana ekran widget'ı ve mağaza dağıtımı test edilmedi.
- Gerçek hava, ödeme ve Supabase bağlantıları hâlâ yok.
- Sağdan sola dil düzeni desteklenmiyor; yeni RTL dil eklenirse ayrıca uygulanmalı.

Önizleme: http://localhost:8081/profile — sayfayı yenileyip Dil / Language bölümünü kullanın.
