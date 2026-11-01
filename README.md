# WearWeather · Yerel prototip 0.3.0

Gardıroptaki temel parçalarla günlük katman önerisi. Expo / React Native / TypeScript; iOS odaklı, web önizlemeli.

## Masaüstündeki çalışma klasörü

Eski çalışma adı: STRATA. Geçmiş durum belgeleri (`docs/`) o dönemin adını korur.

`WearWeather-Baslat.command` dosyasına çift tıklamak yerel önizlemeyi açar. Terminal penceresi açık kalmalıdır. İşletim sistemi izin uyarısı gösterirse izinleri atlatmak yerine klasörde `npm run preview` kullanın.

## Çalıştırma

Node.js 22.13+ ve npm gerekir.

```sh
npm ci
npm run web
```

Yerel üretim önizlemesi:

```sh
npm run build:web
npm run preview
```

Önizleme: http://localhost:8081. Sunucu yalnızca bu bilgisayara açıktır. Durdurup yeniden başlatınca aynı adresi kullanmak, tarayıcı kayıtlarını korur.

Mobil geliştirme: `npm start`; uyumlu Expo Go veya geliştirme derlemesi ile aç. iOS cihazı ve mağaza dağıtımı ayrıca doğrulanmalıdır. Native derleme, sertifika veya EAS hesabı oluşturulmadı.

## İlk deneme

1. Şehir seç; sahip olduğun kıyafet kategorilerini işaretle.
2. Sıcaklık tercihini ve yolculuk saatlerini ayarla.
3. Bugün ekranında örnek hava senaryolarını değiştir.
4. Parçalarım'da ad ve renk düzenle; kıyafet ekle/çıkar.
5. Premium ekranında aylık/yıllık seçimi ve ücretsiz demo etkinleştirmeyi dene.
6. Nasıl geçti? ekranında konfor kaydı bırak; yeniden açarak kaydı kontrol et.

## Kapsam ve sınırlar

- Tüm hava koşulları demo; şehir veya saat seçimi canlı hava getirmez. Saatler örnek gidiş ve dönüş koşullarını etiketler.
- Gardırop kategori başına bir parça tutar. Görseller uygulama içinde çizilen temsili SVG'lerdir.
- Ücretsiz: gardırop, temel günlük öneri, geri bildirim kaydı.
- Premium demo: kişisel hassasiyet/süre/geri bildirim ayarı ve gidiş-dönüş planı. Gerçek ödeme, otomatik yenileme ve deneme aboneliği yok.
- Haftalık plan, sunucudan gelen güncel hava bildirimi, ana ekran widget'ı, fotoğraf tanıma, affiliate ve çoklu şehir seyahat planı bu ilk sürümde yok.
- Öneri motoru basit kurallara dayanır; bilimsel termal model veya sağlık/güvenlik hizmeti değildir. Alt giyim ve aksesuarların tam envanteri modellenmez.
- Cihazlar arası senkronizasyon yok. Tarayıcı/uygulama verisi temizlenirse kayıtlar kaybolur.
- Geçersiz veya daha yeni sürüme ait yerel kayıt okunursa önceki veriyi ezmeden geçici oturum açılır ve uyarı gösterilir.

## Türkçe / English ve sonraki diller

- İlk yayındaki diller Türkçe ve İngilizce. İlk açılışta cihazın desteklenen dil tercihleri sırasıyla değerlendirilir; hiçbiri desteklenmiyorsa İngilizce kullanılır.
- İlk kurulum ve Profil ekranlarında cihaz dili / Türkçe / English seçimi vardır. Seçim `wearweather.language.v1` anahtarıyla gardıroptan ayrı saklanır.
- `src/i18n/en.json` ve `tr.json` aynı anahtarları taşır; tür denetimi ve testler eksik anahtarları yakalar. Tarihler ve fiyatlar `Intl` ile biçimlenir. Para birimi demoda USD olarak kalır; dil değiştirmek kuru veya fiyatı değiştirmez. Saatler 24 saat, hava birimleri metrik kalır.
- Varsayılan kıyafet kategorileri çevrilir; kullanıcı tarafından verilen özel parça adları korunur. Önceki sürüm kayıtları silinmez, aynı gardırop depolama anahtarı kullanılır.
- `sourceKeys.json` eski katalog, motor ve kayıt uyarılarının çeviri anahtarlarına uyumluluk eşlemesidir. Yeni ekran metinleri doğrudan anlamlı sözlük anahtarları kullanmalıdır.
- Yeni dil eklemek için sözlük, `Locale` tipi/mesaj kaydı, dil seçici, sistem locale listesi ve Expo `supportedLocales` listesi güncellenir. Tamamlanmamış dil yayına açılmaz. RTL diller için düzen ve yön desteği ayrıca doğrulanmalıdır.
- Çeviri API’si, Supabase veya başka dış servis gerekmez.

## Servis bağlantı noktaları

