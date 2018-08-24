# encoding: utf-8
import tkinter as tk
import random

# Definicija globalnih spremenljivk
SIRINA = 400
VISINA = 300

# Ustvari okno in platno
okno = tk.Tk()
okno.title("Kvadrati")
okno.geometry("660x350")

okvir = tk.Frame(okno)
okvir.grid(row=0, column=0, pady=20)

platno = tk.Canvas(okno, width=SIRINA, height=VISINA)
platno.configure(bg="black")
platno.grid(row=0, column=1, pady=20)

# Poveži funkcije z dogodkovnimi krmilniki
opis = tk.Label(okvir, text="Vnesi število kvadratov")
opis.configure(width=20)
opis.grid(row=0, column=0, padx=45)
vnos = tk.Entry(okvir, width=10)
vnos.grid(row=1, column=0, padx=45)
vnos.bind('<Return>', (lambda _: krmilnik(vnos)))


# Definicija razreda 'Kvadrat'
class Kvadrat:

  # Ustvari objekt 'Kvadrat' s privzeto barvo in dolžino
  def __init__(self, barva="white", d=30):
    self.oblika = platno.create_rectangle(10, 10, d, d, \
                                          fill=barva)
    self.hitrost_x = random.randrange(-10, 10)
    self.hitrost_y = random.randrange(-10, 10)

  # Metoda, ki med animacijo premakne objekt
  def premakni(self):
    platno.move(self.oblika, self.hitrost_x, self.hitrost_y)
    polozaj = platno.coords(self.oblika)
    if polozaj[3] >= VISINA or polozaj[1] <= 0:
      self.hitrost_y = -self.hitrost_y
    if polozaj[2] >= SIRINA or polozaj[0] <= 0:
      self.hitrost_x = -self.hitrost_x


barve  = ["red", "green", "blue", "yellow", \
          "orange", "magenta", "cyan"]
kvadrati = []

# Dodaj 100 kvadratov naključnih velikosti in barv
for i in range(100):
  kvadrati.append(Kvadrat(random.choice(barve), \
                          random.randrange(20, 80)))

# Določi krmilnik vnosa
def krmilnik(vnos):
  global kvadrati

  # Izbriši vsebino platna
  platno.delete("all")

  kvadrati = []
  # Dodaj kvadrate naključnih velikosti in
  stevilo = 100
  vrednost = vnos.get()
  if vrednost.isdigit():
    stevilo = int(vrednost)
  for i in range(stevilo):
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
