# coding: utf-8

class Karta:

  _barve = ["Pikov", "Srčev", "Karin", "Križev"]
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
      s += " ima\n" + Komplet.__str__(self)
    return s
