var POKERI = {
	arvom: ['', '', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J','Q', 'K', 'A'],
	maam: ['♡', '♢', '♣', '♠']
}

POKERI.Kortti = function (arvo, maa) {
	this._arvo = arvo;
	this._maa = maa;
}

POKERI.Kortti.prototype.arvo = function () {
	return this._arvo;
}

POKERI.Kortti.prototype.maa = function () {
	return this._maa;
}

POKERI.Kortti.prototype.mjono = function () {
	return POKERI.arvom[this._arvo] + '' + POKERI.maam[this._maa];
}

POKERI.Pakka = function () {
	var kortit = [];
	var jaetut = [];
	luoKortit();
	
	function luoKortit () {
		for (var maa = 0; maa < 4; maa++) {
			for (var arvo = 2; arvo < 15; arvo++) {
				kortit.push(new POKERI.Kortti(arvo, maa));
			}
		}
	}
	console.log(kortit.length + ' korttia pakassa');

	function sekoalgo (kortit) {
		var lkm = kortit.length;
		var temp;
		var i;
		while (lkm > 0) {
			i = Math.floor(Math.random() * lkm);
			lkm--;
			temp = kortit[lkm];
			kortit[lkm] = kortit[i];
			kortit[i] = temp;		
		}
		console.log('Pakka sekoitettu');
		//return kortit;
	}
	
	this.sekoita = function () {
		sekoalgo(kortit);
	}
		
	this.size = function () {
		return kortit.length;
	}

	this.jaa = function (korttia) {
		var kasi = [];
		for (var i = 0; i < korttia; i++) {
			kortti = kortit.pop();
			kasi.push(kortti);
			jaetut.push(kortti);
		}	
		console.log(kasi);
		return kasi;
	}
 }

POKERI.Kasi = function (kortit) {
	this.kortit = kortit;
}

POKERI.Kasi.prototype.samaMaa = function() {
    var laskurit = [0, 0, 0, 0];
    for (var i = 0; i < this.kortit.length; i++) {
        laskurit[this.kortit[i].maa()]++;
    }
    //console.log(Math.max.apply(null, laskurit) + ' sammaa maata');
    return Math.max.apply(null, laskurit);
}

POKERI.Kasi.prototype.jarjestaArvo = function (desc) {
	var arvot = [];
	for (var i = 0; i < this.kortit.length; i++) {
		//console.log(this.kortit[i].mjono());
		arvot.push(parseInt(this.kortit[i].arvo(), 10));
	}
	//console.log(arvot.sort(this.numerot) + ' arvot järjestyksessä');
	return arvot.sort(this.numeric);
}

POKERI.Kasi.prototype.arvoSuora = function () {
	var suora = this.jarjestaArvo(),
	run = max = 1,	tamaKortti, edellinenKortti;
	
	for (var i = 0; i < suora.length; i++) {
		tamaKortti = suora[i];
		edellinenKortti = suora[i-1];
		if (tamaKortti !== edellinenKortti +1) {
			run = 1;
		}
		else {
			run++;
			max = run > max ? run : max;		
		}
	}
	if (this.pieniSuora(suora)) {
		return 5;
	}
	//console.log(max + ' arvoa peräkkäin');
	return max;
}

POKERI.Kasi.prototype.pieniSuora = function (suora) {
	var alimmat = suora.slice(0, 4);
	if (this.lukuSuora(alimmat, [2, 3, 4, 5]) && suora.indexOf(14) > -1) {
		return true;
	}
	return false;
}

POKERI.Kasi.prototype.lukuSuora = function (a, b) {
	if (a.length !== b.length) {
		return false;
	}
	for (var i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) {
			return false;
		}
	}
	return true;
}

POKERI.Kasi.prototype.samaArvo = function () {
	var laskuri = this.arvoLaskuri(),
		arvot = this.objToArray(laskuri),
		samaa = arvot.sort(this.numerot).reverse();
	return samaa;
}

POKERI.Kasi.prototype.arvoLaskuri = function () {
	var arvot = this.jarjestaArvo(),
		laskuri = {};
	for (var i = 0; i < arvot.length; i++) {
		if (laskuri[arvot[i]]) {
			laskuri[arvot[i]]++;
		}
		else {
			laskuri[arvot[i]] = 1;
		}
	}
	//console.log(laskuri);
	return laskuri;
}

POKERI.Kasi.prototype.objToArray = function (obj) {
	var arvot = [];
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			arvot.push(obj[key]);
		}
	}
	return arvot;
}

POKERI.Kasi.prototype.onkoPareja = function(n) {
	var laskuri = this.arvoLaskuri(),
    	samat = [];
	for (var arvo in laskuri) {
		if (laskuri.hasOwnProperty(arvo)) {
			if (laskuri[arvo] === n) {
				samat.push(parseInt(arvo, 10));
			}
		}
	}
	if (n === 1 && this.pieniSuora(this.jarjestaArvo())) {
		return [5,4,3,2,1];
	}
	//console.log(samat.sort(this.numerot).reverse());
	return samat.sort(this.numerot).reverse();
}

POKERI.Kasi.prototype.suurin = function () {
	//var arvot = this.jarjestaArvo();
	//return arvot[arvot.length -1];
	return Math.max.apply(null, this.jarjestaArvo());
}

POKERI.Kasi.prototype.numerot = function (a, b) {
	return a - b;
}

var pakka = new POKERI.Pakka();
var kadet = [];

pakka.sekoita();
console.log(kadet.length);
for (var i = 0; i < 3; i++) {
	kadet[i] = new POKERI.Kasi(pakka.jaa(5));
	console.log(kadet.length + ' kättä jaettu');
}

//tulostus
for (i = 0; i < kadet.length; i++) {
	var lkm = "grid-item"+i;
	var newdiv = document.createElement("div");
	newdiv.id = lkm;
	
	document.getElementById("grid-container").appendChild(newdiv);
	document.getElementById(lkm).innerHTML += '<h2>';
	for (var j = 0; j < kadet[i].kortit.length; j++) {
		//document.getElementById(lkm).innerHTML += kadet[i].kortit[j].mjono() + ' ';
		document.getElementsByTagName("h2")[i].innerHTML += kadet[i].kortit[j].mjono() + ' ';
		//console.log(kadet[i].kortit[j].mjono());
	}
	document.getElementById(lkm).innerHTML += 'Kädessä on:'
	document.getElementById(lkm).innerHTML += '<br>--> ' + kadet[i].suurin() + ' suurin kortti';
	document.getElementById(lkm).innerHTML += '<br>--> ' + kadet[i].samaMaa() + ' korttia samaa maata';
//	document.getElementById(lkm).innerHTML += '<br>--> ' + kadet[i].jarjestaArvo() + ' järjestys';
	document.getElementById(lkm).innerHTML += '<br>--> ' + kadet[i].arvoSuora() + ' kortin suora';
	document.getElementById(lkm).innerHTML += '<br>--> ' + kadet[i].onkoPareja(2) + ' arvon pari(t)';
	document.getElementById(lkm).innerHTML += '<br>--> ' + kadet[i].onkoPareja(3) + ' arvon kolmoset';
	document.getElementById(lkm).innerHTML += '<br>--> ' + kadet[i].onkoPareja(4) + ' arvon neloset';
}