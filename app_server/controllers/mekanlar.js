var request = require('postman-request');
var apiSecenekleri = {
	sunucu : "https://dolunaydokdok1811012017.herokuapp.com",
	//sunucu: "http://localhost:3000",
	apiYolu: "/api/mekanlar/"
};
var istekSecenekleri
var footer = "Dolunay Dökdök 2021"
var mesafeyiFormatla = function (mesafe) {
	var yeniMesafe, birim;
	if (mesafe > 1000) {
		yeniMesafe = parseFloat(mesafe / 1000).toFixed(2);
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
			title: 'Mekan32',
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
			title: mekanDetaylari.ad,
			footer: footer,
			sayfaBaslik: mekanDetaylari.ad,
			mekanBilgisi: mekanDetaylari
		});
}

var hataGoster = function (req, res, durum) {
	var title, icerik;
	if (durum == 404) {
		title = "404, Sayfa Bulunamadı!";
		icerik = "Kusura bakmayın sayfayı bulamadık!";
	}
	else {
		title = durum + ", Bir şeyler ters gitti!";
		icerik = "Ters giden bir şey var!";
	}
	res.status(durum);
	res.render('hata', {
		title: title,
		icerik: icerik,
		footer: footer
	});
};
var mekanBilgisiGetir = function (req, res, callback) {
	var istekSecenekleri;
	//istek seçeneklerini ayarla.
	istekSecenekleri = {
		//tam yol
		url: apiSecenekleri.sunucu + apiSecenekleri.apiYolu + req.params.mekanid,
		//veri çekeceğimiz için get metodu kullan
		method: "GET",
		//dönen veri json formatında olacak
		json: {}
	};//istekte bulun
	request(
		istekSecenekleri,
		//geri dönüş metodu
		function (hata, cevap, mekanDetaylari) {
			var gelenMekan = mekanDetaylari;
			if (!hata) {
				//enlem ve boylam bir dizi şeklinde bunu ayır
				//0'da enlem 1'de boylam var
				gelenMekan.koordinatlar = {
					enlem: mekanDetaylari.koordinatlar[0],
					boylam: mekanDetaylari.koordinatlar[1]
				};
				callback(req, res, gelenMekan);
			} else {
				hataGoster(req, res, cevap.statusCode);
			}
		}
	);
};

const mekanBilgisi = function (req, res, callback) {
	mekanBilgisiGetir(req, res, function (req, res, cevap) {
		detaySayfasiOlustur(req, res, cevap);
	});
}

var yorumSayfasiOlustur = function (req, res, mekanBilgisi) {
	res.render('yorum-ekle', {
		title: mekanBilgisi.ad + ' Mekanına Yorum Ekle',
		sayfaBaslik: mekanBilgisi.ad + ' Mekanına Yorum Ekle',
		hata: req.query.hata,
		footer: footer
	});
};

const yorumEkle = function (req, res) {
	mekanBilgisiGetir(req, res, function (req, res, cevap) {
		yorumSayfasiOlustur(req, res, cevap);
	});
}
const yorumumuEkle = function (req, res) {
	var istekSecenekleri ,gonderilenYorum, mekanid;
	mekanid = req.params.mekanid;
	gonderilenYorum = {
		yorumYapan: req.body.name,
		puan: parseInt(req.body.rating, 10),
		yorumMetni: req.body.review
	};
	istekSecenekleri = {
		url: apiSecenekleri.sunucu + apiSecenekleri.apiYolu + mekanid + '/yorumlar',
		method: "POST",
		json: gonderilenYorum
	};
	if (!gonderilenYorum.yorumYapan || !gonderilenYorum.puan || !gonderilenYorum.yorumMetni) {
		res.redirect('/mekan/' + mekanid + '/yorum/yeni?hata=evet');
	} else {
		request(
			istekSecenekleri,
			function (hata, cevap, body) {
				if (cevap.statusCode == 201) {
					res.redirect('/mekan/' + mekanid);
				}
				else if (cevap.statusCode == 400 && body.name && body.name == "ValidationError") {
					res.redirect('/mekan/' + mekanid + '/yorum/yeni?hata=evet');
				} else {
					hataGoster(req, res, cevap.statusCode);
				}
			}
		);
	}
};


module.exports = {
	anaSayfa,
	mekanBilgisi,
	yorumEkle,
	yorumumuEkle
}