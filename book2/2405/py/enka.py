# encoding: utf-8
import tkinter as tk
import random
import time

VEL = (80, 120) # Velikost posamezne karte
SRED = (40, 60) # Središče posamezne karte

# Definicija globalnih spremenljivk
igra_poteka = False
napoved_ena = False
izid = "Vrzi karto..."
REZULTAT = {"SKUPAJ":0, "ZMAGE":0}

# Definicija globalnih spremenljivk za karte
BARVE = ("R", "Y", "G", "B") # Club/Spade/Heart/Diamond
OPISI = ("0", "1", "2", "3", "4", "5", "6", "7", "8",
         "9", "R", "S", "D")


# Definicija razreda 'Karta'
class Karta:

  # Ustvari objekt 'Karta'
  def __init__(self, barva, opis):
    if ((barva in BARVE) and (opis in OPISI)) or \
       ((barva == "S") and (opis in ("D", "W"))):
      self.barva = barva
      self.opis = opis
    else:
      self.barva = None
      self.opis = None
      print("Neveljavna karta: ", barva, opis)

  # Vrne dvo-znakovno predstavitev karte
  def __str__(self):
    return self.barva + self.opis

  # Primerja dve karti, uporabno pri sortiranju
  def __lt__(self, druga):
    return str(self) < str(druga)

  def __gt__(self, druga):
    return str(self) > str(druga)

  def __eq__(self, druga):
    return str(self) == str(druga)

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

  # Ustvari objekt 'Komplet', ki vsebuje 108 kart:
  # - dvakrat številke od 1 do 9 vsake barve; 2*4*9 = 72
  # - dvakrat stop, +2 in obrni vsake barve; 2*4*3 = 24
  # - enkrat 0; 1*4*1 = 4
  # - štirikrat +4 in zamenjava barve; 4*1*2 = 8
  def __init__(self):
    self.karte = []
    for barva in BARVE:
      for opis in OPISI:
        karta = Karta(barva, opis)
        self.karte.append(karta)
      # Še enkrat vse karte iste barve, razen 0
      for opis in OPISI[1:]:
        karta = Karta(barva, opis)
        self.karte.append(karta)
    # Štirikrat dodaj +4 in poljubna barva
    for i in range(4):
      karta = Karta("S", "D") # +4
      self.karte.append(karta)
      karta = Karta("S", "W") # poljubna barva
      self.karte.append(karta)

  # Vrne besedilno predstavitev kompleta kart
  def __str__(self):
    sporocilo = "Komplet vsebuje"
    for karta in self.karte:
      sporocilo += " " + str(karta)
    return sporocilo

  # Premešaj komplet kart
  def premesaj(self):
    random.shuffle(self.karte)

  # Sprazni komplet kart
  def sprazni(self):
    self.karte = []

  # Deli naslednjo karto iz kompleta
  def deli_karto(self):
    return self.karte.pop()

  # Izriše karte, ki sta jih odvrgla igralec in delivec
  def izpis(self, platno, poz):
    ROB = 35
    i = 0
    ODMIK = [[20, 0], [0, 20], [-20, 0], [0, -20], \
             [10, 10], [-10, 10], [-10, -10], [10, -10]]
    for karta in self.karte:
      x = poz[0] + ODMIK[i%8][0]
      y = poz[1] + ODMIK[i%8][1]
      karta.izpis(platno, [x, y], False)
      i += 1


