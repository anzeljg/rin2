# encoding: utf-8
import tkinter as tk
import random

# Definicija konstant
VEL = (86, 120) # Velikost posamezne karte
SRED = (43, 60) # Središče posamezne karte
KARTE = {}      # Slovar bo vseboval slike kart

# Definicija globalnih spremenljivk za karte
BARVE = ("S", "H", "D", "C")  # Spade/Heart/Diamond/Club
ZNAKI = ("♠", "♥", "♦", "♣")
OPISI = ("A", "2", "3", "4", "5", "6", "7",
         "8", "9", "X", "J", "Q", "K")
VREDNOSTI = {"A":1, "2":2, "3":3, "4":4, "5":5, "6":6, "7":7,
             "8":8, "9":9, "X":10, "J":10, "Q":10, "K":10}


# Definicija razreda 'Karta'
class Karta:

  def __init__(self, barva, opis):
    """ Inicializator """
    if (barva in BARVE) and (opis in OPISI):
      self._barva = barva
      self._opis = opis
    else:
      self._barva = None
      self._opis = None
      print("Neveljavna karta: ", barva, opis)

  def __str__(self):
    """ Vrne niz, ki predstavlja karto """
    return self._barva + self._opis

  def vrni_barvo(self):
    """ Vrne barvo karte """
    return self._barva

  def vrni_opis(self):
    """ Vrne opis ali rang karte """
    return self._opis

  def narisi(self, platno, poz):
    """ Nariše sliko karte na platnu, na danem položaju """
    k = self._barva + self._opis
    platno.create_image(poz[0], poz[1], \
      anchor=tk.NW, image=KARTE[k])


# Definicija razreda 'Komplet'
class Komplet:

  def __init__(self):
    """ Inicializator """
    self._karte = []
    for barva in BARVE:
      for opis in OPISI:
        self._karte.append(Karta(barva, opis))

  def __str__(self):
    """ Vrne niz, ki predstavlja komplet kart """
    sporocilo = "Komplet vsebuje"
    for karta in self._karte:
      sporocilo += " " + str(karta)
    return sporocilo

  def premesaj(self):
    """ Premeša karte v kompletu """
    random.shuffle(self._karte)

  def sprazni(self):
    """ Sprazni komplet kart """
    self._karte = []

  def deli_karto(self):
    """ Deli naslednjo karto iz kompleta """
    return self._karte.pop()


# Definicija razreda 'Igralec'
class Igralec(Komplet):

  def __init__(self, delivec=False):
    """ Inicializator """
    self._karte = []
    self._delivec = delivec
    self._skrij_karto = False

  def __str__(self):
    """ Vrne niz, ki predstavlja igralčeve karte """
    sporocilo = ""
    skrita_karta = self._skrij_karto
    for karta in self._karte:
      if self._delivec and skrita_karta:
        sporocilo += " ??"
        skrita_karta = False
      else:
        sporocilo += " " + str(karta)
    return sporocilo

  def dodaj_karto(self, karta):
    """ Igralcu doda nov objekt 'Karta' """
    self._karte.append(karta)

  def vrednost_kart(self):
    """ Vrne skupno vrednost kart, ki jih igralec drži v roki """
    # Če ima igralec v roki karto as, jo šteje kot 1 in nato, če
    # vrednost kart v roki ne preseže 21, doda vrednosti še 10 -
    # saj je as vreden 1 ali 11 točk.
    vrednost = 0
    asi = 0
    for karta in self._karte:
      vrednost += VREDNOSTI[karta._opis]
      if karta._opis == "A":
        asi += 1
    for a in range(asi):
      # Če je vrednost kart v roki igralca dovolj nizka, lahko
      # štejemo asa kot 11, namesto 1...
      # To pomeni: vrednosti dodaj dodatnih 10 točk!
      if vrednost <= 11:
        vrednost += 10
    return vrednost

  def narisi_karte(self, platno, poz):
    """ Nariše karte - uporabi metodo narisi razreda 'Karta' """
    ROB = 10
    i = 0
    for karta in self._karte:
      karta.narisi(platno, [poz[0]+i*(VEL[0]+ROB),poz[1]])
      i += 1

  def skrij_karto(self):
    """ Skrije prvo karto delivca """
    self._skrij_karto = True

  def razkrij_karto(self):
    """ Razkrije prvo karto delivca """
    self._skrij_karto = False

  def obrni_karto(self, platno, poz):
    """ Prvo karto delivca nariše obrnjeno na hrbtno stran """
    if self._delivec:
      platno.create_image(poz[0], poz[1], \
        anchor=tk.NW, image=KARTE['BG'])


