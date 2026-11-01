# STRATA 0.3.0 — Sabah bildirimi demosu

Tarih: 28 Ekim 2026
Ana kaynak: /Users/caner/Desktop/STRATA

## Eklenenler
- Profil içinde ücretsiz Sabah önerisi kartı; açık/kapalı, saat, haftanın günleri ve kaydedilecek içerik önizlemesi.
- iOS/Android yerel haftalık tekrar adaptörü ve 5 saniyelik tek seferlik test.
- Yalnızca Kaydet/Test eyleminde bildirim izni isteme; reddedilirse cihaz Ayarları bağlantısı.
- Plan doğrulama, başarıdan sonra aktif kayıt, hatada kısmi planı geri alma ve yalnızca bu özelliğe ait bildirimleri iptal etme.
- Depolama yazılamasa da kapatma sırasında cihaz planını iptal etme.
- Dil/gardırop/örnek hava değişince bildirim metnini yeniden kaydetme uyarısı.
- Türkçe ve İngilizce mesajlar, özel parça adlarını koruma, Today sayfasına güvenli yönlendirme.
- Bildirim ayarları gardıroptan ayrı saklanır. Web sadece önizlemedir; gerçek bildirim planlandı iddiası yoktur.

## Demo sınırları
Kaydetme anındaki örnek öneri haftalık tekrar eder. Uygulama kapalıyken yeni hava verisi veya gardırop hesabı yapılmaz. Gerçek hava/push backend ve widget yoktur. Saat yerel cihaz saatidir; Odak/izin/pil politikaları teslimi etkileyebilir.

## Doğrulama
- Tür denetimi ve lint: geçti.
- Testler: 30/30 geçti; 13 yeni bildirim alan testi.
- Web export ve iOS JavaScript/Hermes export: geçti. İmzalı native build yapılmadı.
- Ayrı salt-okunur kod incelemesi: engelleyici bulgu yok. Hata sonrası kullanıcı taslağını koruma davranışı README'de açıklandı.
- Yerel /profile endpoint: HTTP 200 yanıtı doğrulandı.
- Fiziksel iPhone/Android bildiriminin teslimi, izin penceresi ve bildirime dokunma akışı cihazda henüz doğrulanmadı. Tarayıcıda otomatik etkileşimli UI testi yapılmadı.

## Telefon testi için
Native modülü içeren yeni bir geliştirme derlemesi kullanın. Profil → Sabah önerisi kartında gardıroba göre örnek mesajı inceleyin, izin vererek 5 saniyelik testi deneyin. Ardından gün/saat seçimini kaydedin ve kapatma davranışını doğrulayın. Web'de gerçek zamanlama düğmeleri bilerek devre dışıdır.

README ve docs/sabah-bildirimi-plani.md geliştirici devri için güncellendi.
