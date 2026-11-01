# STRATA — İlk çalışan sürüm

## Amaç
Kullanıcının gardırobundaki temel parçalardan, gidiş ve dönüş saatlerindeki hava koşullarına uygun günlük katman planı üretmek. Mockuptaki açık zemin, orman yeşili, büyük kıyafet görselleri ve sade Türkçe arayüz referans alınır.

## Platform
İlk plandaki tercihi koruyarak React Native, Expo ve TypeScript ile iOS odaklı uygulama. Bu seçim geliştirici önerisidir; tarayıcı önizlemesi mümkün olduğu ölçüde desteklenir. Netlify yerel iOS uygulamasını dağıtmak için zorunlu değildir. iOS derlemesi ve mağaza yayını bu aşamaya dahil değildir.

## Kullanıcı akışı
1. İlk açılışta şehir, kolay üşüme/normal/kolay terleme tercihi, gidiş-dönüş saatleri ve dışarıda kalma süresi seçilir.
2. Kullanıcı fotoğraf yüklemeden tişört, uzun kollu üst, ince kazak, kalın kazak, sweatshirt, hafif mont, yağmurluk ve kalın mont kategorilerinden sahip olduklarını seçer. İsteğe bağlı ad ve renk ekleyebilir; fotoğraf ve görüntü tanıma sonraya bırakılır.
3. Bugün ekranı örnek hava verisinden sahip olunan parçalarla öneri üretir. Giyilecekler ve taşınacaklar ayrı görünür. Sahip olunmayan parça varmış gibi önerilmez; yetersiz gardırop için açık mesaj verilir.
4. Günün planı ekranında sabah ve dönüş önerisi, gerekçe ve beklenen hava gösterilir. Üç katman zorunlu değildir.
5. Kullanıcı akşam üşüdüm/rahattım/terledim geri bildirimi verir. Basit, sınırlandırılmış tercih ayarı sonraki öneriyi etkiler; bilimsel doğruluk veya makine öğrenmesi iddiası yapılmaz.
6. Parçalarım ekranında kayıtlar düzenlenir; profil ekranında tercih ve saatler değiştirilir.

## Veri ve bağlantılar
Gardırop, tercihler ve geri bildirimler cihazda saklanır. Kayıt/giriş, Supabase, Netlify, gerçek hava API'si, ödeme, bildirim gönderimi ve affiliate bağlantıları bu sürümde kurulmaz. Hava verisi açıkça “Demo hava verisi” diye işaretlenir. Farklı sıcaklık/rüzgâr/yağış senaryoları denenebilir. Veri erişimi ileride gerçek servislerle değiştirilebilen ayrı bir katmanda tutulur; hiçbir ekran servis anahtarı gerektirmez.

## Öneri mantığı ve sınırlar
Sıcaklık, sağlanan hissedilen sıcaklık, yağış, yolculuk saati, süre ve kullanıcı tercihi değerlendirilir. Hissedilen sıcaklık varsa rüzgâr soğuğu yeniden eklenmez. Ortamın iç sıcaklığı ölçülmüş gibi davranılmaz. Öneriler gündelik konfor içindir; aşırı hava koşullarında güvenlik garantisi verilmez. Gardırop renkleri gösterilir ama stil uyumu hesaplandığı iddia edilmez.

## Tamamlanma ölçütleri
- Temel ekranlar arasında çalışır gezinme.
- Gardırop ve tercihler yeniden açılışta korunur.
- Gardırop düzenleme ve senaryo değişikliği öneriyi günceller.
- Boş gardırop ve eksik dış katman durumları açıkça yönetilir.
- Geri bildirim kaydedilir ve sınırlandırılmış kişisel ayar uygulanır.
- Motor için sahip olunmayan parçayı önermeme, sıcak havada zorunlu üç katman üretmeme ve hissedilen sıcaklığı iki kez düzeltmeme kontrolleri.
- Tür denetimi ve ortamın izin verdiği önizleme doğrulaması; çalıştırılamayan cihaz kontrolleri ayrıca belirtilir.

## Sonraki aşama
Gerçek kullanıcı denemesinden sonra hava API'si, Supabase senkronizasyonu ve abonelik ayrı kararlarla eklenir. İlk sürümün amacı günlük karar akışını ve gardırop uyumunu değerlendirmektir.
