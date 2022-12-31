// External library: blackjack.py
Sk.builtinFiles["files"]["src/lib/blackjack.py"] = '# coding: utf-8\n\nclass Karta:\n\n  _barve = ["Pikov", "Srčev", "Karin", "Križev"]\n  _opisi = [None, "as", "2", "3", "4", "5", "6", "7",\n            "8", "9", "10", "fant", "dama", "kralj"]\n\n  def __init__(self, barva=0, vrednost=0):\n    """ Inicializator """\n    self._barva = barva\n    self._vrednost = vrednost\n\n  def __str__(self):\n    """ Vrne niz, ki predstavlja karto """\n    b = self._barva\n    v = self._vrednost\n    k = "" # Končnica za moško obliko\n    if (v >= 2 and v <= 10 or v == 12):\n      k = "a" # Končnica za žensko obliko\n    return (self._barve[b] + k + " " + self._opisi[v])\n\n  def cmp(self, karta):\n    """ Primerja dve karti """\n    # Preveri barve\n    if self._barva > karta._barva: return 1\n    if self._barva < karta._barva: return -1\n    # Ista barva... preveri vrednosti\n    if self._vrednost > karta._vrednost: return 1\n    if self._vrednost < karta._vrednost: return -1\n    # Ista vrednost... ista karta\n    return 0\n\n  def __eq__(self, karta):\n    """ Prekrije operator == za primerjanje kart """\n    return self.cmp(karta) == 0\n\n  def __le__(self, karta):\n    """ Prekrije operator <= za primerjanje kart """\n    return self.cmp(karta) <= 0\n\n  def __ge__(self, karta):\n    """ Prekrije operator >= za primerjanje kart """\n    return self.cmp(karta) >= 0\n\n  def __gt__(self, karta):\n    """ Prekrije operator > za primerjanje kart """\n    return self.cmp(karta) > 0\n\n  def __lt__(self, karta):\n    """ Prekrije operator < za primerjanje kart """\n    return self.cmp(karta) < 0\n\n  def __ne__(self, karta):\n    """ Prekrije operator != za primerjanje kart """\n    return self.cmp(karta) != 0\n\n\nclass Komplet:\n\n  def __init__(self):\n    """ Inicializator """\n    self._karte = []\n    for barva in range(4):\n      for vrednost in range(1, 14):\n        self._karte.append(Karta(barva, vrednost))\n\n  def __str__(self):\n    """ Vrne niz, ki predstavlja komplet kart """\n    s = ""\n    for i in range(len(self._karte)):\n      s = s + " " * i + str(self._karte[i]) + "\\n"\n    return s\n\n  def premesaj(self):\n    """ Premeša karte v kompletu """\n    import random\n    random.shuffle(self._karte)\n\n  def uredi(self):\n    """ Uredi karte v kompletu """\n    self._karte.sort()\n\n  def dodaj(self, karta):\n    """ Doda karto v komplet kart """\n    self._karte.append(karta)\n\n  def odstrani(self, karta):\n    """ Odstrani karto iz kompleta kart """\n    if karta in self._karte:\n      self._karte.remove(karta)\n      return True\n    else:\n      return False\n\n  def deli(self, igralci, stev_kart=999):\n    """ Razdeli karte igralcem, ki igrajo igro """\n    stev_igralcev = len(igralci)\n    for i in range(stev_kart):\n      if self.je_prazen():\n        break                               # Ni več kart; končaj\n      karta = self._karte.pop()             # Vzemi vrhnjo karto\n      igralec = igralci[i % stev_igralcev]  # Kdo je naslednji?\n      igralec.dodaj(karta)                  # Dodaj karto igralcu\n\n  def je_prazen(self):\n    """ Vrne, ali je komplet kart prazen """\n    return self._karte == []\n\n  def sprazni(self):\n    """ Sprazni komplet kart """\n    self._karte = []\n\n\nclass Igralec(Komplet):\n\n  def __init__(self, ime=""):\n    """ Inicializator """\n    self._karte = []\n    self._ime = ime\n\n  def __str__(self):\n    """ Vrne niz, ki predstavlja igralčeve karte """\n    s = "Igralec " + str(self._ime)\n    if self.je_prazen():\n      s += " nima kart\\n"\n    else:\n      s += " ima\\n" + Komplet.__str__(self)\n    return s\n\n\nclass BlackJackIgralec(Igralec):\n\n  def stevilo_kart(self):\n    """ Vrne število kart, ki jih ima igralec """\n    return len(self._karte)\n\n  def vrednost_kart(self):\n    """ Vrne vrednost kart, ki jih ima igralec """\n    vsota = 0\n    for karta in self._karte:\n      if karta._vrednost >= 10: # figura ali 10\n        vsota += 10\n      elif karta._vrednost > 1: # karta od 2 do 9\n        vsota += karta._vrednost\n      else: # as, prištej 1 ali 11\n        if vsota + 11 <= 21:\n          vsota += 11\n        else:\n          vsota += 1\n    return vsota\n\n  def ima_blackjack(self):\n    """ Ali ima igralec Black Jack """\n    asi = [Karta(0,1), Karta(1,1), Karta(2,1), Karta(3,1)]\n    # figure: desetke, fanti, dame in kralji\n    f = [Karta(0,10), Karta(0,11), Karta(0,12), Karta(0,13),\n         Karta(1,10), Karta(1,11), Karta(1,12), Karta(1,13),\n         Karta(2,10), Karta(2,11), Karta(2,12), Karta(2,13),\n         Karta(3,10), Karta(3,11), Karta(3,12), Karta(3,13)]\n    blackjack = False\n    if self._karte[0] in asi and self._karte[1] in f:\n      blackjack = True\n    if self._karte[0] in f and self._karte[1] in asi:\n      blackjack = True\n    return blackjack\n\n  def rezultat(self, rezultat_delivca):\n    """ Vrne rezultat igralca """\n    s = "Igralec " + self._ime + ":\\n"\n    s += " Vrednost kart v roki " + str(self.vrednost_kart())\n    if self.ima_blackjack():\n      s += " (Black Jack)"\n    s += "\\n"\n\n    rezultat = self.vrednost_kart()\n    if self.ima_blackjack():\n      s += " ZMAGA\\n"\n    elif rezultat <= 21 and rezultat > rezultat_delivca:\n      s += " ZMAGA\\n"\n    elif rezultat <= 21 and rezultat_delivca > 21:\n      s += " ZMAGA\\n"\n    else:\n      s += " PORAZ\\n"\n    return s\n\n\nclass BlackJackDelivec(BlackJackIgralec):\n\n  def __init__(self):\n    """ Inicializator """\n    self._karte = []\n    self._skrito = True\n\n  def __str__(self):\n    """ Vrne niz, ki predstavlja delivčeve karte """\n    s = "Delivec ima\\n"\n    if self._skrito:\n      s += str(self._karte[0]) + "\\n (skrita karta)\\n"\n    else:\n      s += Komplet.__str__(self)\n    return s\n\n  def rezultat(self, rezultat_delivca=0):\n    """ Vrne rezultat delivca """\n    s = "Delivec:\\n"\n    s += " Vrednost kart v roki " + str(self.vrednost_kart())\n    if self.ima_blackjack():\n      s += " (Black Jack)"\n    s += "\\n"\n    return s\n\n  def odkrij(self):\n    """ Spremeni stanje skrite karte """\n    self._skrito = False';