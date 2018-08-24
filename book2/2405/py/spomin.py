# encoding: utf-8
import tkinter as tk
import random

# Definicija globalnih spremenljivk
VEL = 48   # velikost ploščice (npr. 48x48)
ROB = 8    # rob/obroba med ploščicami
stanje = 0 # globalno stanje igre
poteza = 0 # globalni števec potez

SIRINA = (ROB+VEL) * 16 + ROB
VISINA = (ROB+VEL) * 2

# Nariše zakrite in odkrite ploščice
def narisi(platno):
  global VEL, ROB
  global komplet, odkrito
  for i in range(16):
    KORAK = ROB // 4 + (ROB+VEL) * i
    platno.create_polygon(
      [(KORAK+ROB, ROB),
       (KORAK+ROB+VEL, ROB),
       (KORAK+ROB+VEL, ROB+VEL),
       (KORAK+ROB, ROB+VEL)
      ], width=VEL // 2, fill="darkgreen")
    if (odkrito[i]):
      polozaj = (KORAK+ROB+VEL // 2, ROB+VEL // 2)
      platno.create_text(polozaj, fill="white", \
        text=str(komplet[i]), font=("Times", VEL // 2))

# Rokovalnik za klik miške na gumb 'Znova'
def znova():
  global komplet, odkrito, stanje
  global poteza, prva, druga
  stanje = 0  # Ponastavi globalno stanje igre
  poteza = 0  # Ponastavi globalni števec potez
  napis.configure(text="Št. potez = 0") # Ponastavi napis
  odkrito = [False]*16 # Vse ploščice so neodkrite
  ploscice = list(range(8))
  # Komplet sestavljata dve množici ploščic
  komplet = ploscice + ploscice
  random.shuffle(komplet) # Premešaj komplet
  prva = -1  # Prva izbrana ploščica
  druga = -1 # Druga izbrana ploščica
  narisi(platno)

# Rokovalnik za klik miške na ploščico
def klik(polozaj):
  global komplet, odkrito, stanje
  global poteza, prva, druga
  global VEL, ROB, platno
  # Preveri, katera ploščica je bila kliknjena
  if (polozaj.y > ROB and polozaj.y <= ROB+VEL):
    trenutna = polozaj.x // (ROB+VEL)
    if (not odkrito[trenutna]):
      odkrito[trenutna] = True
      if stanje == 0:
        stanje = 1
        prva = trenutna
      elif stanje == 1:
        stanje = 2
        druga = trenutna
        poteza += 1 # Posodobi števec potez
        napis.configure(text="Št. potez = " + str(poteza))
      else:
        stanje = 1
        if (komplet[prva] != komplet[druga]):
          odkrito[prva] = False
          odkrito[druga] = False
        prva = trenutna
    narisi(platno)

# Ustvari okno, okvir in platno
okno = tk.Tk()
okno.title("Spomin")
okno.geometry(str(SIRINA + 190) + "x" + str(VISINA + 40))

okvir = tk.Frame(okno)
okvir.grid(row=0, column=0, pady=20)

# Poveži funkcije z dogodkovnimi rokovalniki
platno = tk.Canvas(okno, width=SIRINA, height=VISINA)
platno.configure(bg="black")
platno.bind("<Button-1>", klik) # Klik na levi gumb miške
platno.grid(row=0, column=1, pady=20)

gumb = tk.Button(okvir, text="Znova", command=znova)
gumb.configure(width=10)
gumb.grid(row=0, column=0, padx=45)

napis = tk.Label(okvir, text="Št. potez = 0")
napis.grid(row=1, column=0)

# Poženi celotno zadevo
znova()
okno.mainloop()
