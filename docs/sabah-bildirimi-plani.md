# Sabah bildirimi demosu — uygulama planı

Onay: Kullanıcı gün/saat seçimi, izin ve iPhone yerel bildirim demosuna devam edilmesini istedi.

## Kapsam
- Ücretsiz Profil kartı: açık/kapalı, saat, haftanın günleri, örnek içerik, kaydet, 5 saniyelik cihaz testi, kapat.
- iOS/Android yerel bildirim adaptörü. Web'de içerik ve ayarlar önizlenebilir; gerçek bildirim planlanmış gibi gösterilmez.
- Yalnızca kullanıcının tıklamasıyla izin istenir. İzin reddi ve cihaz Ayarları bağlantısı sunulur; uygulama kullanılmaya devam eder.
- Kayıtta hazırlanan demo önerisi seçili günlerde tekrar eder. Uygulama kapalıyken hava veya gardırop yeniden hesaplanmaz; bu sınır görünür metinle belirtilir.
- Dil ve gardırop değişirse bildirim metni için yeniden kaydetme uyarısı. Mevcut gardırop şeması ve kayıt anahtarı korunur.
- Kapatırken uygulamanın kendi hatırlatıcıları/testleri iptal edilir; diğer bildirimlere dokunulmaz.
- Bildirime dokunulduğunda Today açılır; dışarıdan verilen rastgele URL'lere yönlendirme yok.

## Görevler
1. Saf ayar doğrulama, mesaj oluşturma, adaptör arayüzü ve planlama koordinatörü. Testler: boş gardırop, gün/saat doğrulama, tr/en ve özel adlar, izin reddi, geri alma, iptal kapsamı, web desteklenmiyor.
2. Platform adaptörleri, ayrı AsyncStorage kaydı ve durum yönetimi; kayıt başarıyla tamamlanmadan aktif gösterme.
3. Türkçe/İngilizce Profil kartı, izin ve demo açıklamaları; navigasyon dinleyicisi.
4. Tür denetimi, lint, testler, web/iOS paketleme, bağımsız kod incelemesi ve masaüstü/çıktı belgelerini güncelleme.

Native uygulama bu oturumda mevcut kullanıcı onayıyla yürütülür. Fiziksel cihaz teslimi test edilemezse açıkça raporlanır.