- `src/services/weather.ts`: `WeatherProvider` ve yerel `demoWeather`. Gerçek saatlik tahmin ve hata/yedekleme burada uygulanmalı.
- `src/services/billing.ts`: `BillingProvider` ve ödeme almayan `demoBilling`. Gerçek entitlement sunucu/RevenueCat doğrulamasına bağlanmalı; demo bayrağı gerçek satın alma kanıtı değildir.
- `src/services/storage.ts`: şema doğrulama ve yerel veri modeli.
- `src/store/useStore.ts`: AsyncStorage tabanlı sıralı kayıt. Supabase senkronizasyonu eklenirken kullanıcı/çatışma/offline politikası ayrıca tasarlanmalı.
- `src/domain/engine.ts`: saf katman seçimi; sağlanan hissedilen sıcaklığa ikinci rüzgâr düzeltmesi uygulanmaz.

Supabase, Netlify, hava API'si veya ödeme hesabı/anahtarı gerekmez. Netlify web çıktısı için seçenek olabilir; native iOS dağıtımı için zorunlu değildir.

## Kontroller

```sh
npm run typecheck
npm run lint
npm test
npm run build:web
```

Testler: boş gardırop, sahip olunmayan parçalar, sıcak/yağmurlu koşullar, hissedilen sıcaklık, kişisel hassasiyet, kayıt doğrulama, boş gardırobun korunması ve günlük geri bildirimin değiştirilmesi.

## Bağımlılık notu

28 Ekim 2026 npm denetiminde Expo araç zincirinin geçişli `zod@3.25.76` ve `deepmerge@4.3.1` bağımlılıkları için toplam 8 uyarı raporlandı (3 high, 5 low; Expo üst paketlerine yayılan sayım). Otomatik öneri Expo 51'e kırıcı geri dönüş olduğundan uygulanmadı. Uygulama kendi verisini bu paketlerle doğrulamıyor; açıkların etkilenebilirliği bağımsız olarak kanıtlanmış değildir. Üretim dağıtımından önce uyumlu üst paket düzeltmeleri incelenmeli. `npm audit fix --force` çalıştırmayın.

## Sabah bildirimi demosu (0.3.0)

Profil ekranında ücretsiz Sabah önerisi kartı bulunur. Günleri ve yerel saati seçip kaydedebilirsiniz. Bildirim izni yalnızca Kaydet veya Test düğmesine basınca istenir. Reddetmek uygulamanın diğer özelliklerini engellemez.

- iOS/Android: seçilen her gün için haftalık tekrarlayan yerel bildirim. Ses/badge kullanılmaz. Tam teslim zamanı Odak, pil ve işletim sistemi koşullarına bağlıdır; exact alarm izni istenmez.
- Web: sadece içerik ve ayar önizlemesi. Gerçek cihaz zamanlaması ve test düğmeleri devre dışıdır; tarayıcı bildirim izni istenmez.
- Test: mevcut örnek mesajı 5 saniye sonrasına bir kez zamanlar. Fiziksel cihazdaki teslim henüz doğrulanmadı.
- İçerik **kaydetme anındaki demo hava/gardırop/dil görüntüsüdür**. Uygulama kapalıyken yeni hava sorgusu veya öneri hesabı yapılmaz; aynı mesaj haftalık tekrar eder. Değişikliklerden sonra yeniden kaydetme uyarısı vardır.
- Bildirime dokunmak Today ekranını açar. Dış URL ve bilinmeyen bildirim etiketleri kabul edilmez.
- Kapat: yalnızca `wearweather.morning.` önekli bu özelliğin plan/test bildirimlerini iptal eder. Başka özelliklerin bildirimlerine dokunmaz.
- Yerel tercihler `wearweather.reminders.v1` altında, gardırop ve dil kayıtlarından ayrı saklanır. Kayıt hatasında yeni plan aktif kabul edilmez; izin reddi ve iptal hataları açıkça gösterilir.
- Geçici hatadan sonra düzenleme taslağı tekrar denemek için ekranda tutulabilir. Gerçek kayıt durumu karttaki “Kayıtlı plan” satırıdır; değişiklikler Kaydet ile uygulanır.

Native test için yeni Expo modülünü içeren bir geliştirme derlemesi gerekir. Bu oturumda Xcode/EAS hesabı, APNs/FCM veya push token kurulmadı. Plugin `enableRemoteNotifications: false` kullanır. Gerçek günlük tahmin için ileride sunucu zamanlayıcısı, güncel hava, cihaz saat dilimi, push token ve onay yönetimi ayrıca eklenmelidir.

Bildirim kaynakları `src/reminders/` altında: saf içerik ve koordinatör `core.ts`, platform adaptörü `adapter.native.ts`, web desteği olmayan güvenli adaptör `adapter.ts`, durum `useReminders.ts`, Profil kartı `MorningReminderCard.tsx`.
