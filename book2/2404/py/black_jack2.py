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


class BlackJackIgralec(Igralec):

  def stevilo_kart(self):
    """ Vrne število kart, ki jih ima igralec """
    return len(self._karte)

  def vrednost_kart(self):
    """ Vrne vrednost kart, ki jih ima igralec """
    vsota = 0
    for karta in self._karte:
      if karta._vrednost >= 10: # figura ali 10
        vsota += 10
      elif karta._vrednost > 1: # karta od 2 do 9
        vsota += karta._vrednost
      else: # as, prištej 1 ali 11
        if vsota + 11 <= 21:
          vsota += 11
        else:
          vsota += 1
    return vsota

  def ima_blackjack(self):
    """ Ali ima igralec Black Jack """
    asi = [Karta(0,1), Karta(1,1), Karta(2,1), Karta(3,1)]
    # figure: desetke, fanti, dame in kralji
    f = [Karta(0,10), Karta(0,11), Karta(0,12), Karta(0,13),
         Karta(1,10), Karta(1,11), Karta(1,12), Karta(1,13),
         Karta(2,10), Karta(2,11), Karta(2,12), Karta(2,13),
         Karta(3,10), Karta(3,11), Karta(3,12), Karta(3,13)]
    blackjack = False
    if self._karte[0] in asi and self._karte[1] in f:
      blackjack = True
    if self._karte[0] in f and self._karte[1] in asi:
      blackjack = True
    return blackjack

  def rezultat(self, rezultat_delivca):
    """ Vrne rezultat igralca """
    s = "Igralec " + self._ime + ":\n"
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
    """ Inicializator """
    self._karte = []
    self._skrito = True

  def __str__(self):
    """ Vrne niz, ki predstavlja delivčeve karte """
    s = "Delivec ima\n"
    if self._skrito:
      s += str(self._karte[0]) + "\n (skrita karta)\n"
    else:
      s += Komplet.__str__(self)
    return s

  def rezultat(self, rezultat_delivca=0):
    """ Vrne rezultat delivca """
    s = "Delivec:\n"
    s += " Vrednost kart v roki " + str(self.vrednost_kart())
    if self.ima_blackjack():
      s += " (Black Jack)"
    s += "\n"
    return s


class BlackJack(Komplet):

  def igraj(self, imena):
    """ Igra igro s kartami: Black Jack """
    # Dodaj igralca, ki igra
    ime = input("Vpiši svoje ime: ")
    self._igralci = []
    self._igralci.append(BlackJackIgralec(ime))
    # Dodaj druge igralce
    for ime in imena:
      self._igralci.append(BlackJackIgralec(ime))

    # Dodaj delivca
    self._igralci.append(BlackJackDelivec())

    # Premešaj karte
    self.premesaj()

    # Razdeli karte - vsakemu igralcu 2 karti
    self.deli(self._igralci, len(self._igralci)*2)
    print("---------- Karte so razdeljene")
    self.izpisi_igralce()

    # Igralec želi dodatne karte ali ne
    igralec = self._igralci[0]
    poteza = ""
    while poteza.lower() not in ["s", "stand", "stoj"]:
      # Igralec lahko ima največ 5 kart
      # ali vrednost kart presega 21
      if igralec.stevilo_kart() == 5 or igralec.vrednost_kart() > 21:
        break
      poteza = input("Hit ali Stand? ")
      if poteza.lower() in ["h", "hit", "d", "draw", "vleci"]:
        karta = self._karte.pop()
        igralec.dodaj(karta)
      print("---------- Stanje kart igralca in delivca")
      self.izpisi_igralce()

    # Drugi igralci in delivec vlečejo karte,
    # dokler je vsota manjša ali enaka 16
    stev_igralcev = len(self._igralci)
    for i in range(1, stev_igralcev):
      igralec = self._igralci[i]
      while igralec.vrednost_kart() <= 16:
        # Igralec lahko ima največ 5 kart
        if igralec.stevilo_kart() == 5:
          break
        karta = self._karte.pop()
        igralec.dodaj(karta)
      # Če je zadnji igralec (=delivec), obrni skrito karto
      if i == stev_igralcev-1:
        self._igralci[i]._skrito = False
    print("---------- Drugi igralci igrajo proti delivcu")
    self.izpisi_igralce()

    # Izpis rezultatov (kdo zmaga in kdo izgubi)
    print("---------- Konec igre, izpis rezultatov")
    self.izpisi_rezultate()

  def izpisi_igralce(self):
    """ Izpiše igralce, ki igrajo igro """
    stev_igralcev = len(self._igralci)
    for i in range(stev_igralcev):
      print(self._igralci[i])

  def izpisi_rezultate(self):
    """ Izpiše rezultate vseh igralcev """
    delivec = self._igralci[-1] # zadnji igralec
    rezultat_delivca = delivec.vrednost_kart()
    stev_igralcev = len(self._igralci)
    for i in range(stev_igralcev):
      print(self._igralci[i].rezultat(rezultat_delivca))


igra = BlackJack()
igra.igraj(["Janez", "Karel", "Lojze"])