# Definicija razreda 'Igralec'
class Igralec(Komplet):

  # Ustvari objekt 'Igralec'
  def __init__(self):
    self.karte = []

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

  # Preveri, če ima igralec še eno karto iste
  # barve in vrednosti vrednosti med 0 in 9
  def ima_isto_karto(self, karta):
    if (karta in self.karte and
        "0" <= karta.opis <= "9"):
      return self.karte.index(karta)
    else:
      return -1

  # Igralcu odvzame objekt 'Karta' in ga da med odložene
  def vrzi_karto(self, indeks):
    global odlozene
    if self.karte:
      karta = self.karte[indeks]
      odlozene.karte.append(karta)
      del self.karte[indeks]

  # Vrne število kart, ki jih ima igralec
  def stevilo(self):
    return len(self.karte)

  # Izriše karte, ki jih ima igralec in pri tem
  # uporabi metodo izpis razreda 'Karta'
  def izpis(self, platno, poz, hrbet=True):
    # Izpis obrnjenih kart, ki jih ima igralec
    # še v roki. Vse karte so obrnjene
    if hrbet:
      ROB = 10
    else:
      ROB = 35
    i = 0
    for karta in self.karte:
      karta.izpis(platno, [poz[0]+i*ROB, poz[1]], hrbet)
      i += 1


# Določi krmilnik gumba 'Deli'
def deli():
  global komplet, odlozene
  komplet = Komplet()
  komplet.premesaj()
  odlozene = Komplet()
  odlozene.sprazni()

  global igra_poteka, igralec, delivec
  # Preveri, ali igra poteka
  if igra_poteka:
    igra_poteka = False
    REZULTAT["SKUPAJ"] += 1

  igra_poteka = True
  igralec = Igralec()
  delivec = Igralec()
  # Izmenično razdeli 6 kart igralcu in delivcu
  for i in range(6):
    igralec.dodaj_karto(komplet.deli_karto())
    delivec.dodaj_karto(komplet.deli_karto())
  print("Igralec: "+str(igralec))
  print("Delivec: "+str(delivec))
  igralec.karte = sorted(igralec.karte)

  # Vleci začetno karto
  zacetna = False
  while not zacetna:
    karta = komplet.karte.pop()
    if ("0" <= karta.opis <= "9"):
      # Dodaj karto med odložene
      odlozene.karte.append(karta)
      zacetna = True
    else:
      # Vrni karto v komplet
      komplet.karte.insert(0, karta)
  izpis()

# Krmilnik za klik miške na karto, igralec vrže karto
def vrzi(polozaj):
  print(polozaj)
  global igralec, delivec, izid, igra_poteka

  if igra_poteka:
    # Če ima igralec vsaj eno ali več kart
    if igralec.stevilo() > 0:
      # Skupna širina izrisanih kart (razen zadnje karte)
      # Zadnja karta je izrisana v celoti => VEL[0]
      ROB = 35
      SIRINA = (igralec.stevilo()-1) * ROB
      # Pravokotnik, v katerem so izrisane karte igralca
      x1, y1 = [50, 400] 
      x2, y2 = [x1+SIRINA+VEL[0], y1+VEL[1]]

      if y1 <= polozaj.y <= y2:
        if x1 <= polozaj.x < x1+SIRINA:
          indeks = (polozaj.x - x1) // ROB
        if x1+SIRINA <= polozaj.x <= x1+SIRINA+VEL[0]:
          indeks = igralec.stevilo()-1

        karta = igralec.karte[indeks]
        vrh = odlozene.karte[-1] # Zadnja odložena karta

        # Če je karta prave barve ali vrednosti oziroma je
        # posebna karta (ZAMENJAJ BARVO ali +4), potem jo
        # lahko odvržeš...
        if (karta.barva == vrh.barva or vrh.barva == "S" or \
            karta.opis == vrh.opis or karta.barva == "S"):
          igralec.vrzi_karto(indeks) # Vrzi kliknjeno karto

          # Vrzi še drugo karto iste barve in vrednosti
          indeks2 = igralec.ima_isto_karto(karta)
          if indeks2 > -1:
            igralec.vrzi_karto(indeks2)

          # Če karta ni STOP ali OBRNI potem je na
          # potezi delivec
          if karta.opis not in ["R", "S"]:
            izid = "Jack vrže karto..."
            izpis()
            timer = okno.after(2000, vrzi2)
          else:
            izid = "Vrzi še eno karto..."

    # Preveri, ali je igre konec
    if (igralec.stevilo() == 0 or delivec.stevilo() == 0):
      igra_poteka = False
      if igralec.stevilo() == 0:
        izid = "Zmagal si..."
        REZULTAT["ZMAGE"] += 1
      else:
        izid = "Jack je zmagal..."
      REZULTAT["SKUPAJ"] += 1
  izpis()