# Definicija razreda 'BlackJack'
class BlackJack():

  _igra_poteka = False
  _izid = ""
  _REZULTAT = {"SKUPAJ":0, "ZMAGE":0}

  def __init__(self):
    """ Inicializator """
    # Ustvari okno, okvir in platno
    self.okno = tk.Tk()
    self.okno.title("Black Jack")
    self.okno.geometry("840x640")
    self.okvir = tk.Frame(self.okno)
    self.okvir.grid(row=0, column=0, pady=20)
    self.platno = tk.Canvas(self.okno, width=650, height=600)
    self.platno.configure(bg="darkgreen")
    self.platno.grid(row=0, column=1, pady=20)

    # Naloži slike kart. Slike kart so v podmapi 'karte', ki je v isti
    # mapi kot datoteka 'blackjack.py'
    global KARTE
    KARTE = {'BG': tk.PhotoImage(file="karte/BG1.gif")}
    for barva in BARVE:
      for opis in OPISI:
        karta = barva + opis
        datoteka = "karte/" + karta + ".gif"
        KARTE[karta] = tk.PhotoImage(file=datoteka)

    # Ustvari gumbe in jih poveži z dogodkovnimi rokovalniki
    self.gumb1 = tk.Button(self.okvir, text="Deli", command=self.deli)
    self.gumb1.configure(width=10)
    self.gumb1.grid(row=0, column=0, padx=45)
    self.gumb2 = tk.Button(self.okvir, text="Vleci", command=self.vleci)
    self.gumb2.configure(width=10)
    self.gumb2.grid(row=1, column=0, padx=45)
    self.gumb3 = tk.Button(self.okvir, text="Obdrži", command=self.obdrzi)
    self.gumb3.configure(width=10)
    self.gumb3.grid(row=2, column=0, padx=45)

    # Dodaj igralca in delivca
    self._igralec = Igralec()
    self._delivec = Igralec(True)

    # Razdeli karte
    self.deli()

    # Zaženi dogodkovno zanko
    self.okno.mainloop()

  def deli(self):
    """ Rokovalnik gumba 'Deli' """
    # Ustvari nov komplet kart in ga premešaj
    self._komplet = Komplet()
    self._komplet.premesaj()

    # Dodaj igralca in delivca ter začni igro
    self._igralec._karte = []
    self._delivec._karte = []
    self._igra_poteka = True
    self._delivec.skrij_karto()
    self._izid = ""

    # Izmenično razdeli dve karti igralcu in delivcu
    self._igralec.dodaj_karto(self._komplet.deli_karto())
    self._delivec.dodaj_karto(self._komplet.deli_karto())
    self._igralec.dodaj_karto(self._komplet.deli_karto())
    self._delivec.dodaj_karto(self._komplet.deli_karto())

    # Nariši karte igralca in delivca
    self.narisi()

  def vleci(self):
    """ Rokovalnik gumba 'Vleci' """
    if self._igra_poteka:
      self._igralec.dodaj_karto(self._komplet.deli_karto())

    # Če igralec preseže 21, priredi sporočilo spremeljivki _izid
    # ter posodobi vrednosti spremeljivk _igra_poteka in _REZULTAT
    if self._igralec.vrednost_kart() > 21:
      self._izid = "Imaš več kot 21. Jack je zmagal. Nova igra?"
      self._igra_poteka = False
      self._REZULTAT["SKUPAJ"] += 1
      # Končaj igro
      self._igra_poteka = False
      self._delivec.razkrij_karto()

    # Nariši karte igralca in delivca
    self.narisi()

  def obdrzi(self):
    """ Rokovalnik gumba 'Obdrži' """
    # Če igra poteka, potem delivec vleče karte, dokler ni njihova
    # skupna vrednost 17 ali več
    while self._delivec.vrednost_kart() < 17:
      self._delivec.dodaj_karto(self._komplet.deli_karto())
    
    # Končaj igro
    self._igra_poteka = False
    self._delivec.razkrij_karto()

    # Priredi sporočilo spremeljivki _izid ter posodobi vrednosti
    # spremeljivk _igra_poteka in _REZULTAT
    if self._delivec.vrednost_kart() > 21:
      self._izid = "Jack ima več kot 21. Zmagal si! Nova igra?"
      self._REZULTAT["SKUPAJ"] += 1
      self._REZULTAT["ZMAGE"] += 1
    else:
      # Določi zmagovalca
      self._REZULTAT["SKUPAJ"] += 1
      if self._igralec.vrednost_kart() > self._delivec.vrednost_kart():
        self._izid = "Zmagal si! Nova igra?"
        self._REZULTAT["ZMAGE"] += 1
      else:
        self._izid = "Jack je zmagal. Nova igra?"

    # Nariši karte igralca in delivca ter izid igre
    self.narisi()

  def narisi(self):
    """ Rokovalnik izpisa oz. izrisa """
    # Izbriši vsebino platna
    self.platno.delete("all")

    # Nariši karte igralca in delivca
    self._igralec.narisi_karte(self.platno, [50, 220])
    self._delivec.narisi_karte(self.platno, [50, 400])
    # Skrij prvo karto delivca, če igra poteka
    if self._igra_poteka:
      self._delivec.obrni_karto(self.platno, [50, 400])

    _txt1 = "Black Jack"
    _txt2 = "Tvoje karte"
    _txt3 = "Jackove karte"
    _txt4 = "STANJE: " + self._izid
    _txt5 = "REZULTAT: zmage: " + str(self._REZULTAT["ZMAGE"]) \
            + ", skupaj: " + str(self._REZULTAT["SKUPAJ"])

    self.platno.create_text(50, 50, fill="white", anchor=tk.NW, \
      text=_txt1, font=("Times", 30))
    self.platno.create_text(50, 180, fill="white", anchor=tk.NW, \
      text=_txt2, font=("Times", 15))
    self.platno.create_text(50, 360, fill="white", anchor=tk.NW, \
      text=_txt3, font=("Times", 15))
    self.platno.create_text(50, 120, fill="white", anchor=tk.NW, \
      text=_txt4, font=("Times", 15))
    self.platno.create_text(50, 540, fill="white", anchor=tk.NW, \
      text=_txt5, font=("Times", 15))


# Zaženemo igro
BlackJack()
