# coding: utf-8

class Karta:

  _barve = ["Križev", "Karin", "Srčev", "Pikov"]
  _opisi = [None, "as", "2", "3", "4", "5", "6", "7",
            "8", "9", "10", "fant", "dama", "kralj"]

  def __init__(self, barva=0, vrednost=0):
    """ Inicializator """
    self._barva = barva
    self._vrednost = vrednost

  def __str__(self):
    """ Vrne niz, ki predstavlja karto """
    b = self._barva
    v = self._vrednost
    k = "" # Končnica za moško obliko
    if (v >= 2 and v <= 10 or v == 12):
      k = "a" # Končnica za žensko obliko
    return (self._barve[b] + k + " " + self._opisi[v])

  def cmp(self, karta):
    """ Primerja dve karti """
    # Preveri barve
    if self._barva > karta._barva: return 1
    if self._barva < karta._barva: return -1
    # Ista barva... preveri vrednosti
    if self._vrednost > karta._vrednost: return 1
    if self._vrednost < karta._vrednost: return -1
    # Ista vrednost... ista karta
    return 0

  def __eq__(self, karta):
    """ Prekrije operator == za primerjanje kart """
    return self.cmp(karta) == 0

  def __le__(self, karta):
    """ Prekrije operator <= za primerjanje kart """
    return self.cmp(karta) <= 0

  def __ge__(self, karta):
    """ Prekrije operator >= za primerjanje kart """
    return self.cmp(karta) >= 0

  def __gt__(self, karta):
    """ Prekrije operator > za primerjanje kart """
    return self.cmp(karta) > 0

  def __lt__(self, karta):
    """ Prekrije operator < za primerjanje kart """
    return self.cmp(karta) < 0

  def __ne__(self, karta):
    """ Prekrije operator != za primerjanje kart """
    return self.cmp(karta) != 0


class Komplet:

  def __init__(self):
    """ Inicializator """
    self._karte = []
    for barva in range(4):
      for vrednost in range(1, 14):
        self._karte.append(Karta(barva, vrednost))

  def __str__(self):
    """ Vrne niz, ki predstavlja komplet kart """
    s = ""
    for i in range(len(self._karte)):
      s = s + " " * i + str(self._karte[i]) + "\n"
    return s

  def premesaj(self):
    """ Premeša karte v kompletu """
    import random
    random.shuffle(self._karte)

  def uredi(self):
    """ Uredi karte v kompletu """
    self._karte.sort()

  def dodaj(self, karta):
    """ Doda karto v komplet kart """
    self._karte.append(karta)

  def odstrani(self, karta):
    """ Odstrani karto iz kompleta kart """
    if karta in self._karte:
      self._karte.remove(karta)
      return True
    else:
      return False

  def deli(self, igralci, stev_kart=999):
    """ Razdeli karte igralcem, ki igrajo igro """
    stev_igralcev = len(igralci)
    for i in range(stev_kart):
      if self.je_prazen():
        break                               # Ni več kart; končaj
      karta = self._karte.pop()             # Vzemi vrhnjo karto
      igralec = igralci[i % stev_igralcev]  # Kdo je naslednji?
      igralec.dodaj(karta)                  # Dodaj karto igralcu

  def je_prazen(self):
    """ Vrne, ali je komplet kart prazen """
    return self._karte == []

  def sprazni(self):
    """ Sprazni komplet kart """
    self._karte = []


class Igralec(Komplet):

  def __init__(self, ime=""):
    """ Inicializator """
    self._karte = []
    self._ime = ime

  def __str__(self):
    """ Vrne niz, ki predstavlja igralčeve karte """
    s = "Igralec " + str(self._ime)
    if self.je_prazen():
      s += " nima kart\n"
    else:
      s += " ima\n"
    return s + Komplet.__str__(self)


class IgraKart:

  def __init__(self):
    """ Inicializator """
    self._komplet = Komplet()
    self._komplet.premesaj()


class CrniPeterIgralec(Igralec):

  def odstrani_pare(self):
    """ Odstrani pare iz igralčevih kart """
    stevec = 0
    originalne_karte = self._karte[:]
    for karta in originalne_karte:
      par = Karta(3 - karta._barva, karta._vrednost)
      if par in self._karte:
        self._karte.remove(karta)
        self._karte.remove(par)
        print("Igralec " + self._ime +  ": " +
              str(karta) + " se ujema s " + str(par))
        stevec += 1
    return stevec


class CrniPeterIgra(IgraKart):

  def igraj(self, imena):
    """ Igra igro s kartami: Črni Peter """
    # Odstrani križevega fanta - t.j. Črnega Petra
    self._komplet.odstrani(Karta(0,11))

    # Dodaj igralce
    self._igralci = []
    for ime in imena:
      self._igralci.append(CrniPeterIgralec(ime))

    # Razdeli karte
    self._komplet.deli(self._igralci)
    print("---------- Karte so razdeljene")
    self.izpisi_igralce()

    # Odstrani začetne pare
    pari = self.odstrani_vse_pare()
    print("---------- Pari odstranjeni, igra se začenja")
    self.izpisi_igralce()

    # Igraj, dokler ne najdeš pare za vseh 50 kart
    obrat = 0
    stev_igralcev = len(self._igralci)
    while pari < 25:
      pari += self.igraj_en_obrat(obrat)
      obrat = (obrat + 1) % stev_igralcev

    print("---------- Konec igre")
    self.izpisi_igralce()

  def odstrani_vse_pare(self):
    """ Odstrani vse pare iz kart vseh igralcev """
    stevec = 0
    for igralec in self._igralci:
      stevec += igralec.odstrani_pare()
    return stevec

  def igraj_en_obrat(self, i):
    """ Odigra en krog igre """
    if self._igralci[i].je_prazen():
      return 0
    sosed = self.najdi_soseda(i)
    izbrana_karta = self._igralci[sosed]._karte.pop()
    self._igralci[i].dodaj(izbrana_karta)
    print("Igralec", self._igralci[i]._ime, "je izbral", izbrana_karta)
    stevec = self._igralci[i].odstrani_pare()
    self._igralci[i].premesaj()
    return stevec

  def najdi_soseda(self, i):
    """ Najde soseda trenutnega igralca """
    stev_igralcev = len(self._igralci)
    for naslednji in range(1, stev_igralcev):
      sosed = (i + naslednji) % stev_igralcev
      if not self._igralci[sosed].je_prazen():
        return sosed

  def izpisi_igralce(self):
    """ Izpiše igralce, ki igrajo igro """
    stev_igralcev = len(self._igralci)
    for i in range(stev_igralcev):
      print(self._igralci[i])


igra = CrniPeterIgra()
igra.igraj(["Janez", "Karel", "Lojze"])
