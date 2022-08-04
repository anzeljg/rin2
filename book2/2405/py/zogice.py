# encoding: utf-8
import tkinter as tk
import random

# Definicija globalnih spremenljivk
SIRINA = 400
VISINA = 300

# Ustvari okno in platno
okno = tk.Tk()
okno.title("Žogice")

platno = tk.Canvas(okno, width=SIRINA, height=VISINA)
platno.configure(bg="black")
platno.pack()

# Definicija razreda 'Zoga' 
class Zoga:

  # Ustvari objekt 'Zoga' s privzeto barvo in velikostjo
  def __init__(self, barva="white", premer=30):
    self._lik = platno.create_oval(10, 10, premer, premer, \
                                   fill=barva)
    self._hitrost_x = random.randrange(-10, 10)
    self._hitrost_y = random.randrange(-10, 10)

  # Metoda, ki med animacijo premakne objekt
  def premakni(self):
    platno.move(self._lik, self._hitrost_x, self._hitrost_y)
    polozaj = platno.coords(self._lik)
    if polozaj[3] >= VISINA or polozaj[1] <= 0:
      self._hitrost_y = -self._hitrost_y
    if polozaj[2] >= SIRINA or polozaj[0] <= 0:
      self._hitrost_x = -self._hitrost_x


barve  = ["red", "green", "blue", "yellow", \
          "orange", "magenta", "cyan"]
zogice = []

# Dodaj 100 žogic naključnih velikosti in barv
for i in range(100):
  zogice.append(Zoga(random.choice(barve), \
                     random.randrange(20, 80)))

# Določi animacijo
def animacija():
  for zogica in zogice:
    zogica.premakni()
  okno.update()
  okno.after(20, animacija)

# Zaženi dogodkovno zanko
animacija()
okno.mainloop()
