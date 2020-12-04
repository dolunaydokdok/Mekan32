



 const anaSayfa=function(req, res, next) {
  res.render('mekanlar-liste',
   {
   	'baslik': 'Anasayfa',
   	'sayfaBaslik':{
   		
   		'siteAd':'Mekan32',
   		'aciklama':'Isparta civarındaki mekanları keşfedin!'
   	},
   	'mekanlar':[
   	{
   		'ad':'Starbucks',
   		'adres':'Centrum Garden AVM',
   		'puan':3,
   		'imkanlar':['Dünya Kahveleri','Kekler','Pastalar'],
   		'mesafe':'10km'

   	},
   	{
   		'ad':'Mado',
   		'adres':'Iyaş AVM',
   		'puan':4,
   		'imkanlar':['Kahveler','Dondurmalar','Pastalar'],
   		'mesafe':'5 km'

   	},
   	{
   		'ad':'Gönül Kahvesi',
   		'adres':'Süleyman Demirel Caddesi',
   		'puan':2,
   		'imkanlar':['Kahveler','Çay','Pastalar'],
   		'mesafe':'6km'

   	},
   	{
   		'ad':'Burç Fırın',
   		'adres':'Modernevler Mah.',
   		'puan':4,
   		'imkanlar':['Çay','Kekler','Pastalar'],
   		'mesafe':'8km'

   	},
   	{
   		'ad':'Mecnun Cafe Bistro',
   		'adres':'Süleyman Demirel Caddesi',
   		'puan':2,
   		'imkanlar':['Dünya Kahveleri','Kekler','Pastalar'],
   		'mesafe':'7km'

   	},


   	]
   }
   );
}
const mekanBilgisi=function(req, res, next) {
  res.render('mekan-detay',{

  	'baslik':'Mekan Bigisi',
  	'sayfaBaslik':'Starbucks',
  	'mekanBilgisi':{
  		'ad':'Starbucks',
  		'adres':'Centrum Garden AVM',
  		'puan':3,
  		'imkanlar':['Kahve','Pasta','Kek'],
  		'koordinatlar':{
  			'enlem':37.781885,
  			'boylam':30.566034
  		},
  		'saatler':[
  		 {
  			'gunler':'Pazartesi-Cuma',
  			'acilis':'07:00',
  			'kapanis':'23:00',
  			'kapali':false
  		 },
  		 {
  			'gunler':'Cumartesi',
  			'acilis':'09:00',
  			'kapanis':'22:30',
  			'kapali':false
  		 },
  		 {
  			'gunler':'Pazar',
  			
  			'kapali':true
  		 }
  		],
  		'yorumlar':[
  		 {
  			'yorumYapan':'Dolunay Dökdök',
  			'puan':4,
  			'tarih':'1 Aralık 2020',
  			'yorumMetni':'Kahvesini beğendim ama pasta hoşuma gitmedi.'
  		 }

  		]
  	}
  });
}
 
const yorumEkle=function(req, res, next) {
  res.render('yorum-ekle', { title: 'Yorum Ekle','footer':'Dolunay Dökdök 2020' });
}






module.exports={
anaSayfa,
mekanBilgisi,
yorumEkle


}