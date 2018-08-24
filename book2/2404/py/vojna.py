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


class VojnaIgralec(Igralec):

  def __init__(self, ime=""):
    self.karte = []
    self.ime = ime
    # Začasno odlagališče kart
    self.shramba = []


class VojnaIgra(IgraKart):

  def igraj(self, imena):

    # Dodaj igralce
    self.igralci = []
    for ime in imena:
      self.igralci.append(VojnaIgralec(ime))

    # Razdeli karte
    self.komplet.deli(self.igralci)
    print("---------- Karte so razdeljene")
    self.izpisi_igralce()

    # Odstrani začetne pare
    print("---------- Igra se začenja")
    igralec1 = self.igralci[0]
    igralec2 = self.igralci[1]
    #TODO
    while len(igralec1.karte) > 0 and len(igralec2.karte) > 0:
      karta1 = igralec1.karte.pop()
      karta2 = igralec2.karte.pop()
      print(str(karta1) + " : " + str(karta2))
      if karta1.vrednost > karta2.vrednost:
        igralec1.karte.append(karta1)
        igralec1.karte.append(karta2)
      elif karta1.vrednost < karta2.vrednost:
        igralec2.karte.append(karta1)
        igralec2.karte.append(karta2)
      else:
        # Vojna!
        igralec1.shramba.append(karta1)
        igralec2.shramba.append(karta2)

        while karta1.vrednost == karta2.vrednost:
          stev = 3
          if (len(igralec1.karte) < 3):
            stev = len(igralec1.karte)
          for i in range(stev):
            karta1 = igralec1.karte.pop()
            igralec1.shramba.append(karta1)
          stev = 3
          if (len(igralec2.karte) < 3):
            stev = len(igralec2.karte)
          for i in range(stev):
            karta2 = igralec2.karte.pop()
            igralec2.shramba.append(karta2)

        if karta1.vrednost > karta2.vrednost:
          while len(igralec1.shramba) > 0:
            karta = igralec1.shramba.pop()
            igralec1.karte.append(karta)
          while len(igralec2.shramba) > 0:
            karta = igralec2.shramba.pop()
            igralec1.karte.append(karta)
        elif karta1.vrednost < karta2.vrednost:
          while len(igralec1.shramba) > 0:
            karta = igralec1.shramba.pop()
            igralec2.karte.append(karta)
          while len(igralec2.shramba) > 0:
            karta = igralec2.shramba.pop()
            igralec2.karte.append(karta)
        else:
          pass # do tega sploh ne bi smelo priti!
      self.izpisi_igralce()

    # Konec igre
    print("---------- Konec igre")
    if len(igralec1.karte) > 0:
      print("Zmagal je igralec " + igralec1.ime)
    else:
      print("Zmagal je igralec " + igralec2.ime)

  def izpisi_igralce(self):
    stev_igralcev = len(self.igralci)
    for i in range(stev_igralcev):
      print("Igralec " + self.igralci[i].ime + " ima " +
            str(len(self.igralci[i].karte)) + " kart")


igra = VojnaIgra()
igra.igraj(["Janez", "Karel"]) # 2 igralca