# Krmilnik štoparice/timer-ja, delivec vrže karto
def vrzi2():
  global igralec, delivec, izid, igra_poteka, napoved_ena

  if igra_poteka:
    vrh = odlozene.karte[-1] # Zadnja odložena karta
    najdena = False # Ima delivec karto, ki jo bo vrgel
    #vrzena = None # Karta, ki jo bo vrgel delivec

    # Igralec ni napovedal "Ena" oziroma "Uno"
    # pa bi moral, mu dodaj dodatno karto
    if igralec.stevilo() == 1 and not napoved_ena:
      igralec.dodaj_karto(komplet.deli_karto())

    # Igralec je napovedal "Ena" oziroma "Uno"
    # Preveri, če je napoved pravilna in jo izbriši
    if napoved_ena and vrh.opis not in ["R", "S"]:
      napoved_ena = False
      oznaka.configure(text="")
      # Če je napoved prezgodnja, potem dodaj
      # igralcu dve dodatni karti
      if igralec.stevilo() > 1:
        igralec.dodaj_karto(komplet.deli_karto())
        igralec.dodaj_karto(komplet.deli_karto())

    # Če je igralec vrgel karto +2 ali +4,
    # dodaj karte delivcu
    if vrh.opis == "D":
      delivec.dodaj_karto(komplet.deli_karto())
      delivec.dodaj_karto(komplet.deli_karto())
      # Če je karta +4 dodaj igralcu še dve karti
      if vrh.barva == "S":
        delivec.dodaj_karto(komplet.deli_karto())
        delivec.dodaj_karto(komplet.deli_karto())

    # Če je igralec vrgel posebno karto (SPREMENI BARVO
    # ali +4) lahko delivec vrže katerokoli karto
    if vrh.barva == "S":
        karta = delivec.karte[0] # Prva karta
        delivec.vrzi_karto(0)
        vrzena = karta
        najdena = True

    # Delivec najprej odvrže karto iste barve, če jo ima
    if not najdena:
      indeks = 0
      for karta in delivec.karte:
        if karta.barva == vrh.barva:
          delivec.vrzi_karto(indeks)
          vrzena = karta
          najdena = True
          break
        indeks += 1

    # Če delivec nima karte iste barve, odvrže karto iste
    # vrednosti, če jo ima
    if not najdena:
      indeks = 0
      for karta in delivec.karte:
        if karta.opis == vrh.opis:
          delivec.vrzi_karto(indeks)
          vrzena = karta
          najdena = True
          break
        indeks += 1

    # Če delivec nima karte iste vrednosti, odvrže posebno
    # karto (ZAMENJAJ BARVO ali +4), če jo ima
    if not najdena:
      indeks = 0
      for karta in delivec.karte:
        if karta.barva == "S" and karta.opis in ["D", "W"]:
          delivec.vrzi_karto(indeks)
          vrzena = karta
          najdena = True
          break
        indeks += 1

    # Če je delivec vrgel karto, ki ni STOP ali OBRNI,
    # potem je znova na potezi igralec
    if najdena and vrzena.opis not in ["R", "S"]:
      # Če je delivec vrgel karto +2 ali +4,
      # dodaj karte igralcu
      izid = "Vrzi karto..."
      if vrzena.opis == "D":
        igralec.dodaj_karto(komplet.deli_karto())
        igralec.dodaj_karto(komplet.deli_karto())
        # Če je karta +4 dodaj igralcu še dve karti
        if vrzena.barva == "S":
          igralec.dodaj_karto(komplet.deli_karto())
          igralec.dodaj_karto(komplet.deli_karto())
        igralec.karte = sorted(igralec.karte)
    else:
      izid = "Jack vrže še eno karto..."

    # Če delivec ne more odvreči nobene karte, potem vleče
    # karto in jo, če je ustrezna, tudi odvrže
    if not najdena:
      delivec.dodaj_karto(komplet.deli_karto())
      izid = "Jack je vlekel karto. Vrzi karto..."

    # Preveri, ali je igre konec
    if (igralec.stevilo() == 0 or delivec.stevilo() == 0):
      igra_poteka = False
      if igralec.stevilo() == 0:
        izid = "Zmagal si..."
        REZULTAT["ZMAGE"] += 1
      else:
        izid = "Jack je zmagal..."
      REZULTAT["SKUPAJ"] += 1
  izpis()

