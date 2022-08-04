# encoding: utf-8
import tkinter as tk
import random

# Definicija globalnih spremenljivk
SIRINA = 400
VISINA = 300

# Ustvari okno in platno
okno = tk.Tk()
okno.title("Kvadrati")

platno = tk.Canvas(okno, width=SIRINA, height=VISINA)
platno.configure(bg="black")
platno.pack()

# Definicija razreda 'Kvadrat'
class Kvadrat:

  # Ustvari objekt 'Kvadrat' s privzeto barvo in dolžino
  def __init__(self, barva="white", d=30):
    self._oblika = platno.create_rectangle(10, 10, d, d, \
                                           fill=barva)
    self._hitrost_x = random.randrange(-10, 10)
    self._hitrost_y = random.randrange(-10, 10)

  # Metoda, ki med animacijo premakne objekt
  def premakni(self):
    platno.move(self._oblika, self._hitrost_x, self._hitrost_y)
    polozaj = platno.coords(self._oblika)
    if polozaj[3] >= VISINA or polozaj[1] <= 0:
      self._hitrost_y = -self._hitrost_y
    if polozaj[2] >= SIRINA or polozaj[0] <= 0:
      self._hitrost_x = -self._hitrost_x


barve  = ["red", "green", "blue", "yellow", \
          "orange", "magenta", "cyan"]
kvadrati = []

# Dodaj 100 kvadratov naključnih velikosti in barv
for i in range(100):
  kvadrati.append(Kvadrat(random.choice(barve), \
                          random.randrange(20, 80)))

# Določi animacijo
def animacija():
  for kvadrat in kvadrati:
    kvadrat.premakni()
  okno.update()
  okno.after(20, animacija)

# Zaženi dogodkovno zanko
animacija()
okno.mainloop()
