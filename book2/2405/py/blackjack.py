# encoding: utf-8
import tkinter as tk
import random

VEL = (86, 120) # Velikost posamezne karte
SRED = (43, 60) # Središče posamezne karte

# Definicija globalnih spremenljivk
igra_poteka = False
izid = ""
REZULTAT = {"SKUPAJ":0, "ZMAGE":0}

# Definicija globalnih spremenljivk za karte
BARVE = ("C", "S", "H", "D") # Club/Spade/Heart/Diamond
OPISI = ("A", "2", "3", "4", "5", "6", "7", "8", "9",
         "X", "J", "Q", "K")
VREDNOSTI = {"A":1, "2":2, "3":3, "4":4, "5":5,
             "6":6, "7":7, "8":8, "9":9, "X":10,
             "J":10, "Q":10, "K":10}


# Definicija razreda 'Karta'
class Karta:

  # Ustvari objekt 'Karta'
  def __init__(self, barva, opis):
    if (barva in BARVE) and (opis in OPISI):
      self.barva = barva
      self.opis = opis
    else:
      self.barva = None
      self.opis = None
      print("Neveljavna karta: ", barva, opis)

  # Vrne dvo-znakovno predstavitev karte
  def __str__(self):
    return self.barva + self.opis

  # Vrne barvo karte
  def vrni_barvo(self):
    return self.barva

  # Vrne opis ali rang karte
  def vrni_opis(self):
    return self.opis

  # Izriše sliko karte na platnu, na danem položaju
  def izpis(self, platno, poz):
    k = self.barva + self.opis
    platno.create_image(poz[0], poz[1], \
      anchor=tk.NW, image=KARTE[k])


# Definicija razreda 'Komplet'
class Komplet:

  # Ustvari objekt 'Komplet', ki vsebuje vseh 52 kart
  def __init__(self):
    self.karte = []
    for barva in BARVE:
      for opis in OPISI:
        karta = Karta(barva, opis)
        self.karte.append(karta)

  # Premešaj komplet kart
  def premesaj(self):
    random.shuffle(self.karte)

  # Deli naslednjo karto iz kompleta
  def deli_karto(self):
    return self.karte.pop()

  # Vrne besedilno predstavitev kompleta kart
  def __str__(self):
    sporocilo = "Komplet vsebuje"
    for karta in self.karte:
      sporocilo += " " + str(karta)
    return sporocilo


# Definicija razreda 'Igralec'
class Igralec(Komplet):

  # Ustvari objekt 'Igralec', ki privzeto ni delivec
  def __init__(self, delivec=False):
    self.karte = []
    self.delivec = delivec

  # Vrne predstavitev kart, ki jih v roki drži igralec
  def __str__(self):
    sporocilo = "V roki drži"
    skrita = False
    if self.delivec:
      skrita = True
    for karta in self.karte:
	  # Skrije prvo karto delivca
      if self.delivec and skrita:
        sporocilo += " ??"
        skrita = False
      else:
        sporocilo += " " + str(karta)
    return sporocilo

  # Igralcu doda nov objekt 'Karta'
  def dodaj_karto(self, karta):
    self.karte.append(karta)

  # Vrne skupno vrednost kart, ki jih igralec drži v roki
  def vrednost_kart(self):
    # Če ima igralec v roki karto as, jo šteje kot 1 in
    # nato, če vrednost kart v roki ne preseže 21, doda
    # vrednosti še 10 - saj je as vreden 1 ali 11 točk.
    vrednost = 0
    asi = 0
    for karta in self.karte:
      vrednost += VREDNOSTI[karta.opis]
      if karta.opis == "A":
        asi += 1
    for a in range(asi):
      # Če je vrednost kart v roki igralca dovolj nizka,
      # lahko štejemo asa kot 11, namesto 1...
      # To pomeni: vrednosti dodaj dodatnih 10 točk!
      if vrednost <= 11:
        vrednost += 10
    return vrednost

  # Izriše karte - uporabi metodo izpis razreda 'Karta'
  def izpis(self, platno, poz, delivec=False):
    ROB = 10
    i = 0
    for karta in self.karte:
      karta.izpis(platno, [poz[0]+i*(VEL[0]+ROB),poz[1]])
      # Če izrisujemo karte delivca in igra še poteka,
      # potem skrijemo prvo karto delivca tako, da čez
      # njo izrišemo sliko hrbtne strani karte.
      if (delivec and igra_poteka and i == 0):
        platno.create_image(poz[0], poz[1], \
          anchor=tk.NW, image=KARTE['BG'])
      i += 1


# Določi rokovalnik gumba 'Deli'
def deli():
  # Če kliknemo gumb medtem, ko igra poteka
  global izid, REZULTAT, igra_poteka
  if igra_poteka:
    izid = "Jack je zmagal."
    REZULTAT["SKUPAJ"] += 1

  global komplet
  komplet = Komplet()
  komplet.premesaj()

  global igralec, delivec
  igralec = Igralec()
  delivec = Igralec(True)
  # Izmenično razdeli dve karti igralcu in delivcu
  igralec.dodaj_karto(komplet.deli_karto())
  delivec.dodaj_karto(komplet.deli_karto())
  igralec.dodaj_karto(komplet.deli_karto())
  delivec.dodaj_karto(komplet.deli_karto())
  print("Igralec: " + str(igralec))
  print("Delivec: " + str(delivec))

  izid = "Na vrsti si. Vleci ali obdrži?"
  igra_poteka = True
  izpis()


