# encoding: utf-8
import tkinter as tk
import random

VEL = (86, 120) # Velikost posamezne karte
SRED = (43, 60) # Središče posamezne karte

# Definicija globalnih spremenljivk
igra_poteka = False
vojna_poteka = False
izid = "Vrzi karto..."
REZULTAT = {"SKUPAJ":0, "ZMAGE":0}

# Definicija globalnih spremenljivk za karte
BARVE = ("C", "S", "H", "D") # Club/Spade/Heart/Diamond
OPISI = ("A", "2", "3", "4", "5", "6", "7", "8", "9",
         "X", "J", "Q", "K")
VREDNOSTI = {"A":14, "2":2, "3":3, "4":4, "5":5,
             "6":6, "7":7, "8":8, "9":9, "X":10,
             "J":11, "Q":12, "K":13}


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
  def izpis(self, platno, poz, hrbet=True):
    if hrbet:
      slika = KARTE["BG"]
    else:
      k = self.barva + self.opis
      slika = KARTE[k]
    platno.create_image(poz[0], poz[1], \
      anchor=tk.NW, image=slika)


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

  # Ustvari objekt 'Igralec'
  def __init__(self):
    self.karte = []
    # Karte, ki jih igralec odloži/vrže med igro
    self.zaloga = []

  # Vrne predstavitev kart, ki jih v roki drži igralec
  def __str__(self):
    sporocilo = "V roki drži"
    for karta in self.karte:
        sporocilo += " " + str(karta)
    return sporocilo

  # Igralcu doda nov objekt 'Karta' na konec
  def dodaj_karto(self, karta):
    self.karte.append(karta)

  # Igralcu doda objekt 'Karta' na začetek
  def vstavi_karto(self, karta):
    self.karte.insert(0, karta)

  # Igralcu odvzame objekt 'Karta' in ga doda v zalogo
  def vrzi_karto(self):
    if self.karte:
      karta = self.karte.pop()
      self.zaloga.append(karta)

  # Vrne število kart, ki jih ima igralec:
  # tistih v roki in odloženih
  def stevilo(self):
    return len(self.karte) + len(self.zaloga)

  # Izriše karte - uporabi metodo izpis razreda 'Karta'
  def izpis(self, platno, poz, delivec=False):
    # Izpis obrnjenih kart, ki jih ima igralec
    # še v roki. Vse karte so obrnjene
    ROB = 1
    i = 0
    for karta in self.karte:
      karta.izpis(platno, [poz[0]+i*ROB, poz[1]], True)
      i += 1
    # Izpis odvrženih kart
    ROB = 12
    ODMIK = 180
    i = 0
    for karta in self.zaloga:
      # Ali prikaže sprednjo ali zadnjo stran karte
      obrni = i % 3
      if i == len(self.zaloga)-1:
        obrni = False
      karta.izpis(platno, [ODMIK+poz[0]+i*ROB, poz[1]],
                  obrni)
      i += 1


# Določi krmilnik gumba 'Deli'
def deli():
  global komplet
  komplet = Komplet()
  komplet.premesaj()

  global igra_poteka, igralec, delivec
  igra_poteka = True
  igralec = Igralec()
  delivec = Igralec()
  # Izmenično razdeli 26 kart igralcu in delivcu
  for i in range(26):
    igralec.dodaj_karto(komplet.deli_karto())
    delivec.dodaj_karto(komplet.deli_karto())
  print("Igralec: "+str(igralec))
  print("Delivec: "+str(delivec))
  izpis()


# Določi krmilnik gumba 'Vrzi'
def vrzi():
  global igra_poteka, vojna_poteka
  global izid, igralec, delivec

  if igra_poteka:
    # Zadnja vržena karta delivca in igralca
    if delivec.zaloga and igralec.zaloga:
      karta_d = delivec.zaloga[-1].vrni_opis()
      karta_i = igralec.zaloga[-1].vrni_opis()

      # Če je vojna
      if karta_d == karta_i:
        vojna_poteka = True
        delivec.vrzi_karto()
        delivec.vrzi_karto()
        igralec.vrzi_karto()
        igralec.vrzi_karto()
        izid = "Vojna!"

      # Sicer (če ni vojne)
      else:
        # Delivec ima višjo karto, kar pomeni,
        # da dobi svoje in igralčeve karte
        vojna_poteka = False
        if VREDNOSTI[karta_d] > VREDNOSTI[karta_i]:
          for karta in igralec.zaloga:
            delivec.vstavi_karto(karta)
          for karta in delivec.zaloga:
            delivec.vstavi_karto(karta)
          if not igralec.karte:
            igra_poteka = False
            izid = "Jack je zmagal! Nova igra?"
            REZULTAT["SKUPAJ"] += 1
        # Igralec dobi vse karte
        else:
          for karta in delivec.zaloga:
            igralec.vstavi_karto(karta)
          for karta in igralec.zaloga:
            igralec.vstavi_karto(karta)
          if not delivec.karte:
            igra_poteka = False
            izid = "Zmagal si! Nova igra?"
            REZULTAT["SKUPAJ"] += 1
            REZULTAT["ZMAGE"] += 1

      if not vojna_poteka:
        delivec.zaloga = []
        igralec.zaloga = []
        izid = "Vrzi karto..."

    delivec.vrzi_karto()
    igralec.vrzi_karto()
    izpis()


# Določi krmilnik izpisa/izrisa
def izpis():
  # Izbriši vsebino platna
  platno.delete("all")

  global igra_poteka, izid, igralec, delivec
  igralec.izpis(platno, [50, 230])
  delivec.izpis(platno, [50, 410])

  txt1 = "Vojna"
  txt2 = "Tvoje karte (" + str(igralec.stevilo()) + ")"
  txt3 = "Jackove karte (" + str(delivec.stevilo()) + ")"
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
okno.title("Vojna")
okno.geometry("840x640")

okvir = tk.Frame(okno)
okvir.grid(row=0, column=0, pady=20)

platno = tk.Canvas(okno, width=650, height=600)
platno.configure(bg="darkgreen")
platno.grid(row=0, column=1, pady=20)

# Naloži slike kart. Slike kart so v podmapi 'karte',
# ki je v isti mapi kot datoteka 'vojna.py'
KARTE = {'BG': tk.PhotoImage(file="karte/BG.gif")}
for barva in BARVE:
  for opis in OPISI:
    karta = barva + opis
    datoteka = "karte/" + karta + ".gif"
    KARTE[karta] = tk.PhotoImage(file=datoteka)

# Ustvari gumbe in jih poveži z dogodkovnimi krmilniki
gumb1 = tk.Button(okvir, text="Deli", command=deli)
gumb1.configure(width=10)
gumb1.grid(row=0, column=0, padx=45)
gumb2 = tk.Button(okvir, text="Vrzi", command=vrzi)
gumb2.configure(width=10)
gumb2.grid(row=1, column=0, padx=45)

# Zaženi dogodkovno zanko
deli()
okno.mainloop()
