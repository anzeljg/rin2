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


class BlackJackIgralec(Igralec):

  def stevilo_kart(self):
    return len(self.karte)

  def vrednost_kart(self):
    vsota = 0
    for karta in self.karte:
      if karta.vrednost >= 10: # figura ali 10
        vsota += 10
      elif karta.vrednost > 1: # karta od 2 do 9
        vsota += karta.vrednost
      else: # as, prištej 1 ali 11
        if vsota + 11 <= 21:
          vsota += 11
        else:
          vsota += 1
    return vsota

  def ima_blackjack(self):
    asi = [Karta(0,1), Karta(1,1), Karta(2,1), Karta(3,1)]
    # figure: destke, fanti, dame in kralji
    f = [Karta(0,10), Karta(0,11), Karta(0,12), Karta(0,13),
         Karta(1,10), Karta(1,11), Karta(1,12), Karta(1,13),
         Karta(2,10), Karta(2,11), Karta(2,12), Karta(2,13),
         Karta(3,10), Karta(3,11), Karta(3,12), Karta(3,13)]
    blackjack = False
    if self.karte[0] in asi and self.karte[1] in f:
      blackjack = True
    if self.karte[0] in f and self.karte[1] in asi:
      blackjack = True
    return blackjack

  def rezultat(self, rezultat_delivca):
    s = "Igralec " + self.ime + ":\n"
    s += " Vrednost kart v roki " + str(self.vrednost_kart())
    if self.ima_blackjack():
      s += " (Black Jack)"
    s += "\n"

    rezultat = self.vrednost_kart()
    if self.ima_blackjack():
      s += " ZMAGA\n"
    elif rezultat <= 21 and rezultat > rezultat_delivca:
      s += " ZMAGA\n"
    elif rezultat <= 21 and rezultat_delivca > 21:
      s += " ZMAGA\n"
    else:
      s += " PORAZ\n"
    return s


class BlackJackDelivec(BlackJackIgralec):

  def __init__(self):
    self.karte = []
    self.skrito = True

  def __str__(self):
    s = "Delivec ima\n"
    if self.skrito:
      s += str(self.karte[0]) + "\n (skrita karta)\n"
    else:
      s += Komplet.__str__(self)
    return s

  def rezultat(self, rezultat_delivca=0):
    s = "Delivec:\n"
    s += " Vrednost kart v roki " + str(self.vrednost_kart())
    if self.ima_blackjack():
      s += " (Black Jack)"
    s += "\n"
    return s


class BlackJackIgra(IgraKart):

  def igraj(self, imena):
    # Dodaj igralca, ki igra
    ime = input("Vpiši svoje ime: ")
    self.igralci = []
    self.igralci.append(BlackJackIgralec(ime))
    # Dodaj druge igralce
    for ime in imena:
      self.igralci.append(BlackJackIgralec(ime))

    # Dodaj delivca
    self.igralci.append(BlackJackDelivec())

    # Razdeli karte - vsakemu igralcu 2 karti
    self.komplet.deli(self.igralci, len(self.igralci)*2)
    print("---------- Karte so razdeljene")
    self.izpisi_igralce()

    # Igralec želi dodatne karte ali ne
    igralec = self.igralci[0]
    poteza = ""
    while poteza.lower() not in ["s", "stand", "stoj"]:
      # Igralec lahko ima največ 5 kart
      if igralec.stevilo_kart() == 5:
        break
      poteza = input("Hit ali Stand?")
      if poteza.lower() in ["h", "hit", "d", "draw"]:
        karta = self.komplet.karte.pop()
        igralec.dodaj(karta)
      print("---------- Stanje kart igralca in delivca")
      self.izpisi_igralce()

    # Drugi igralci in delivec vlečejo karte,
    # dokler je vsota manjša ali enaka 16
    stev_igralcev = len(self.igralci)
    for i in range(1, stev_igralcev):
      igralec = self.igralci[i]
      while igralec.vrednost_kart() <= 16:
        # Igralec lahko ima največ 5 kart
        if igralec.stevilo_kart() == 5:
          break
        karta = self.komplet.karte.pop()
        igralec.dodaj(karta)
      # Če je zadnji igralec (=delivec), obrni skrito karto
      if i == stev_igralcev-1:
        self.igralci[i].skrito = False
    print("---------- Drugi igralci igrajo proti delivcu")
    self.izpisi_igralce()

    # Izpis rezultatov (kdo zmaga in kdo izgubi)
    print("---------- Konec igre, izpis rezultatov")
    self.izpisi_rezultate()

  def izpisi_igralce(self):
    stev_igralcev = len(self.igralci)
    for i in range(stev_igralcev):
      print(self.igralci[i])

  def izpisi_rezultate(self):
    delivec = self.igralci[-1] # zadnji igralec
    rezultat_delivca = delivec.vrednost_kart()
    stev_igralcev = len(self.igralci)
    for i in range(stev_igralcev):
      print(self.igralci[i].rezultat(rezultat_delivca))


igra = BlackJackIgra()
igra.igraj(["Janez", "Karel", "Lojze"])