# Določi rokovalnik gumba 'Vleci'
def vleci():
  # Če igra poteka, potem igralec vleče karto
  global izid, REZULTAT, igra_poteka, komplet, igralec
  if igra_poteka:
    igralec.dodaj_karto(komplet.deli_karto())
    print("Vrednost kart igralca: " +
          str(igralec.vrednost_kart()))
  # Če igralec preseže 21, potem priredi sporočilo
  # spremeljivki izid, posodobi vrednosti spremeljivk
  # igra_poteka in REZULTAT
  if igralec.vrednost_kart() > 21:
    izid = "Imaš več kot 21. Jack je zmagal. Nova igra?"
    igra_poteka = False
    print(izid)
    REZULTAT["SKUPAJ"] += 1
    print(REZULTAT)
  izpis()


# Določi rokovalnik gumba 'Obdrži'
def obdrzi():
  # Če igra poteka, potem delivec vleče karte, dokler
  # ni njihova skupna vrednost 17 ali več
  global izid, REZULTAT, igra_poteka, komplet, delivec
  while delivec.vrednost_kart() < 17:
    delivec.dodaj_karto(komplet.deli_karto())
    print("Vrednost kart delivca: " +
          str(delivec.vrednost_kart()))
  igra_poteka = False
  # Priredi sporočilo spremeljivki izid, posodobi
  # vrednosti spremeljivk igra_poteka in REZULTAT
  if delivec.vrednost_kart() > 21:
    izid = "Jack ima več kot 21. Zmagal si! Nova igra?"
    print(izid)
    REZULTAT["SKUPAJ"] += 1
    REZULTAT["ZMAGE"] += 1
    print(REZULTAT)
  else:
    # Določi zmagovalca
    REZULTAT["SKUPAJ"] += 1
    if igralec.vrednost_kart() > delivec.vrednost_kart():
      izid = "Zmagal si! Nova igra?"
      REZULTAT["ZMAGE"] += 1
    else:
      izid = "Jack je zmagal. Nova igra?"
    print(izid)
    print(REZULTAT)
  izpis()


# Določi rokovalnik izpisa/izrisa
def izpis():
  # Izbriši vsebino platna
  platno.delete("all")

  global izid, igralec, delivec
  igralec.izpis(platno, [50, 230])
  delivec.izpis(platno, [50, 410], True)

  txt1 = "Black Jack"
  txt2 = "Tvoje karte"
  txt3 = "Jackove karte"
  txt4 = "STANJE: " + izid
  txt5 = "REZULTAT: zmage: " + str(REZULTAT["ZMAGE"]) \
         + ", skupaj: " + str(REZULTAT["SKUPAJ"])

  platno.create_text(50, 70, fill="white", anchor=tk.NW, \
    text=txt1, font=("Times", 30))
  platno.create_text(50, 200, fill="white", anchor=tk.NW, \
    text=txt2, font=("Times", 15))
  platno.create_text(50, 380, fill="white", anchor=tk.NW, \
    text=txt3, font=("Times", 15))
  platno.create_text(50, 140, fill="white", anchor=tk.NW, \
    text=txt4, font=("Times", 15))
  platno.create_text(50, 560, fill="white", anchor=tk.NW, \
    text=txt5, font=("Times", 15))

# Ustvari okno, okvir in platno
okno = tk.Tk()
okno.title("Black Jack")
okno.geometry("840x640")

okvir = tk.Frame(okno)
okvir.grid(row=0, column=0, pady=20)

platno = tk.Canvas(okno, width=650, height=600)
platno.configure(bg="darkgreen")
platno.grid(row=0, column=1, pady=20)

# Naloži slike kart. Slike kart so v podmapi 'karte',
# ki je v isti mapi kot datoteka 'blackjack.py'
KARTE = {'BG': tk.PhotoImage(file="karte/BG.gif")}
for barva in BARVE:
  for opis in OPISI:
    karta = barva + opis
    datoteka = "karte/" + karta + ".gif"
    KARTE[karta] = tk.PhotoImage(file=datoteka)

# Ustvari gumbe in jih poveži z dogodkovnimi rokovalniki
gumb1 = tk.Button(okvir, text="Deli", command=deli)
gumb1.configure(width=10)
gumb1.grid(row=0, column=0, padx=45)
gumb2 = tk.Button(okvir, text="Vleci", command=vleci)
gumb2.configure(width=10)
gumb2.grid(row=1, column=0, padx=45)
gumb3 = tk.Button(okvir, text="Obdrži", command=obdrzi)
gumb3.configure(width=10)
gumb3.grid(row=2, column=0, padx=45)

# Zaženi dogodkovno zanko
deli()
okno.mainloop()
