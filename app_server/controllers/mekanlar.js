var request = require('postman-request');
var apiSecenekleri = {
	sunucu: "http://localhost:3000",
	apiYolu: "/api/mekanlar/"
};
var istekSecenekleri
var footer = "Dolunay Dökdök 2021"
var mesafeyiFormatla = function (mesafe) {
	var yeniMesafe, birim;
	if (mesafe > 1000) {
		yeniMesafe = parseFloat(mesafe / 100).toFixed(1);
		birim = ' km';
	} else {
		yeniMesafe = parseFloat(mesafe).toFixed(1);
		birim = ' m';
	}
	return yeniMesafe + birim;
}

var anaSayfaOlustur = function (req, res, cevap, mekanListesi) {
	var mesaj;
	//gelen mekanlistesi eğer dizi tipinde değilse hata ver.
	if (!(mekanListesi instanceof Array)) {
		mesaj = "API HATASI: Birşeyler ters gitti.";
		mekanListesi = []
	} else {//eğer berirlenen mesafe içinde mekan bulunmadıysa bilgilendir.
		if (!mekanListesi.length) {
			mesaj = "Civarda herhangi bir mekan bulunamadı!";
		}
	}
	res.render('mekanlar-liste',
		{
			baslik: 'Mekan32',
			sayfaBaslik: {
				siteAd: 'Mekan32',
				aciklama: 'Isparta Civarındaki Mekanları Keşfedin!'
			},
			footer: footer,
			mekanlar: mekanListesi,
			mesaj: mesaj,
			cevap: cevap
		});
}

const anaSayfa = function (req, res, next) {
	istekSecenekleri =
	{//tam yol
		url: apiSecenekleri.sunucu + apiSecenekleri.apiYolu,
		//veri çekeceğimiz için get metodu kullan
		method: "GET",
		//dönen veri json formatında olacak
		json: {},
		//sorgu parametreleri.URL'de yazılan enlem ve boyalamı al
		//localhost:3000/?enlem=37&boylam=30 gibi
		qs: {
			enlem: req.query.enlem,
			boylam: req.query.boylam
		}
	};//istekte bulun
	request(
		istekSecenekleri,
		function (hata, cevap, mekanlar) {
			var i, gelenMekanlar;
			gelenMekanlar = mekanlar;
			//sadece 200 durum kodunda ve mekanlar doluyken işlem yap.
			if (!hata && gelenMekanlar.length) {
				for (i = 0; i < gelenMekanlar.length; i++) {
					gelenMekanlar[i].mesafe =
						mesafeyiFormatla(gelenMekanlar[i].mesafe);
				}
			}
			anaSayfaOlustur(req, res, cevap, gelenMekanlar);
		}
	);
}
var detaySayfasiOlustur = function (req, res, mekanDetaylari) {
	res.render('mekan-detay',
		{
			baslik: mekanDetaylari.ad,
			footer:footer,
			sayfaBaslik: mekanDetaylari.ad,
			mekanBilgisi: mekanDetaylari
		});
}

var hataGoster = function (req, res, durum) {
	var baslik, icerik;
	if (durum == 404) {
		baslik = "404, Sayfa Bulunamadı!";
		icerik = "Kusura bakmayın sayfayı bulamadık!";
	}
	else {
		baslik = durum + ", Bir şeyler ters gitti!";
		icerik = "Ters giden bir şey var!";
	}
	res.status(durum);
	res.render('hata', {
		baslik: baslik,
		icerik: icerik
	});
};

var mekanBilgisi = function (req, res, callback) {
	istekSecenekleri = {
		url : apiSecenekleri.sunucu + apiSecenekleri.apiYolu + req.params.mekanid,
		method: "GET",
		json: {}
	};
	request(
		istekSecenekleri,
		function (hata, cevap, mekanDetaylari) {
			var gelenMekan = mekanDetaylari;
			if (cevap.statusCode == 200) {
				gelenMekan.koordinatlar = {
					enlem: mekanDetaylari.koordinatlar[0],
					boylam: mekanDetaylari.koordinatlar[1]
				};
				detaySayfasiOlustur(req, res, gelenMekan);
			} else {
				hataGoster(req, res, cevap.statusCode);
			}
		}
	);

}

const yorumEkle = function (req, res, next) {
	res.render('yorum-ekle', { title: 'Yorum Ekle', 'footer': 'Dolunay Dökdök 2020' });
}

module.exports = {
	anaSayfa,
	mekanBilgisi,
	yorumEkle


}