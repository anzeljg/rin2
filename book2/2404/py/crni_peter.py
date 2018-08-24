# coding: utf-8

class Karta:

  barve = ["Križev", "Karin", "Srčev", "Pikov"]
  opisi = [None, "as", "2", "3", "4", "5", "6", "7",
           "8", "9", "10", "fant", "dama", "kralj"]

  def __init__(self, barva=0, vrednost=0):
    self.barva = barva
    self.vrednost = vrednost

  def __str__(self):
    b = self.barva
    v = self.vrednost
    k = "" # Končnica za moško obliko
    if (v >= 2 and v <= 10 or v == 12):
      k = "a" # Končnica za žensko obliko
    return (self.barve[b] + k + " " + self.opisi[v])

  def cmp(self, other):
    # Preveri barve
    if self.barva > other.barva: return 1
    if self.barva < other.barva: return -1
    # Ista barva... preveri vrednosti
    if self.vrednost > other.vrednost: return 1
    if self.vrednost < other.vrednost: return -1
    # Ista vrednost... ista karta
    return 0

  def __eq__(self, other):
    return self.cmp(other) == 0

  def __le__(self, other):
    return self.cmp(other) <= 0

  def __ge__(self, other):
    return self.cmp(other) >= 0

  def __gt__(self, other):
    return self.cmp(other) > 0

  def __lt__(self, other):
    return self.cmp(other) < 0

  def __ne__(self, other):
    return self.cmp(other) != 0


class Komplet:

  def __init__(self):
    self.karte = []
    for barva in range(4):
      for vrednost in range(1, 14):
        self.karte.append(Karta(barva, vrednost))

  def __str__(self):
    s = ""
    for i in range(len(self.karte)):
      s = s + " " * i + str(self.karte[i]) + "\n"
    return s

  def premesaj(self):
    import random
    random.shuffle(self.karte)

  def uredi(self):
    self.karte.sort()

  def dodaj(self, karta):
    self.karte.append(karta)

  def odstrani(self, karta):
    if karta in self.karte:
      self.karte.remove(karta)
      return True
    else:
      return False

  def deli(self, igralci, stev_kart=999):
    stev_igralcev = len(igralci)
    for i in range(stev_kart):
      if self.je_prazen():
        break
      karta = self.karte.pop()
      igralec = igralci[i % stev_igralcev]
      igralec.dodaj(karta)

  def je_prazen(self):
    return self.karte == []

  def sprazni(self):
    self.karte = []


class Igralec(Komplet):

  def __init__(self, ime=""):
    self.karte = []
    self.ime = ime

  def __str__(self):
    s = "Igralec " + str(self.ime)
    if self.je_prazen():
      s += " nima kart\n"
    else:
      s += " ima\n"
    return s + Komplet.__str__(self)


class IgraKart:

  def __init__(self):
    self.komplet = Komplet()
    self.komplet.premesaj()


class CrniPeterIgralec(Igralec):

  def odstrani_pare(self):
    stevec = 0
    originalne_karte = self.karte[:]
    for karta in originalne_karte:
      par = Karta(3 - karta.barva, karta.vrednost)
      if par in self.karte:
        self.karte.remove(karta)
        self.karte.remove(par)
        print("Igralec " + self.ime +  ": " +
              str(karta) + " se ujema s " + str(par))
        stevec += 1
    return stevec


class CrniPeterIgra(IgraKart):

  def igraj(self, imena):
    # Odstrani križevega fanta
    self.komplet.odstrani(Karta(0,11))

    # Dodaj igralce
    self.igralci = []
    for ime in imena:
      self.igralci.append(CrniPeterIgralec(ime))

    # Razdeli karte
    self.komplet.deli(self.igralci)
    print("---------- Karte so razdeljene")
    self.izpisi_igralce()

    # Odstrani začetne pare
    pari = self.odstrani_vse_pare()
    print("---------- Pari odstranjeni, igra se začenja")
    self.izpisi_igralce()

    # Igraj, dokler ne najdeš pare za vseh 50 kart
    obrat = 0
    stev_igralcev = len(self.igralci)
    while pari < 25:
      pari += self.igraj_en_obrat(obrat)
      obrat = (obrat + 1) % stev_igralcev

    print("---------- Konec igre")
    self.izpisi_igralce()

  def odstrani_vse_pare(self):
    stevec = 0
    for igralec in self.igralci:
      stevec += igralec.odstrani_pare()
    return stevec

  def igraj_en_obrat(self, i):
    if self.igralci[i].je_prazen():
      return 0
    sosed = self.najdi_soseda(i)
    izbrana_karta = self.igralci[sosed].karte.pop()
    self.igralci[i].dodaj(izbrana_karta)
    print("Igralec", self.igralci[i].ime, "je izbral", izbrana_karta)
    stevec = self.igralci[i].odstrani_pare()
    self.igralci[i].premesaj()
    return stevec

  def najdi_soseda(self, i):
    stev_igralcev = len(self.igralci)
    for naslednji in range(1, stev_igralcev):
      sosed = (i + naslednji) % stev_igralcev
      if not self.igralci[sosed].je_prazen():
        return sosed

  def izpisi_igralce(self):
    stev_igralcev = len(self.igralci)
    for i in range(stev_igralcev):
      print(self.igralci[i])


igra = CrniPeterIgra()
igra.igraj(["Janez", "Karel", "Lojze"])