# Določi krmilnik gumba 'Vleci'
def vleci():
  global igralec, komplet
  igralec.dodaj_karto(komplet.deli_karto())
  igralec.karte = sorted(igralec.karte)
  izpis()

# Določi krmilnik gumba 'Naprej'
def naprej():
  vrzi2()

def napoved():
  global napoved_ena
  if napoved_ena:
    napoved_ena = False
    oznaka.configure(text="")
  else:
    napoved_ena = True
    oznaka.configure(text="Ena!")

# Določi krmilnik izpisa/izrisa
def izpis():
  # Izbriši vsebino platna
  platno.delete("all")

  global igra_poteka, izid
  global igralec, delivec, odlozene

  delivec.izpis(platno, [50, 230], True)
  igralec.izpis(platno, [50, 410], False)
  odlozene.izpis(platno, [400, 200])

  txt1 = "Enka"
  txt2 = "Jackove karte (" + str(delivec.stevilo()) + ")"
  txt3 = "Tvoje karte (" + str(igralec.stevilo()) + ")"
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
okno.title("Enka")
okno.geometry("840x640")

okvir = tk.Frame(okno)
okvir.grid(row=0, column=0, pady=20)

platno = tk.Canvas(okno, width=650, height=600)
platno.configure(bg="darkgreen")
platno.bind("<Button-1>", vrzi) # Klik na levi gumb miške
platno.grid(row=0, column=1, pady=20)

# Naloži slike kart. Slike kart so v podmapi 'uno',
# ki je v isti mapi kot datoteka 'enka.py'
KARTE = {
  'BG': tk.PhotoImage(file="uno/BG.gif"),
  'SD': tk.PhotoImage(file="uno/SD.gif"),
  'SW': tk.PhotoImage(file="uno/SW.gif")
}
for barva in BARVE:
  for opis in OPISI:
    karta = barva + opis
    datoteka = "uno/" + karta + ".gif"
    KARTE[karta] = tk.PhotoImage(file=datoteka)

# Ustvari gumbe in jih poveži z dogodkovnimi krmilniki
gumb1 = tk.Button(okvir, text="Deli", command=deli)
gumb1.configure(width=10)
gumb1.grid(row=0, column=0, padx=45)
gumb2 = tk.Button(okvir, text="Vleci", command=vleci)
gumb2.configure(width=10)
gumb2.grid(row=1, column=0, padx=45)
gumb3 = tk.Button(okvir, text="Naprej", command=naprej)
gumb3.configure(width=10)
gumb3.grid(row=2, column=0, padx=45)
gumb4 = tk.Button(okvir, text="Ena!", command=napoved)
gumb4.configure(width=10)
gumb4.grid(row=3, column=0, padx=45)
oznaka = tk.Label(okvir, text="")
oznaka.configure(width=10)
oznaka.grid(row=4, column=0, padx=45)

# Zaženi dogodkovno zanko
deli()
okno.mainloop()
